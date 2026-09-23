import RoleServices from '../services/index.js';
import { ApiResponse } from '../utils/ApiResponse.js';

class RoleController {
  static async create(req, res) {
    const result = await RoleServices.create(req.body, req);

    return res
      .status(200)
      .json(ApiResponse.success(result, 'Role Add successful'));
  }

  static async update(req, res) {
    const updated = await RoleServices.update(req.params, req.body);

    return res.json(ApiResponse.success(updated, 'updated successful'));
  }

  static async getAll(req, res) {
    const getAll = await RoleServices.getAll(req.body);

    return res.json(ApiResponse.success(getAll, 'get all successful'));
  }

  static async delete(req, res) {
    await RoleServices.delete(req.user.id, req.body);

    return res.json(ApiResponse.success(null, 'deleted successful'));
  }
}

export default RoleController;
