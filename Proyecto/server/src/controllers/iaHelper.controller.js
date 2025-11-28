const {iaCall, iaValidation} = require("../services/iaHelper.service")
const {promptDoc, promptValidation} = require("../config/iaHelper.config")

getSalaryPDF = (async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "Falta el archivo PDF." });
    }

    const aiCallResult = await iaCall(req, promptDoc);

    if (aiCallResult === -1){
        res.status(500).json({error: "Error al analizar PDF."});
    }

    const aiValidationResult = await iaValidation(req, promptValidation, aiCallResult);

    if (aiValidationResult === -1){
        res.status(500).json({error: "Error al realizar la validación."});
    }

    res.json({"answer": aiValidationResult});
})

module.exports = {getSalaryPDF};