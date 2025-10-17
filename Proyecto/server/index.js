const express = require("express");
const cors = require("cors");
const port = 5000;

const app = express();

const userManagementRoutes = require("./controller/userManagement");

// Ruta de prueba que guarda un mensaje en la base de datos
// app.get("/save", async (req, res) => {
//     try {
//         await pool.query(
//             "CREATE TABLE IF NOT EXISTS messages (id SERIAL PRIMARY KEY, content TEXT)"
//         );
//         await pool.query("INSERT INTO messages (content) VALUES ($1)", [
//             "Hola desde PostgreSQL!",
//         ]);
//         res.send("Mensaje guardado en la base de datos");
//     } catch (err) {
//         console.error(err);
//         res.status(500).send("Error");
//     }
// });

// Ruta para obtener todos los mensajes
// app.get("/messages", async (req, res) => {
//     try {
//         const result = await pool.query("SELECT * FROM messages");
//         res.json(result.rows);
//     } catch (err) {
//         console.error(err);
//         res.status(500).send("Error");
//     }
// });

// middlewares
app.use(express.json()); // lectura de JSON
app.use(cors()); // habilitar request y respons entre distintos puertos

app.use(userManagementRoutes);

app.get("/", (req, res) => {
    res.send("<h1>Home página créditos de consumo</h1>");
});

app.listen(port, () => {
    console.log(`App corriendo en http://localhost:${port}`);
});
