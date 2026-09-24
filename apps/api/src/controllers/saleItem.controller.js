import { saleItemService } from '../services/index.js';

class SaleItemController {
  /**
   * CREATE
   */
  async create(req, res) {
    try {
      const tenantId = req.user.tenantId;

      const saleItem = await saleItemService.create(tenantId, req.body);

      return res.status(201).json({
        success: true,
        message: 'Sale item created successfully',
        data: saleItem,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * GET ALL
   */
  async getAll(req, res) {
    try {
      const tenantId = req.user.tenantId;

      const result = await saleItemService.getAll(tenantId, req.query);

      return res.status(200).json({
        success: true,
        message: 'Sale items fetched successfully',
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

  /**
   * GET BY ID
   */
  async getById(req, res) {
    try {
      const tenantId = req.user.tenantId;

      const saleItem = await saleItemService.getById(tenantId, req.params.id);

      return res.status(200).json({
        success: true,
        message: 'Sale item fetched successfully',
        data: saleItem,
      });
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * GET BY SALE
   */
  async getBySale(req, res) {
    try {
      const tenantId = req.user.tenantId;

      const items = await saleItemService.getBySale(
        tenantId,
        req.params.saleId,
      );

      return res.status(200).json({
        success: true,
        message: 'Sale items fetched successfully',
        data: items,
      });
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * UPDATE
   */
  async update(req, res) {
    try {
      const tenantId = req.user.tenantId;

      const saleItem = await saleItemService.update(
        tenantId,
        req.params.id,
        req.body,
      );

      return res.status(200).json({
        success: true,
        message: 'Sale item updated successfully',
        data: saleItem,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * DELETE
   */
  async delete(req, res) {
    try {
      const tenantId = req.user.tenantId;

      const result = await saleItemService.delete(tenantId, req.params.id);

      return res.status(200).json({
        success: true,
        message: result.message,
        data: {
          id: result.id,
        },
      });
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new SaleItemController();
