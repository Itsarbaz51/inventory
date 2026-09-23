import { WarehouseStockServices } from '../services/index.js';
import { ApiResponse } from '../utils/ApiResponse.js';

class WarehouseStockController {
  // =====================================================
  // CREATE
  // =====================================================
  static async create(req, res) {
    const result = await WarehouseStockServices.create(req.body, req);

    return res
      .status(201)
      .json(
        ApiResponse.success(result, 'Warehouse stock created successfully'),
      );
  }

  // =====================================================
  // GET ALL
  // =====================================================
  static async getAll(req, res) {
    const result = await WarehouseStockServices.getAll(req);

    return res.json(
      ApiResponse.success(result, 'Warehouse stocks fetched successfully'),
    );
  }

  // =====================================================
  // GET BY ID
  // =====================================================
  static async getById(req, res) {
    const result = await WarehouseStockServices.getById(req.params, req);

    return res.json(
      ApiResponse.success(result, 'Warehouse stock fetched successfully'),
    );
  }

  // =====================================================
  // UPDATE
  // =====================================================
  static async update(req, res) {
    const result = await WarehouseStockServices.update(req.params, req);

    return res.json(
      ApiResponse.success(result, 'Warehouse stock updated successfully'),
    );
  }

  // =====================================================
  // DELETE
  // =====================================================
  static async delete(req, res) {
    await WarehouseStockServices.delete(req.params, req);

    return res.json(
      ApiResponse.success(null, 'Warehouse stock deleted successfully'),
    );
  }
}

export default WarehouseStockController;
