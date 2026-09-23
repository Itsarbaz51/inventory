import { RoleServices } from '../services/index.js';
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
  static async update(payload, req) {
    const tenantId = req.user?.tenantId;

    if (!tenantId) {
      throw new ApiError(401, 'Tenant not found');
    }

    const { id } = payload;
    const { name, description } = req.body;

    if (!id) {
      throw new ApiError(400, 'Role id is required');
    }

    const role = await Prisma.role.findFirst({
      where: {
        id,
        tenantId,
      },
    });

    if (!role) {
      throw new ApiError(404, 'Role not found');
    }

    if (role.isSystem) {
      throw new ApiError(403, 'System role cannot be modified');
    }

    if (name !== undefined) {
      if (!name?.trim()) {
        throw new ApiError(400, 'Role name cannot be empty');
      }

      const duplicateRole = await Prisma.role.findFirst({
        where: {
          tenantId,
          name: name.trim(),
          NOT: {
            id,
          },
        },
      });

      if (duplicateRole) {
        throw new ApiError(409, `Role "${name}" already exists`);
      }
    }

    const updatedRole = await Prisma.role.update({
      where: {
        id,
      },

      data: {
        ...(name !== undefined && {
          name: name.trim(),
        }),

        ...(description !== undefined && {
          description: description?.trim() || null,
        }),
      },
    });

    return updatedRole;
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
