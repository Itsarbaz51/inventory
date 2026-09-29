import { PermissionServices } from '../services/index.js';

import { ApiResponse } from '../utils/ApiResponse.js';

class PermissionController {
  // ==========================================
  // GET ALL PERMISSIONS
  // ==========================================

  static async getAll(req, res) {
    const result = await PermissionServices.getAll({}, req);

    return res
      .status(200)
      .json(ApiResponse.success(result, 'Permissions fetched successfully'));
  }

  // ==========================================
  // GET MY PERMISSIONS
  // ==========================================

  static async getMyPermissions(req, res) {
    const result = await PermissionServices.getMyPermissions({}, req);

    return res
      .status(200)
      .json(
        ApiResponse.success(result, 'User permissions fetched successfully'),
      );
  }

  // ==========================================
  // GET ROLE PERMISSIONS
  // ==========================================

  static async getRolePermissions(req, res) {
    const result = await PermissionServices.getRolePermissions(req.params, req);

    return res
      .status(200)
      .json(
        ApiResponse.success(result, 'Role permissions fetched successfully'),
      );
  }

  // ==========================================
  // UPDATE ROLE PERMISSIONS
  // ==========================================

  static async updateRolePermissions(req, res) {
    const payload = {
      ...req.params,
      ...req.body,
    };

    console.log(payload);

    const result = await PermissionServices.updateRolePermissions(payload, req);

    return res
      .status(200)
      .json(
        ApiResponse.success(result, 'Role permissions updated successfully'),
      );
  }
}

export default PermissionController;
