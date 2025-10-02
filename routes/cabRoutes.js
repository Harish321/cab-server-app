const express = require('express');
const router = express.Router();

const TripsController = require('../controllers/tripsController');
const ExpensesController = require('../controllers/expensesController');
const PaymentsController = require('../controllers/paymentsController');
const SalariesController = require('../controllers/salariesController');
const CabsController = require('../controllers/cabsController');
const DashboardController = require('../controllers/dashboardController');

/**
 * Unified GET API
 * Query params: date, cab_number, category
 * Category can be: 'trips', 'expense', 'payments', 'salaries'
 * Returns existing record or empty template with all keys
 */
router.get('/cab-data', async (req, res) => {
  try {
    const { category } = req.query;

    if (!category) {
      return res.status(400).json({ 
        error: 'category parameter is required. Valid values: trips, expense, payments, salaries' 
      });
    }

    switch (category.toLowerCase()) {
      case 'trips':
        return await TripsController.get(req, res);
      
      case 'expense':
        return await ExpensesController.get(req, res);
      
      case 'payments':
        return await PaymentsController.get(req, res);
      
      case 'salaries':
        return await SalariesController.get(req, res);
      
      default:
        return res.status(400).json({ 
          error: 'Invalid category. Valid values: trips, expense, payments, salaries' 
        });
    }
  } catch (error) {
    console.error('Error in unified GET API:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Unified POST API
 * Body should contain: category, and other relevant fields
 * Category can be: 'trips', 'expense', 'payments', 'salaries'
 * If id is present, updates the record; otherwise creates new record
 */
router.post('/cab-data', async (req, res) => {
  try {
    const { category } = req.body;

    if (!category) {
      return res.status(400).json({ 
        error: 'category field is required in body. Valid values: trips, expense, payments, salaries' 
      });
    }

    switch (category.toLowerCase()) {
      case 'trips':
        return await TripsController.post(req, res);
      
      case 'expense':
        return await ExpensesController.post(req, res);
      
      case 'payments':
        return await PaymentsController.post(req, res);
      
      case 'salaries':
        return await SalariesController.post(req, res);
      
      default:
        return res.status(400).json({ 
          error: 'Invalid category. Valid values: trips, expense, payments, salaries' 
        });
    }
  } catch (error) {
    console.error('Error in unified POST API:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Get Cabs API
 * Get all cabs or specific cab by id or service_number
 * Query params: id (optional), service_number (optional)
 * If no params provided, returns all cabs
 */
router.get('/cabs', CabsController.get);

/**
 * Dashboard/Summary API
 * Get monthly aggregated summary for current year
 * Query params: cab_id (optional) - if provided, shows data for specific cab, otherwise all cabs
 * Returns monthly totals for trips, expenses, salaries, payments, and computed net income
 * Includes a totals row at the end
 */
router.get('/dashboard', DashboardController.getSummary);

/**
 * Daily Drill-Down API
 * Get date-wise breakdown for a specific month
 * Query params: 
 *   - year (required) - Year (e.g., 2025)
 *   - month (required) - Month number (1-12)
 *   - cab_id (optional) - if provided, shows data for specific cab, otherwise all cabs
 * Returns daily totals for trips and expenses only (salaries/payments excluded as they're not daily activities)
 * Includes a totals row for the month
 */
router.get('/dashboard/daily', DashboardController.getDailyDetails);

module.exports = router;
