// index.js
import express from "express";
import bodyParser from "body-parser";
import { pool } from "./db.js";
import dotenv from "dotenv";
import path from "path";
dotenv.config();

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Tabelle anlegen (falls nicht vorhanden)
async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS entries (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      message TEXT NOT NULL
    );
  `);
}
initDB();

// HTML-Formular anzeigen
app.get("/", (req, res) => {
  res.sendFile(path.resolve("public/form.html"));
});

// Formular speichern
app.post("/submit", async (req, res) => {
  const { name, message } = req.body;
  await pool.query("INSERT INTO entries (name, message) VALUES ($1, $2)", [name, message]);

  res.redirect("/entries");
});

// Einträge anzeigen
app.get("/entries", async (req, res) => {
  const result = await pool.query("SELECT * FROM entries ORDER BY id DESC");

  const html = `
    <h1>Alle Einträge</h1>
    <a href="/">Neuer Eintrag</a>
    <ul>
      ${result.rows
        .map(
          (row) => `<li><strong>${row.name}</strong>: ${row.message}</li>`
        )
        .join("")}
    </ul>
  `;
  res.send(html);
});

// Server starten
const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Server läuft auf Port " + port));
