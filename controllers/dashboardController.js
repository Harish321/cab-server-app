const DashboardModel = require('../models/dashboardModel');

class DashboardController {
  static async getSummary(req, res) {
    try {
      const { cab_id } = req.query;
      
      // Get raw monthly data
      const data = await DashboardModel.getMonthlySummary(cab_id || null);
      
      // Month names for display
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      
      // Create a map for easy lookup
      const tripsMap = new Map(data.trips.map(t => [t.month, t]));
      const expensesMap = new Map(data.expenses.map(e => [e.month, e]));
      const paymentsMap = new Map(data.payments.map(p => [p.month, p]));
      const salariesMap = new Map(data.salaries.map(s => [s.month, s]));
      
      // Build monthly summary array
      const monthlySummary = [];
      let totals = {
        month: 'Total',
        total_trips: 0,
        total_distance: 0,
        total_expenses: 0,
        total_salaries: 0,
        total_payments: 0,
        net_income: 0
      };
      
      // Process each month (12-1) in descending order
      for (let month = 12; month >= 1; month--) {
        const trips = tripsMap.get(month);
        const expenses = expensesMap.get(month);
        const payments = paymentsMap.get(month);
        const salaries = salariesMap.get(month);
        
        const totalTrips = trips ? parseFloat(trips.total_trips) || 0 : 0;
        const totalDistance = trips ? parseFloat(trips.total_distance) || 0 : 0;
        const totalExpenses = expenses ? parseFloat(expenses.total_expenses) || 0 : 0;
        const totalPayments = payments ? parseFloat(payments.total_payments) || 0 : 0;
        const totalSalaries = salaries ? parseFloat(salaries.total_salaries) || 0 : 0;
        
        // Calculate net income: payments - (expenses + salaries)
        const netIncome = totalPayments - (totalExpenses + totalSalaries);
        
        monthlySummary.push({
          month: monthNames[month - 1],
          month_number: month,
          total_trips: totalTrips,
          total_distance: parseFloat(totalDistance.toFixed(2)),
          total_expenses: parseFloat(totalExpenses.toFixed(2)),
          total_salaries: parseFloat(totalSalaries.toFixed(2)),
          total_payments: parseFloat(totalPayments.toFixed(2)),
          net_income: parseFloat(netIncome.toFixed(2))
        });
        
        // Accumulate totals
        totals.total_trips += totalTrips;
        totals.total_distance += totalDistance;
        totals.total_expenses += totalExpenses;
        totals.total_salaries += totalSalaries;
        totals.total_payments += totalPayments;
        totals.net_income += netIncome;
      }
      
      // Round totals to 2 decimal places
      totals.total_distance = parseFloat(totals.total_distance.toFixed(2));
      totals.total_expenses = parseFloat(totals.total_expenses.toFixed(2));
      totals.total_salaries = parseFloat(totals.total_salaries.toFixed(2));
      totals.total_payments = parseFloat(totals.total_payments.toFixed(2));
      totals.net_income = parseFloat(totals.net_income.toFixed(2));
      
      // Return response with monthly data and totals
      res.json({
        year: new Date().getFullYear(),
        cab_id: cab_id || 'all',
        monthly_summary: monthlySummary,
        totals: totals
      });
      
    } catch (error) {
      console.error('Error in DashboardController.getSummary:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getDailyDetails(req, res) {
    try {
      const { year, month, cab_id } = req.query;
      
      // Validate required parameters
      if (!year || !month) {
        return res.status(400).json({ 
          error: 'year and month are required parameters' 
        });
      }

      const yearNum = parseInt(year);
      const monthNum = parseInt(month);

      // Validate month range
      if (monthNum < 1 || monthNum > 12) {
        return res.status(400).json({ 
          error: 'month must be between 1 and 12' 
        });
      }
      
      // Get raw daily data
      const data = await DashboardModel.getDailySummary(yearNum, monthNum, cab_id || null);
      
      // Month names for display
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      
      // Helper function to get date string from date (handles both string and Date object)
      const getDateString = (date) => {
        if (typeof date === 'string') {
          return date.split('T')[0]; // If already a string, extract date part
        }
        return date.toISOString().split('T')[0]; // If Date object, convert to string
      };
      
      // Create a map for easy lookup by date string
      const tripsMap = new Map(data.trips.map(t => [getDateString(t.date), t]));
      const expensesMap = new Map(data.expenses.map(e => [getDateString(e.date), e]));
      
      // Get all unique dates (only from trips and expenses)
      const allDates = new Set([
        ...data.trips.map(t => getDateString(t.date)),
        ...data.expenses.map(e => getDateString(e.date))
      ]);
      
      // Convert to array and sort in descending order
      const sortedDates = Array.from(allDates).sort((a, b) => b.localeCompare(a));
      
      // Build daily summary array (only trips and expenses)
      const dailySummary = [];
      let totals = {
        date: 'Total',
        total_trips: 0,
        total_distance: 0,
        total_expenses: 0
      };
      
      // Process each date
      for (const dateStr of sortedDates) {
        const trips = tripsMap.get(dateStr);
        const expenses = expensesMap.get(dateStr);
        
        const totalTrips = trips ? parseFloat(trips.total_trips) || 0 : 0;
        const totalDistance = trips ? parseFloat(trips.total_distance) || 0 : 0;
        const totalExpenses = expenses ? parseFloat(expenses.total_expenses) || 0 : 0;
        
        dailySummary.push({
          date: dateStr,
          day: parseInt(dateStr.split('-')[2]),
          total_trips: totalTrips,
          total_distance: parseFloat(totalDistance.toFixed(2)),
          total_expenses: parseFloat(totalExpenses.toFixed(2))
        });
        
        // Accumulate totals
        totals.total_trips += totalTrips;
        totals.total_distance += totalDistance;
        totals.total_expenses += totalExpenses;
      }
      
      // Round totals to 2 decimal places
      totals.total_distance = parseFloat(totals.total_distance.toFixed(2));
      totals.total_expenses = parseFloat(totals.total_expenses.toFixed(2));
      
      // Return response with daily data and totals
      res.json({
        year: yearNum,
        month: monthNum,
        month_name: monthNames[monthNum - 1],
        cab_id: cab_id || 'all',
        daily_summary: dailySummary,
        totals: totals
      });
      
    } catch (error) {
      console.error('Error in DashboardController.getDailyDetails:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = DashboardController;
