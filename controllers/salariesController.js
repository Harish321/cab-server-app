const SalariesModel = require('../models/salariesModel');
const pool = require('../db');

class SalariesController {
  // Get salary by cab number and date
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
      const salary = await SalariesModel.getByCabAndDate(cabId, date);

      if (salary) {
        return res.json(salary);
      } else {
        // Return empty template with keys
        return res.json(SalariesModel.getEmptyTemplate());
      }
    } catch (error) {
      console.error('Error in SalariesController.get:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Create or update salary
  static async post(req, res) {
    try {
      const { id, cab_number, amount, paid_by, date, created_by, updated_by } = req.body;

      if (!cab_number || !date || !amount) {
        return res.status(400).json({ 
          error: 'cab_number, date, and amount are required' 
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
        // Update existing salary
        const salaryData = {
          amount,
          paid_by,
          updated_by: updated_by || 'system'
        };
        const result = await SalariesModel.update(id, salaryData);
        return res.json({ message: 'Salary updated successfully', data: result });
      } else {
        // Create new salary
        const salaryData = {
          cab_id: cabId,
          amount,
          paid_by,
          date,
          created_by: created_by || 'system'
        };
        const result = await SalariesModel.create(salaryData);
        return res.status(201).json({ message: 'Salary created successfully', data: result });
      }
    } catch (error) {
      console.error('Error in SalariesController.post:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = SalariesController;
