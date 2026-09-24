import { PaymentService } from '../services/index.js';

class PaymentController {
  // =====================================================
  // CREATE
  // =====================================================

  async create(req, res) {
    try {
      const tenantId = req.user.tenantId;
      const userId = req.user.id;

      const payment = await PaymentService.create(req.body, tenantId, userId);

      return res.status(201).json({
        success: true,
        message: 'Payment created successfully',
        data: payment,
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

      const payment = await PaymentService.getById(req.params.id, tenantId);

      return res.status(200).json({
        success: true,
        message: 'Payment fetched successfully',
        data: payment,
      });
    } catch (error) {
      const status = error.message === 'Payment not found' ? 404 : 400;

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

      const result = await PaymentService.getAll(req.query, tenantId);

      return res.status(200).json({
        success: true,
        message: 'Payments fetched successfully',

        data: result.payments,

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

      const result = await PaymentService.delete(req.params.id, tenantId);

      return res.status(200).json({
        success: true,
        message: result.message,

        data: {
          id: result.id,
        },
      });
    } catch (error) {
      const status = error.message === 'Payment not found' ? 404 : 400;

      return res.status(status).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new PaymentController();
