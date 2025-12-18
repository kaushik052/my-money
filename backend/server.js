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

// Get categories by type (expense / income)
app.get("/api/categories", (req, res) => {
  const { type } = req.query;

  if (!type) {
    return res.status(400).json({ message: "Category type is required" });
  }

  const sql = `
    SELECT id, category_name, category_color
    FROM categories
    WHERE category_type = ?
    ORDER BY id DESC
  `;

  db.query(sql, [type], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

// Add transaction
app.post("/api/transactions", (req, res) => {
  const {
    transactionType,
    accountType,
    categoryId,
    amount,
    description,
    dateTime,
  } = req.body;

  // 🔐 Basic validation
  if (!transactionType || !accountType || !categoryId || !amount || !dateTime) {
    return res.status(400).json({
      success: false,
      message: "Required fields are missing",
    });
  }

  // ❌ Block future date-time
  if (new Date(dateTime) > new Date()) {
    return res.status(400).json({
      success: false,
      message: "Future date & time not allowed",
    });
  }

  const sql = `
    INSERT INTO transactions
    (transaction_type, account_type, category_id, amount, description, transaction_datetime)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      transactionType,
      accountType,
      categoryId,
      amount,
      description || null,
      dateTime.replace("T", " "),
    ],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          success: false,
          message: "Database error",
        });
      }

      res.json({
        success: true,
        message: "Transaction saved successfully",
        id: result.insertId,
      });
    }
  );
});

app.get("/api/transactions", (req, res) => {
  const { month, year } = req.query;

  if (!month || !year) {
    return res.status(400).json({ message: "Month and year required" });
  }

  const sql = `
    SELECT 
      t.id,
      t.transaction_type,
      t.account_type,
      t.amount,
      t.description,
      t.transaction_datetime,
      DATE(t.transaction_datetime) as transaction_date,
      c.category_name
    FROM transactions t
    JOIN categories c ON c.id = t.category_id
    WHERE MONTH(t.transaction_datetime) = ?
      AND YEAR(t.transaction_datetime) = ?
    ORDER BY t.transaction_datetime DESC
  `;

  db.query(sql, [month, year], (err, rows) => {
    if (err) return res.status(500).json(err);

    // totals
    let totalIncome = 0;
    let totalExpense = 0;
    let total = 0;

    rows.forEach((r) => {
      if (r.transaction_type === "income") {
        totalIncome += Number(r.amount);
      } else {
        totalExpense += Number(r.amount);
      }
    });

    total = Number(totalIncome) - Number(totalExpense);

    res.json({
      transactions: rows,
      totalIncome,
      totalExpense,
      total,
    });
  });
});


app.listen(5000, () => {
  console.log("Server running on port 5000");
});
