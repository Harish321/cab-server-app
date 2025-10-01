const pool = require('../db');

class TripsModel {
  // Get trip by cab_id and date
  static async getByCabAndDate(cabId, date) {
    const [rows] = await pool.query(
      'SELECT * FROM trips WHERE cab_id = ? AND date = ?',
      [cabId, date]
    );
    return rows[0] || null;
  }

  // Create new trip
  static async create(tripData) {
    const { cab_id, total_trips, distance_km, date, created_by } = tripData;
    const [result] = await pool.query(
      'INSERT INTO trips (cab_id, total_trips, distance_km, date, created_by) VALUES (?, ?, ?, ?, ?)',
      [cab_id, total_trips || 0, distance_km || 0.00, date, created_by]
    );
    return { id: result.insertId, ...tripData };
  }

  // Update existing trip
  static async update(id, tripData) {
    const { total_trips, distance_km, updated_by } = tripData;
    await pool.query(
      'UPDATE trips SET total_trips = ?, distance_km = ?, updated_by = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [total_trips, distance_km, updated_by, id]
    );
    return { id, ...tripData };
  }

  // Get empty template
  static getEmptyTemplate() {
    return {
      id: null,
      cab_id: null,
      total_trips: 0,
      distance_km: 0.00,
      date: null,
      created_at: null,
      created_by: null,
      updated_at: null,
      updated_by: null
    };
  }
}

module.exports = TripsModel;
