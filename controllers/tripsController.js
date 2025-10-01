const TripsModel = require('../models/tripsModel');
const pool = require('../db');

class TripsController {
  // Get trip by cab number and date
  static async get(req, res) {
    try {
      const { date, cab_number } = req.query;

      if (!date || !cab_number) {
        return res.status(400).json({ 
          error: 'date and cab_number are required parameters' 
        });
      }

      // Get cab_id from service_number
      const [cabs] = await pool.query(
        'SELECT id FROM cabs WHERE service_number = ?',
        [cab_number]
      );

      if (cabs.length === 0) {
        return res.status(404).json({ error: 'Cab not found' });
      }

      const cabId = cabs[0].id;
      const trip = await TripsModel.getByCabAndDate(cabId, date);

      if (trip) {
        return res.json(trip);
      } else {
        // Return empty template with keys
        return res.json(TripsModel.getEmptyTemplate());
      }
    } catch (error) {
      console.error('Error in TripsController.get:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Create or update trip
  static async post(req, res) {
    try {
      const { id, cab_number, total_trips, distance_km, date, created_by, updated_by } = req.body;

      if (!cab_number || !date) {
        return res.status(400).json({ 
          error: 'cab_number and date are required' 
        });
      }

      // Get cab_id from service_number
      const [cabs] = await pool.query(
        'SELECT id FROM cabs WHERE service_number = ?',
        [cab_number]
      );

      if (cabs.length === 0) {
        return res.status(404).json({ error: 'Cab not found' });
      }

      const cabId = cabs[0].id;

      if (id) {
        // Update existing trip
        const tripData = {
          total_trips,
          distance_km,
          updated_by: updated_by || 'system'
        };
        const result = await TripsModel.update(id, tripData);
        return res.json({ message: 'Trip updated successfully', data: result });
      } else {
        // Create new trip
        const tripData = {
          cab_id: cabId,
          total_trips,
          distance_km,
          date,
          created_by: created_by || 'system'
        };
        const result = await TripsModel.create(tripData);
        return res.status(201).json({ message: 'Trip created successfully', data: result });
      }
    } catch (error) {
      console.error('Error in TripsController.post:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = TripsController;
