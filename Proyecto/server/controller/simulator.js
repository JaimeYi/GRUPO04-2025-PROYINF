const { Router } = require("express");
const { rate } = require("financial");
const pool = require("../db");
const { verifyToken } = require("../middleware/verifyToken.js");
const router = Router();

router.post("/api/simulator/calculateCredit", async (req, res) => {
    creditData = req.body;

    // --- Definicion de variables ---
    const gastosExtras = 3000;
    const costoPorSeguro = 3000;
    let tasaInteres = 0.0219; // valor temporal para la tasa de interes, consultar con cliente monto real
    const numeroDePeriodos = creditData.plazoCredito;

    

    // --- Realizacion de calculos ---
    const costoSeguros =
        (creditData.seguroDeCesantia + creditData.seguroDeDegravamen) *
        costoPorSeguro; // consultar con cliente como definir los costos de los seguros asociados al credito

    const principalTotalFinanciado =
        creditData.montoSimulacion + gastosExtras + costoSeguros;

    const cuotaMensual = Math.round(
        (principalTotalFinanciado *
            tasaInteres *
            (1 + tasaInteres) ** numeroDePeriodos) /
            ((1 + tasaInteres) ** numeroDePeriodos - 1)
    );

    const ctc = cuotaMensual * numeroDePeriodos;

    const tasaMensualReal = rate(
        numeroDePeriodos,
        -1 * cuotaMensual,
        creditData.montoSimulacion,
        0,
        0,
        0.01
    );
    let cae = (1 + tasaMensualReal) ** 12 - 1;

    try {
        if (creditData.userType === "noCliente") {
            const result = await pool.query(
                "INSERT INTO historialSimulacion (montoSimulado, plazoCredito, seguroDeDegravamen, seguroDeCesantia, CTC, cuotaMensual, tasaInteres, CAE, costosSeguros, guestID) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)",
                [
                    creditData.montoSimulacion,
                    numeroDePeriodos,
                    creditData.seguroDeDegravamen,
                    creditData.seguroDeCesantia,
                    ctc,
                    cuotaMensual,
                    tasaInteres,
                    cae,
                    costoSeguros,
                    creditData.userID,
                ]
            );
        } else if (creditData.userType === "cliente") {
            const result = await pool.query(
                "INSERT INTO historialSimulacion (montoSimulado, plazoCredito, seguroDeDegravamen, seguroDeCesantia, CTC, cuotaMensual, tasaInteres, CAE, costosSeguros, rutUsuario) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)",
                [
                    creditData.montoSimulacion,
                    numeroDePeriodos,
                    creditData.seguroDeDegravamen,
                    creditData.seguroDeCesantia,
                    ctc,
                    cuotaMensual,
                    tasaInteres,
                    cae,
                    costoSeguros,
                    creditData.userID,
                ]
            );
        }
    } catch (err) {
        console.log(err);
    }

    console.log("Simulacion almacenada correctamente");

    tasaInteres = tasaInteres * 100;
    cae = cae.toFixed(4) * 100;

    res.status(200).json({
        cuotaMensual,
        ctc,
        tasaInteres,
        cae,
        costoSeguros,
    });
});

router.get(
    "/api/simulator/simulationHistory",
    verifyToken,
    async (req, res) => {
        const userType = req.user.userType;
        const userID = req.user.sessionId;

        try {
            if (userType === "noCliente") {
                const result = await pool.query(
                    "SELECT * FROM historialsimulacion WHERE guestID = $1 ORDER BY idsimulacion DESC LIMIT 10",
                    [userID]
                );
                res.status(200).json(result.rows);
            } else if (userType === "cliente") {
                const result = await pool.query(
                    "SELECT * FROM historialsimulacion WHERE rutUsuario = $1  ORDER BY idsimulacion DESC LIMIT 10",
                    [userID]
                );
                res.status(200).json(result.rows);
            }
        } catch (err) {
            console.log(err);
        }
    }
);

module.exports = router;
