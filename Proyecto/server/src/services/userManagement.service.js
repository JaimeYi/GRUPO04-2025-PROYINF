const pool = require("../../db");
const bcrypt = require("bcrypt");

const registerService = async (userData) => {
    try {
        let result = await pool.query(
            "SELECT rut FROM cliente WHERE rut = ($1)",
            [userData.rut]
        );
        if (result.rowCount > 0) {
            return 4090;
        }

        result = await pool.query(
            "SELECT correo FROM cliente WHERE correo = ($1)",
            [userData.correo]
        );
        if (result.rowCount > 0) {
            return 4091;
        }

        // --- Hashear contraseña ---
        const saltRound = 10;
        const hashedPassword = await bcrypt.hash(
            userData.contrasena,
            saltRound
        );

        const newUser = await pool.query(
            "INSERT INTO cliente(rut,nombreCompleto,correo,contraseña,numerotelefono,ocupacion,ingresoLiquido,direccion) VALUES (($1),($2),($3),($4),($5),($6),($7),($8))",
            [
                userData.rut,
                userData.nombre,
                userData.correo,
                hashedPassword,
                userData.telefono,
                userData.ocupacion,
                userData.ingresoLiquido,
                userData.direccion,
            ]
        );
        return 201;
    } catch (err) {
        return 500;
    }
};

const loginService = async (rut, contrasena) => {
    try {
        const result = await pool.query(
            "SELECT * FROM cliente WHERE rut = ($1)",
            [rut]
        );

        if (result.rowCount === 0) {
            return 401;
        }

        const cliente = result.rows[0];
        const hashedPassword = cliente.contraseña;
        const matchPassword = await bcrypt.compare(contrasena, hashedPassword);

        if (!matchPassword) {
            return 401;
        }

        return cliente

    } catch (err) {
        return 500;
    }
};

module.exports = { registerService , loginService};
