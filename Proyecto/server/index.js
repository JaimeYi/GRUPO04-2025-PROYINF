const express = require("express");
const cors = require("cors");
const pool = require("./db"); // Importar la conexión
const scoringRoutes = require('./src/routes/scoring.routes');
const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());
app.use('/api/score', scoringRoutes);
app.get("/api/health", (req, res) => res.json({ ok: true }));
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
// OPCIONAL: SE PUEDE BORRAR
app.post("/api/echo", (req, res) => {
  res.json({ recibido: req.body });
});

app.get("/", (req, res) => {
    res.send("<h1>Home página créditos de consumo</h1>");
});


app.listen(port, () => {
    console.log(`App corriendo en http://localhost:${port}`);
});
