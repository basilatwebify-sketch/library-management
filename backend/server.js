const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log("MySQL Connected");
});

/* CREATE */
app.post("/books", (req, res) => {
  const { title, author, isbn } = req.body;

  db.query(
    "INSERT INTO books(title,author,isbn) VALUES(?,?,?)",
    [title, author, isbn],
    (err, result) => {
      if (err) return res.status(500).json(err);

      res.json({
        message: "Book Added",
      });
    }
  );
});

/* READ */
app.get("/books", (req, res) => {
  db.query("SELECT * FROM books", (err, result) => {
    if (err) return res.status(500).json(err);

    res.json(result);
  });
});

/* UPDATE */
app.put("/books/:id", (req, res) => {
  const id = req.params.id;
  const { title, author, isbn } = req.body;

  db.query(
    "UPDATE books SET title=?,author=?,isbn=? WHERE id=?",
    [title, author, isbn, id],
    (err, result) => {
      if (err) return res.status(500).json(err);

      res.json({
        message: "Book Updated",
      });
    }
  );
});

/* DELETE */
app.delete("/books/:id", (req, res) => {
  const id = req.params.id;

  db.query(
    "DELETE FROM books WHERE id=?",
    [id],
    (err, result) => {
      if (err) return res.status(500).json(err);

      res.json({
        message: "Book Deleted",
      });
    }
  );
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on ${process.env.PORT}`);
});