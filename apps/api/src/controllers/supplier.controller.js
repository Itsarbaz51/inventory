import { SupplierServices } from '../services/index.js';
import { ApiResponse } from '../utils/ApiResponse.js';

class SupplierController {
  // =====================================================
  // CREATE
  // =====================================================

  static async create(req, res) {
    const result = await SupplierServices.create(req.body, req);

    return res
      .status(201)
      .json(ApiResponse.success(result, 'Supplier created successfully'));
  }

  // =====================================================
  // GET ALL
  // =====================================================

  static async getAll(req, res) {
    const result = await SupplierServices.getAll(req);

    return res.json(
      ApiResponse.success(result, 'Suppliers fetched successfully'),
    );
  }

  // =====================================================
  // GET BY ID
  // =====================================================

  static async getById(req, res) {
    const result = await SupplierServices.getById(req.params, req);

    return res.json(
      ApiResponse.success(result, 'Supplier fetched successfully'),
    );
  }

  // =====================================================
  // UPDATE
  // =====================================================

  static async update(req, res) {
    const result = await SupplierServices.update(req.params, req);

    return res.json(
      ApiResponse.success(result, 'Supplier updated successfully'),
    );
  }

  // =====================================================
  // DELETE
  // =====================================================

  static async delete(req, res) {
    await SupplierServices.delete(req.params, req);

    return res.json(ApiResponse.success(null, 'Supplier deleted successfully'));
  }
}

export default SupplierController;
