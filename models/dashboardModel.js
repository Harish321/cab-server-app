const pool = require('../db');

class DashboardModel {
  // Get monthly summary for current year
  static async getMonthlySummary(cabId = null) {
    const currentYear = new Date().getFullYear();
    
    // Build the WHERE clause based on cabId
    const whereClause = cabId ? 'WHERE YEAR(date) = ? AND cab_id = ?' : 'WHERE YEAR(date) = ?';
    const params = cabId ? [currentYear, cabId] : [currentYear];

    // Get monthly trips data
    const [tripsData] = await pool.query(
      `SELECT 
        MONTH(date) as month,
        SUM(total_trips) as total_trips,
        SUM(distance_km) as total_distance
      FROM trips
      ${whereClause}
      GROUP BY MONTH(date)
      ORDER BY MONTH(date)`,
      params
    );

    // Get monthly expenses data
    const [expensesData] = await pool.query(
      `SELECT 
        MONTH(date) as month,
        SUM(amount) as total_expenses
      FROM expenses
      ${whereClause}
      GROUP BY MONTH(date)
      ORDER BY MONTH(date)`,
      params
    );

    // Get monthly payments data
    const [paymentsData] = await pool.query(
      `SELECT 
        MONTH(date) as month,
        SUM(amount) as total_payments
      FROM payments
      ${whereClause}
      GROUP BY MONTH(date)
      ORDER BY MONTH(date)`,
      params
    );

    // Get monthly salaries data
    const [salariesData] = await pool.query(
      `SELECT 
        MONTH(date) as month,
        SUM(amount) as total_salaries
      FROM salaries
      ${whereClause}
      GROUP BY MONTH(date)
      ORDER BY MONTH(date)`,
      params
    );

    return {
      trips: tripsData,
      expenses: expensesData,
      payments: paymentsData,
      salaries: salariesData
    };
  }

  // Get daily summary for a specific month and year
  // Only trips and expenses are included as salaries/payments are not daily activities
  static async getDailySummary(year, month, cabId = null) {
    // Build the WHERE clause based on cabId
    const whereClause = cabId 
      ? 'WHERE YEAR(date) = ? AND MONTH(date) = ? AND cab_id = ?' 
      : 'WHERE YEAR(date) = ? AND MONTH(date) = ?';
    const params = cabId ? [year, month, cabId] : [year, month];

    // Get daily trips data
    const [tripsData] = await pool.query(
      `SELECT 
        DAY(date) as day,
        date,
        SUM(total_trips) as total_trips,
        SUM(distance_km) as total_distance
      FROM trips
      ${whereClause}
      GROUP BY DAY(date), date
      ORDER BY date DESC`,
      params
    );

    // Get daily expenses data
    const [expensesData] = await pool.query(
      `SELECT 
        DAY(date) as day,
        date,
        SUM(amount) as total_expenses
      FROM expenses
      ${whereClause}
      GROUP BY DAY(date), date
      ORDER BY date DESC`,
      params
    );

    return {
      trips: tripsData,
      expenses: expensesData
    };
  }
}

module.exports = DashboardModel;
