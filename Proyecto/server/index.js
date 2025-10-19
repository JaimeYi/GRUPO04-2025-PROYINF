require('dotenv').config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const port = 5000;

const app = express();

const userManagementRoutes = require("./controller/userManagement");
const simulator = require("./controller/simulator");

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

app.get("/", (req, res) => {
    res.send("<h1>Home página créditos de consumo</h1>");
});

app.listen(port, () => {
    console.log(`App corriendo en http://localhost:${port}`);
});
