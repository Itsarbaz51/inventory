import { UnitServices } from '../services/index.js';
import { ApiResponse } from '../utils/ApiResponse.js';

class UnitController {
  // =====================================================
  // CREATE
  // =====================================================

  static async create(req, res) {
    const result = await UnitServices.create(req.body, req);

    return res
      .status(201)
      .json(ApiResponse.success(result, 'Unit created successfully'));
  }

  // =====================================================
  // UPDATE
  // =====================================================

  static async update(req, res) {
    const updated = await UnitServices.update(req.params, req);

    return res
      .status(200)
      .json(ApiResponse.success(updated, 'Unit updated successfully'));
  }

  // =====================================================
  // GET BY ID
  // =====================================================

  static async getById(req, res) {
    const unit = await UnitServices.getById(req.params, req);

    return res
      .status(200)
      .json(ApiResponse.success(unit, 'Unit fetched successfully'));
  }

  // =====================================================
  // GET ALL
  // =====================================================

  static async getAll(req, res) {
    const units = await UnitServices.getAll(req.query, req);

    return res
      .status(200)
      .json(ApiResponse.success(units, 'Units fetched successfully'));
  }

  // =====================================================
  // DELETE
  // =====================================================

  static async delete(req, res) {
    await UnitServices.delete(req.params, req);

    return res
      .status(200)
      .json(ApiResponse.success(null, 'Unit deleted successfully'));
  }
}

export default UnitController;
