const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "my_money",
});

const generateRandomColor = () => {
  return "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
};

db.connect();

// Add category
app.post("/api/categories", (req, res) => {
  const { name, type } = req.body;

  if (!name || !type) {
    return res.status(400).json({ message: "Invalid data" });
  }

  const insertCategory = () => {
    const color = generateRandomColor();

    // Check if color already exists
    const checkSql = "SELECT id FROM categories WHERE category_color = ?";
    db.query(checkSql, [color], (err, rows) => {
      if (err) return res.status(500).json(err);

      if (rows.length > 0) {
        // Color exists, try again
        insertCategory();
      } else {
        // Insert category
        const insertSql = `
          INSERT INTO categories (category_name, category_color, category_type)
          VALUES (?, ?, ?)
        `;

        db.query(insertSql, [name, color, type], (err) => {
          if (err) return res.status(500).json(err);
          res.json({ success: true, color });
        });
      }
    });
  };

  insertCategory();
});

// Get expense categories
app.get("/api/categories/expense", (req, res) => {
  const sql = `
    SELECT id, category_name, category_color
    FROM categories
    WHERE category_type = 'expense'
    ORDER BY id DESC
  `;

  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

// Get income categories
app.get("/api/categories/income", (req, res) => {
  const sql = `
    SELECT id, category_name, category_color
    FROM categories
    WHERE category_type = 'income'
    ORDER BY id DESC
  `;

  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

// Delete category
app.delete("/api/categories/:id", (req, res) => {
  const sql = "DELETE FROM categories WHERE id = ?";
  db.query(sql, [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ success: true });
  });
});

// Update category
app.put("/api/categories/:id", (req, res) => {
  const { name } = req.body;

  const sql = "UPDATE categories SET category_name = ? WHERE id = ?";
  db.query(sql, [name, req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ success: true });
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
