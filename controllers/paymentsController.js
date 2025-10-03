const PaymentsModel = require('../models/paymentsModel');
const pool = require('../db');

class PaymentsController {
  // Get payment by service number and date
  static async get(req, res) {
    try {
      const { date, service_number, cab_number } = req.query;
      // Accept both cab_number and service_number for backward compatibility
      const cabServiceNumber = service_number || cab_number;

      if (!date || !cabServiceNumber) {
        return res.status(400).json({ 
          error: 'date and cab_number are required parameters' 
        });
      }

      // Get cab_id from service_number
      const [cabs] = await pool.query(
        'SELECT id FROM cabs WHERE service_number = ?',
        [cabServiceNumber]
      );

      if (cabs.length === 0) {
        return res.status(404).json({ error: 'Cab not found' });
      }

      const cabId = cabs[0].id;
      const payment = await PaymentsModel.getByCabAndDate(cabId, date);

      if (payment) {
        return res.json(payment);
      } else {
        // Return empty template with keys
        return res.json(PaymentsModel.getEmptyTemplate());
      }
    } catch (error) {
      console.error('Error in PaymentsController.get:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Create or update payment
  static async post(req, res) {
    try {
      const { id, service_number, cab_number, amount, date, created_by, updated_by } = req.body;
      // Accept both cab_number and service_number for backward compatibility
      const cabServiceNumber = service_number || cab_number;

      if (!cabServiceNumber || !date || (amount === undefined || amount === null)) {
        return res.status(400).json({ 
          error: 'cab_number, date, and amount are required' 
        });
      }

      // Get cab_id from service_number
      const [cabs] = await pool.query(
        'SELECT id FROM cabs WHERE service_number = ?',
        [cabServiceNumber]
      );

      if (cabs.length === 0) {
        return res.status(404).json({ error: 'Cab not found' });
      }

      const cabId = cabs[0].id;

      if (id) {
        // Update existing payment
        const paymentData = {
          amount,
          updated_by: updated_by || 'system'
        };
        const result = await PaymentsModel.update(id, paymentData);
        return res.json({ message: 'Payment updated successfully', data: result });
      } else {
        // Create new payment
        const paymentData = {
          cab_id: cabId,
          amount,
          date,
          created_by: created_by || 'system'
        };
        const result = await PaymentsModel.create(paymentData);
        return res.status(201).json({ message: 'Payment created successfully', data: result });
      }
    } catch (error) {
      console.error('Error in PaymentsController.post:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = PaymentsController;
