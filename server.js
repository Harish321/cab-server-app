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

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
