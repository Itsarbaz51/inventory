import { UserServices } from '../services/index.js';

import { ApiResponse } from '../utils/ApiResponse.js';

class UserController {
  // =====================================================
  // CREATE
  // =====================================================
  static async create(req, res) {
    const result = await UserServices.create(req.body, req);

    return res
      .status(201)
      .json(ApiResponse.success(result, 'User created successfully'));
  }

  // =====================================================
  // UPDATE
  // =====================================================
  static async update(req, res) {
    const updated = await UserServices.update(req.params, req);

    return res
      .status(200)
      .json(ApiResponse.success(updated, 'User updated successfully'));
  }

  // =====================================================
  // GET BY ID
  // =====================================================
  static async getById(req, res) {
    const user = await UserServices.getById(req.params, req);

    return res
      .status(200)
      .json(ApiResponse.success(user, 'User fetched successfully'));
  }

  // =====================================================
  // GET ALL
  // =====================================================
  static async getAll(req, res) {
    const result = await UserServices.getAll(req.query, req);

    return res
      .status(200)
      .json(ApiResponse.success(result, 'Users fetched successfully'));
  }

  // =====================================================
  // DELETE
  // =====================================================
  static async delete(req, res) {
    await UserServices.delete(req.params, req);

    return res
      .status(200)
      .json(ApiResponse.success(null, 'User deleted successfully'));
  }
}

export default UserController;
