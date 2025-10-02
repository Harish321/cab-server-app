const pool = require('../db');

class ExpensesModel {
  // Get expense by cab_id and date
  static async getByCabAndDate(cabId, date) {
    const [rows] = await pool.query(
      'SELECT * FROM expenses WHERE cab_id = ? AND date = ?',
      [cabId, date]
    );
    return rows[0] || null;
  }

  // Create new expense
  static async create(expenseData) {
    const { cab_id, amount, category, subtype, comments, paid_by, date, created_by } = expenseData;
    const [result] = await pool.query(
      'INSERT INTO expenses (cab_id, amount, category, subtype, comments, paid_by, date, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [cab_id, amount, category, subtype, comments, paid_by, date, created_by]
    );
    return { id: result.insertId, ...expenseData };
  }

  // Update existing expense
  static async update(id, expenseData) {
    const { amount, category, subtype, comments, paid_by, updated_by } = expenseData;
    await pool.query(
      'UPDATE expenses SET amount = ?, category = ?, subtype = ?, comments = ?, paid_by = ?, updated_by = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [amount, category, subtype, comments, paid_by, updated_by, id]
    );
    return { id, ...expenseData };
  }

  // Get empty template
  static getEmptyTemplate() {
    return {
      id: null,
      cab_id: null,
      amount: 0.00,
      category: null,
      subtype: null,
      comments: null,
      paid_by: null,
      date: null,
      created_at: null,
      created_by: null,
      updated_at: null,
      updated_by: null
    };
  }
}

module.exports = ExpensesModel;
