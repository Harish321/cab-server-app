const ExpensesModel = require('../models/expensesModel');
const pool = require('../db');

class ExpensesController {
  // Get expense by cab number and date
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
      const expense = await ExpensesModel.getByCabAndDate(cabId, date);

      if (expense) {
        return res.json(expense);
      } else {
        // Return empty template with keys
        return res.json(ExpensesModel.getEmptyTemplate());
      }
    } catch (error) {
      console.error('Error in ExpensesController.get:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Create or update expense (fuel)
  static async post(req, res) {
    try {
      const { id, cab_number, amount, type, subtype, comments, paid_by, date, created_by, updated_by } = req.body;

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
        // Update existing expense
        const expenseData = {
          amount,
          type: type || 'fuel',
          subtype,
          comments,
          paid_by,
          updated_by: updated_by || 'system'
        };
        const result = await ExpensesModel.update(id, expenseData);
        return res.json({ message: 'Expense updated successfully', data: result });
      } else {
        // Create new expense
        const expenseData = {
          cab_id: cabId,
          amount,
          type: type || 'fuel',
          subtype,
          comments,
          paid_by,
          date,
          created_by: created_by || 'system'
        };
        const result = await ExpensesModel.create(expenseData);
        return res.status(201).json({ message: 'Expense created successfully', data: result });
      }
    } catch (error) {
      console.error('Error in ExpensesController.post:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = ExpensesController;
