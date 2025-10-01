const pool = require('../db');

class CabsModel {
  // Get all cabs
  static async getAll() {
    const [rows] = await pool.query(
      'SELECT id, service_number, driver_name, created_at, created_by, updated_at, updated_by FROM cabs ORDER BY service_number'
    );
    return rows;
  }

  // Get cab by id
  static async getById(id) {
    const [rows] = await pool.query(
      'SELECT id, service_number, driver_name, created_at, created_by, updated_at, updated_by FROM cabs WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  }

  // Get cab by service number
  static async getByServiceNumber(serviceNumber) {
    const [rows] = await pool.query(
      'SELECT id, service_number, driver_name, created_at, created_by, updated_at, updated_by FROM cabs WHERE service_number = ?',
      [serviceNumber]
    );
    return rows[0] || null;
  }
}

module.exports = CabsModel;
