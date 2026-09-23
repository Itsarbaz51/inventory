import { PurchaseServices } from '../services/index.js';
import { ApiResponse } from '../utils/ApiResponse.js';

class PurchaseController {
  // =====================================================
  // CREATE
  // =====================================================

  static async create(req, res) {
    const result = await PurchaseServices.create(req.body, req);

    return res
      .status(201)
      .json(ApiResponse.success(result, 'Purchase created successfully'));
  }

  // =====================================================
  // UPDATE
  // =====================================================

  static async update(req, res) {
    const updated = await PurchaseServices.update(req.params, req);

    return res.json(
      ApiResponse.success(updated, 'Purchase updated successfully'),
    );
  }

  // =====================================================
  // GET BY ID
  // =====================================================

  static async getById(req, res) {
    const result = await PurchaseServices.getById(req.params, req);

    return res.json(
      ApiResponse.success(result, 'Purchase fetched successfully'),
    );
  }

  // =====================================================
  // GET ALL
  // =====================================================

  static async getAll(req, res) {
    const result = await PurchaseServices.getAll(req.query, req);

    return res.json(
      ApiResponse.success(result, 'Purchases fetched successfully'),
    );
  }

  // =====================================================
  // DELETE
  // =====================================================

  static async delete(req, res) {
    await PurchaseServices.delete(req.params, req);

    return res.json(ApiResponse.success(null, 'Purchase deleted successfully'));
  }
}

export default PurchaseController;
