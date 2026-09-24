import StockMovementService from '../services/stock-movement.service.js';

class StockMovementController {
  // =====================================================
  // CREATE
  // =====================================================

  async create(req, res) {
    try {
      const tenantId = req.user.tenantId;
      const userId = req.user.id;

      const movement = await StockMovementService.create(
        req.body,
        tenantId,
        userId,
      );

      return res.status(201).json({
        success: true,
        message: 'Stock movement created successfully',
        data: movement,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // =====================================================
  // GET BY ID
  // =====================================================

  async getById(req, res) {
    try {
      const tenantId = req.user.tenantId;

      const movement = await StockMovementService.getById(
        req.params.id,
        tenantId,
      );

      return res.status(200).json({
        success: true,
        message: 'Stock movement fetched successfully',
        data: movement,
      });
    } catch (error) {
      const status = error.message === 'Stock movement not found' ? 404 : 400;

      return res.status(status).json({
        success: false,
        message: error.message,
      });
    }
  }

  // =====================================================
  // GET ALL
  // =====================================================

  async getAll(req, res) {
    try {
      const tenantId = req.user.tenantId;

      const result = await StockMovementService.getAll(req.query, tenantId);

      return res.status(200).json({
        success: true,
        message: 'Stock movements fetched successfully',
        data: result.movements,
        pagination: result.pagination,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // =====================================================
  // DELETE
  // =====================================================

  async delete(req, res) {
    try {
      const tenantId = req.user.tenantId;

      const result = await StockMovementService.delete(req.params.id, tenantId);

      return res.status(200).json({
        success: true,
        message: result.message,
        data: {
          id: result.id,
        },
      });
    } catch (error) {
      const status = error.message === 'Stock movement not found' ? 404 : 400;

      return res.status(status).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new StockMovementController();
