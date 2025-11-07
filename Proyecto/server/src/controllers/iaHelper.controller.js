const {iaCall} = require("../services/iaHelper.service")

getSalaryPDF = (async (req, res) => {
    const prompt = "Eres un experto analizador de contratos laborales, en esta ocasion se te proporcionaran liquidaciones de sueldo. debes analizar las liquidaciones de sueldo y retornar unicamente el sueldo que se describe en el documento. en caso de no tener un monto valido, retorna -1.";
    if (!req.file) {
        return res.status(400).json({ error: "Falta el archivo PDF." });
    }

    const aiCallResult = await iaCall(req, prompt);

    if (aiCallResult === -1){
        res.status(500).json({error: "Error al analizar PDF."});
    } else {
        res.json({"answer": aiCallResult});
    }
})

module.exports = {getSalaryPDF};