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

// POST /api/entries
app.post("/api/entries", async (req, res) => {
  try {
    const {
      cab_id,
      amount,
      type,
      subtype,
      comments,
      paid_by,
      date,
      trips,
      distance_km,
      created_by
    } = req.body;

    if (!cab_id || !date || !type) {
      return res
        .status(400)
        .json({ message: "cab_id, date, and type are required" });
    }

    switch (type.toLowerCase()) {
      case "fuel":
        await pool.query(
          `INSERT INTO expenses 
             (cab_id, amount, type, subtype, comments, paid_by, date, created_by)
           VALUES (?, ?, 'fuel', ?, ?, ?, ?, ?)`,
          [
            cab_id,
            amount,
            subtype || null,
            comments || null,
            paid_by || null,
            date,
            created_by || "system"
          ]
        );

        if (trips || distance_km) {
          await pool.query(
            `INSERT INTO trips 
               (cab_id, total_trips, distance_km, date, created_by)
             VALUES (?, ?, ?, ?, ?)`,
            [
              cab_id,
              trips || 0,
              distance_km || 0,
              date,
              created_by || "system"
            ]
          );
        }

        await pool.query(
          `INSERT INTO payments 
             (cab_id, amount, date, created_by)
           VALUES (?, ?, ?, ?)`,
          [cab_id, amount, date, created_by || "system"]
        );
        break;

      case "service":
        await pool.query(
          `INSERT INTO expenses 
             (cab_id, amount, type, subtype, comments, paid_by, date, created_by)
           VALUES (?, ?, 'service', ?, ?, ?, ?, ?)`,
          [
            cab_id,
            amount,
            subtype || null,
            comments || null,
            paid_by || null,
            date,
            created_by || "system"
          ]
        );

        await pool.query(
          `INSERT INTO payments 
             (cab_id, amount, date, created_by)
           VALUES (?, ?, ?, ?)`,
          [cab_id, amount, date, created_by || "system"]
        );
        break;

      case "others":
        await pool.query(
          `INSERT INTO expenses 
             (cab_id, amount, type, subtype, comments, paid_by, date, created_by)
           VALUES (?, ?, 'others', 'maintenance', ?, ?, ?, ?)`,
          [
            cab_id,
            amount,
            comments || null,
            paid_by || null,
            date,
            created_by || "system"
          ]
        );

        await pool.query(
          `INSERT INTO payments 
             (cab_id, amount, date, created_by)
           VALUES (?, ?, ?, ?)`,
          [cab_id, amount, date, created_by || "system"]
        );
        break;

      default:
        return res.status(400).json({ message: "Invalid type" });
    }

    //  Respond once everything is inserted
    res.json({ status: "success", message: "Entry inserted successfully" });

  } catch (error) {
    console.error("Error inserting entry:", error.message);
    res.status(500).json({ message: error.message });
  }
});


app.post("/api/salaries", async (req, res) => {
  try {
    const { cab_id, amount, paid_by, date, created_by } = req.body;

    if (!cab_id || !amount || !date) {
      return res.status(400).json({ message: "cab_id, amount, and salary_date are required" });
    }

    const [result] = await pool.query(
      `INSERT INTO salaries 
       (cab_id, amount, paid_by, date, created_by)
       VALUES (?, ?, ?, ?, ?)`,
      [cab_id, amount, paid_by, date, created_by || "system"]
    );

    res.json({ status: "success", id: result.insertId });
  } catch (error) {
    console.error("Error inserting salary:", error.message);
    res.status(500).json({ message: error.message });
  }
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
