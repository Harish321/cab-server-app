const pool = require('../db');

class SalariesModel {
  // Get salary by cab_id and date
  static async getByCabAndDate(cabId, date) {
    const [rows] = await pool.query(
      'SELECT * FROM salaries WHERE cab_id = ? AND date = ?',
      [cabId, date]
    );
    return rows[0] || null;
  }

  // Create new salary
  static async create(salaryData) {
    const { cab_id, amount, paid_by, date, created_by } = salaryData;
    const [result] = await pool.query(
      'INSERT INTO salaries (cab_id, amount, paid_by, date, created_by) VALUES (?, ?, ?, ?, ?)',
      [cab_id, amount, paid_by, date, created_by]
    );
    return { id: result.insertId, ...salaryData };
  }

  // Update existing salary
  static async update(id, salaryData) {
    const { amount, paid_by, updated_by } = salaryData;
    await pool.query(
      'UPDATE salaries SET amount = ?, paid_by = ?, updated_by = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [amount, paid_by, updated_by, id]
    );
    return { id, ...salaryData };
  }

  // Get empty template
  static getEmptyTemplate() {
    return {
      id: null,
      cab_id: null,
      amount: 0.00,
      paid_by: null,
      date: null,
      created_at: null,
      created_by: null,
      updated_at: null,
      updated_by: null
    };
  }
}

module.exports = SalariesModel;
