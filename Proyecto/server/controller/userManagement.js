const { Router } = require("express");
const bcrypt = require("bcrypt");
const pool = require("../db");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middleware/verifyToken");

const router = Router();

router.post("/api/userManagement/registerNoClient", async (req, res) => {
    const userData = req.body;

    try {
        let result = await pool.query(
            "SELECT * FROM nocliente WHERE rut = ($1)",
            [userData.rut]
        );
        if (result.rowCount > 0) {
            let update = await pool.query(
                "UPDATE nocliente SET correo = ($1), numerotelefono = ($2) WHERE rut = ($3)",
                [userData.correo, userData.telefono, userData.rut]
            );
            return res.status(200).json({message: "Datos actualizados correctamente"});
        }

        result = await pool.query(
            "INSERT INTO nocliente (rut, correo, numerotelefono) VALUES ($1,$2,$3)",
            [userData.rut, userData.correo, userData.telefono]
        );

        res.status(201).json({message: "No cliente registrado en la base de datos"})
    } catch (err) {
        res.status(500).json({
            error: "Ocurrió un error interno en el servidor." });
    }
});

router.post("/api/userManagement/register", async (req, res) => {
    const userData = req.body;

    try {
        let result = await pool.query(
            "SELECT rut FROM cliente WHERE rut = ($1)",
            [userData.rut]
        );
        if (result.rowCount > 0) {
            return res.status(409).json({
                error: "Este RUT ya se ha registrado anteriormente.",
            });
        }

        result = await pool.query(
            "SELECT correo FROM cliente WHERE correo = ($1)",
            [userData.correo]
        );
        if (result.rowCount > 0) {
            return res.status(409).json({
                error: "Este correo electrónico ya se ha registrado anteriormente.",
            });
        }

        // --- Hashear contraseña ---
        const saltRound = 10;
        const hashedPassword = await bcrypt.hash(
            userData.contrasena,
            saltRound
        );

        const newUser = await pool.query(
            "INSERT INTO cliente(rut,nombre,apellido,correo,contraseña,numerotelefono) VALUES (($1),($2),($3),($4),($5),($6))",
            [
                userData.rut,
                userData.nombre,
                userData.apellido,
                userData.correo,
                hashedPassword,
                userData.telefono,
            ]
        );
        res.status(201).json({
            message: "Usuario registrado satisfactoriamente",
        });
    } catch (err) {
        return res.status(500).send("Error");
    }
});

router.post("/api/userManagement/login", async (req, res) => {
    const { rut, contrasena } = req.body;

    try {
        const result = await pool.query(
            "SELECT * FROM cliente WHERE rut = ($1)",
            [rut]
        );

        if (result.rowCount === 0) {
            return res.status(401).json({
                error: "Credenciales incorrectas.",
            });
        }

        const cliente = result.rows[0];
        const hashedPassword = cliente.contraseña;
        const name = cliente.nombre;

        const matchPassword = await bcrypt.compare(contrasena, hashedPassword);

        if (!matchPassword) {
            return res.status(401).json({
                error: "Credenciales incorrectas.",
            });
        }

        const payload = {
            rut: cliente.rut,
            mail: cliente.correo,
            name: cliente.nombre,
            lastName: cliente.apellido,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Solo enviar por HTTPS en producción
            maxAge: 3600000,
        });

        res.status(200).json({
            message: "Login exitoso",
            name,
            user: payload,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: "Ocurrio un error inesperado.",
        });
    }
});

router.post("/api/userManagement/authenticationNoClient", async (req, res) => {
    const user = req.body;

    try {
        const result = await pool.query(
            "SELECT * FROM nocliente WHERE rut = ($1)",
            [user.rut]
        );

        const noclient = result.rows[0];

        const payload = {
            rut: noclient.rut,
            mail: noclient.correo
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        res.cookie("TemporalToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Solo enviar por HTTPS en producción
            maxAge: 3600000,
        });

        res.status(200).json({
            message: "Temporal Token Ready",
            user: payload,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: "Ocurrio un error inesperado.",
        });
    }
});

router.get("/api/userManagement/verify", verifyToken, (req, res) => {
    res.status(200).json(req.user);
});

router.post("/api/userManagement/logout", (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({
        message: "Sesión cerrada correctamente.",
    });
});

module.exports = router;
