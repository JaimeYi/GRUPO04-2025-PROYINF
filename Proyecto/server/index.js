require('dotenv').config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const port = 5000;

const app = express();

const userManagementRoutes = require("./src/routes/userManagement.routes");
const simulator = require("./src/routes/simulator.routes");
const pdfParser = require("./src/routes/iaHelper.routes");
const scoring = require("./src/routes/scoring.routes");

// --- Middlewares ---
app.use(express.json()); // lectura de JSON
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
); // habilitar request y respons entre distintos puertos
app.use(cookieParser()); // habilitar lectura y escritura de Cookies

// --- Rutas ---
app.use(userManagementRoutes);
app.use(simulator);
app.use(pdfParser);
app.use(scoring);

app.get("/", (req, res) => {
    res.send("<h1>Home página créditos de consumo</h1>");
});


app.listen(port, () => {
    console.log(`App corriendo en http://localhost:${port}`);
});
