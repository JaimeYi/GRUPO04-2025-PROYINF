const { GoogleGenAI } = require("@google/genai");
const {Router} = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const uploadPath = path.join(__dirname, "../uploads")

const router = Router();
const ai = new GoogleGenAI({});
const upload = multer({dest: uploadPath})

function fileToGenerativePart(path, mimeType) {
    return {
        inlineData: {
            data: Buffer.from(fs.readFileSync(path)).toString("base64"),
            mimeType
        },
    };
}

router.post("/api/pdfParser/", upload.single('pdfFile'),async (req, res) => {
    const prompt = "Eres un experto analizador de contratos laborales, en esta ocasion se te proporcionaran liquidaciones de sueldo. debes analizar las liquidaciones de sueldo y retornar unicamente el sueldo que se describe en el documento. en caso de no tener un monto valido, retorna -1.";
    if (!req.file) {
        return res.status(400).json({ error: "Falta el archivo PDF." });
    }

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

        res.json({"answer": text});
    } catch (error){
        console.log("Error procesando con Gemini 2.5: ", error);
        res.status(500).json({error: "Error al analizar PDF."});
    }
})

module.exports = router;