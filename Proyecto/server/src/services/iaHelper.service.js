const { GoogleGenAI } = require("@google/genai");
const fs = require("fs");
const {fileToGenerativePart} = require("../utils/pdfToBase64")

const ai = new GoogleGenAI({});

iaCall = (async (req, prompt) => {
    try {
        const pdfPart = fileToGenerativePart(req.file.path, "application/pdf");
        fs.unlinkSync(req.file.path);

        const parts = [
            {text: prompt},
            pdfPart,
        ];

        const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: parts,
        });
        const text = response.text;

        return text;
    } catch (error){
        console.log("Error procesando con Gemini 2.5: ", error);
        return -1;
    }
});

iaValidation = (async (req, prompt, iaCallResult) => {
    try {
        const fullName = req.body.fullName;
        const rut = req.body.rut;

        const finalPromptText = `
        CONTEXTO DEL USUARIO:
        - Nombre: ${fullName}
        - RUT: ${rut}

        RESULTADO PREVIO DEL SISTEMA:
        ${iaCallResult}

        INSTRUCCIÓN A REALIZAR:
        ${prompt}
        `;

        const parts = [
            {text: finalPromptText}
        ]

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: parts
        });
        const text = response.text;

        return text;
    } catch (error){
        console.log("Error procesando con Gemini 2.5: ", error);
        return -1;
    }
})

module.exports = {iaCall, iaValidation};