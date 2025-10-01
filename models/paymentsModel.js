const pool = require('../db');

class PaymentsModel {
  // Get payment by cab_id and date
  static async getByCabAndDate(cabId, date) {
    const [rows] = await pool.query(
      'SELECT * FROM payments WHERE cab_id = ? AND date = ?',
      [cabId, date]
    );
    return rows[0] || null;
  }

  // Create new payment
  static async create(paymentData) {
    const { cab_id, amount, date, created_by } = paymentData;
    const [result] = await pool.query(
      'INSERT INTO payments (cab_id, amount, date, created_by) VALUES (?, ?, ?, ?)',
      [cab_id, amount, date, created_by]
    );
    return { id: result.insertId, ...paymentData };
  }

  // Update existing payment
  static async update(id, paymentData) {
    const { amount, updated_by } = paymentData;
    await pool.query(
      'UPDATE payments SET amount = ?, updated_by = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [amount, updated_by, id]
    );
    return { id, ...paymentData };
  }

  // Get empty template
  static getEmptyTemplate() {
    return {
      id: null,
      cab_id: null,
      amount: 0.00,
      date: null,
      created_at: null,
      created_by: null,
      updated_at: null,
      updated_by: null
    };
  }
}

module.exports = PaymentsModel;
