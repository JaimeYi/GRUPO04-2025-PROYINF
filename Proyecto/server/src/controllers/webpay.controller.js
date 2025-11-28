const { WebpayPlus, Options, IntegrationApiKeys, Environment, IntegrationCommerceCodes } = require('transbank-sdk');

const tx = new WebpayPlus.Transaction(new Options(
    IntegrationCommerceCodes.WEBPAY_PLUS,
    IntegrationApiKeys.WEBPAY,           
    Environment.Integration               
));

const createTransaction = async (req, res) => {
    try {
        const { amount, buyOrder, sessionId } = req.body;
        const returnUrl = "http://localhost:3000/commit-payment"; // URL de tu frontend React donde vuelve el usuario

        const createResponse = await tx.create(
            buyOrder, 
            sessionId, 
            amount, 
            returnUrl
        );

        res.json(createResponse); 

    } catch (error) {
        console.error("Error creando transacción:", error);
        res.status(500).json({ error: "Error al iniciar pago" });
    }
};

const commitTransaction = async (req, res) => {
    try {
        const { token_ws } = req.body;

        const commitResponse = await tx.commit(token_ws);

        if (commitResponse.status === 'AUTHORIZED') {
            res.json({ message: "Pago exitoso", details: commitResponse });
        } else {
            res.json({ message: "Pago fallido o anulado", details: commitResponse });
        }

    } catch (error) {
        console.error("Error confirmando transacción:", error);
        res.status(500).json({ error: "Error al confirmar pago" });
    }
};

module.exports = { createTransaction, commitTransaction };