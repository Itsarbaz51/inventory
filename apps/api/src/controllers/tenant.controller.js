import { TenantServices } from '../services/index.js';

import { ApiResponse } from '../utils/ApiResponse.js';

class TenantController {
  // =====================================================
  // CREATE
  // =====================================================
  static async create(req, res) {
    const result = await TenantServices.create(req.body);

    return res
      .status(201)
      .json(ApiResponse.success(result, 'Tenant created successfully'));
  }

  // =====================================================
  // UPDATE
  // =====================================================
  static async update(req, res) {
    const result = await TenantServices.update(req.params, req);

    return res
      .status(200)
      .json(ApiResponse.success(result, 'Tenant updated successfully'));
  }

  // =====================================================
  // GET BY ID
  // =====================================================
  static async getById(req, res) {
    const result = await TenantServices.getById(req.params, req);

    return res
      .status(200)
      .json(ApiResponse.success(result, 'Tenant fetched successfully'));
  }

  // =====================================================
  // GET ALL
  // =====================================================
  static async getAll(req, res) {
    const result = await TenantServices.getAll(req.query);

    return res
      .status(200)
      .json(ApiResponse.success(result, 'Tenants fetched successfully'));
  }

  // =====================================================
  // DELETE
  // =====================================================
  static async delete(req, res) {
    await TenantServices.delete(req.params, req);

    return res
      .status(200)
      .json(ApiResponse.success(null, 'Tenant deleted successfully'));
  }
}

export default TenantController;
