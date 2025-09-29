const express = require("express");
const pool = require("./db");

const app = express();
app.use(express.json());

// ✅ Test DB connection
app.get("/ping", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT NOW() AS current_time");
    res.json({ status: "success", time: rows[0].current_time });
  } catch (error) {
    console.error("DB Connection Error:", error.message);
    res.status(500).json({ status: "error", message: error.message });
  }
});

// GET /expenses?cab_id=1&date=2025-09-29&fuel_type=fuel
app.get("/trips", async (req, res) => {
  try {
    const { cab_id, date, fuel_type } = req.query;

    if (!cab_id || !date || !fuel_type) {
      return res.status(400).json({
        message: "cab_id, date, and fuel_type are required query params",
      });
    }

    const [rows] = await pool.query(
      `SELECT * 
       FROM expenses 
       WHERE cab_id = ? 
         AND expense_date = ? 
         AND expense_type = ?`,
      [cab_id, date, fuel_type]
    );

    if (rows.length === 0) {
      return res.json({}); // return empty JSON if nothing matches
    }

    res.json(rows[0]); // return first matching record
  } catch (error) {
    console.error("Error fetching expenses:", error.message);
    res.status(500).json({ message: error.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
