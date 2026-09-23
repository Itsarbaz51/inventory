import { WarehouseServices } from '../services/index.js';
import { ApiResponse } from '../utils/ApiResponse.js';

class WarehouseController {
  // =====================================================
  // CREATE
  // =====================================================

  static async create(req, res) {
    const result = await WarehouseServices.create(req.body, req);

    return res
      .status(201)
      .json(ApiResponse.success(result, 'Warehouse created successfully'));
  }

  // =====================================================
  // UPDATE
  // =====================================================

  static async update(req, res) {
    const result = await WarehouseServices.update(req.params.id, req.body, req);

    return res.json(
      ApiResponse.success(result, 'Warehouse updated successfully'),
    );
  }

  // =====================================================
  // GET BY ID
  // =====================================================

  static async getById(req, res) {
    const result = await WarehouseServices.getById(req.params.id, req);

    return res.json(
      ApiResponse.success(result, 'Warehouse fetched successfully'),
    );
  }

  // =====================================================
  // GET ALL
  // =====================================================

  static async getAll(req, res) {
    const result = await WarehouseServices.getAll(req);

    return res.json(
      ApiResponse.success(result, 'Warehouses fetched successfully'),
    );
  }

  // =====================================================
  // DELETE
  // =====================================================

  static async delete(req, res) {
    await WarehouseServices.delete(req.params.id, req);

    return res.json(
      ApiResponse.success(null, 'Warehouse deleted successfully'),
    );
  }
}

export default WarehouseController;
