const CabsModel = require('../models/cabsModel');

class CabsController {
  // Get all cabs or specific cab by id/service_number
  static async get(req, res) {
    try {
      const { id, service_number } = req.query;

      // If id is provided, get cab by id
      if (id) {
        const cab = await CabsModel.getById(id);
        if (!cab) {
          return res.status(404).json({ error: 'Cab not found' });
        }
        return res.json(cab);
      }

      // If service_number is provided, get cab by service_number
      if (service_number) {
        const cab = await CabsModel.getByServiceNumber(service_number);
        if (!cab) {
          return res.status(404).json({ error: 'Cab not found' });
        }
        return res.json(cab);
      }

      // Otherwise, return all cabs
      const cabs = await CabsModel.getAll();
      return res.json(cabs);
    } catch (error) {
      console.error('Error in CabsController.get:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = CabsController;
