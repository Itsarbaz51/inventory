import { RoleServices } from '../services/index.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

class RoleController {
  // CREATE
  static async create(req, res) {
    const result = await RoleServices.create(req.body, req);

    return res
      .status(201)
      .json(ApiResponse.success(result, 'Role added successfully'));
  }

  // UPDATE
  static async update(req, res) {
    const payload = { ...req.body, ...req.params }
    const result = await RoleServices.update(payload, req);

    return res
      .status(201)
      .json(ApiResponse.success(result, 'Role updated successfully'));
  }

  // GET ALL
  static async getAll(req, res) {
    const result = await RoleServices.getAll({}, req);

    return res
      .status(200)
      .json(ApiResponse.success(result, 'Roles fetched successfully'));
  }

  // DELETE
  static async delete(req, res) {
    await RoleServices.delete(req.params, req);

    return res
      .status(200)
      .json(ApiResponse.success(null, 'Role deleted successfully'));
  }
}

export default RoleController;
