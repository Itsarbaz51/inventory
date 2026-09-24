import { SalesReturnItemService } from '../services/index.js';

class SalesReturnItemController {
  // =====================================================
  // CREATE
  // =====================================================

  async create(req, res) {
    try {
      const tenantId = req.user.tenantId;

      const item = await SalesReturnItemService.create(req.body, tenantId);

      return res.status(201).json({
        success: true,
        message: 'Sales return item created successfully',
        data: item,
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

      const item = await SalesReturnItemService.getById(
        req.params.id,
        tenantId,
      );

      return res.status(200).json({
        success: true,
        message: 'Sales return item fetched successfully',
        data: item,
      });
    } catch (error) {
      const status =
        error.message === 'Sales return item not found' ? 404 : 400;

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

      const result = await SalesReturnItemService.getAll(req.query, tenantId);

      return res.status(200).json({
        success: true,
        message: 'Sales return items fetched successfully',
        data: result.items,
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
  // UPDATE
  // =====================================================

  async update(req, res) {
    try {
      const tenantId = req.user.tenantId;

      const item = await SalesReturnItemService.update(
        req.params.id,
        req.body,
        tenantId,
      );

      return res.status(200).json({
        success: true,
        message: 'Sales return item updated successfully',
        data: item,
      });
    } catch (error) {
      const status =
        error.message === 'Sales return item not found' ? 404 : 400;

      return res.status(status).json({
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

      const result = await SalesReturnItemService.delete(
        req.params.id,
        tenantId,
      );

      return res.status(200).json({
        success: true,
        message: result.message,
        data: {
          id: result.id,
        },
      });
    } catch (error) {
      const status =
        error.message === 'Sales return item not found' ? 404 : 400;

      return res.status(status).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new SalesReturnItemController();
