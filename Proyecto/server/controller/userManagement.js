const { Router } = require("express");
const bcrypt = require("bcrypt");
const pool = require("../db");

const router = Router();

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
            "SELECT rut, contraseña, nombre FROM cliente WHERE rut = ($1)",
            [rut]
        );

        if (result.rowCount === 0) {
            return res.status(401).json({
                error: "Credenciales incorrectas.",
            });
        }

        const cliente = result.rows[0];
        console.log(cliente);
        const hashedPassword = cliente.contraseña;
        const name = cliente.nombre;

        const matchPassword = await bcrypt.compare(contrasena, hashedPassword);

        if (!matchPassword) {
            return res.status(401).json({
                error: "Credenciales incorrectas.",
            });
        }

        res.status(200).json({
            message: "Login exitoso",
            name,
        });
    } catch (err) {
        return res.status(500).json({
            error: "Ocurrio un error inesperado.",
        });
    }
});

module.exports = router;
