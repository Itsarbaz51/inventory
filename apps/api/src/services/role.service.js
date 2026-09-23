import { ApiError } from '../utils/ApiError.js';
import Prisma from '../database/db.js';

class RoleServices {
  static async create(payload, req) {
    const tenantId = req.user?.tenantId;

    if (!tenantId) {
      throw new ApiError(401, 'Tenant not found');
    }

    const { name, description, isSystem = false } = payload;

    if (!name?.trim()) {
      throw new ApiError(400, 'Role name is required');
    }

    // Check duplicate role inside same tenant
    const existingRole = await Prisma.role.findFirst({
      where: {
        tenantId,
        name: name.trim(),
      },
    });

    if (existingRole) {
      throw new ApiError(409, `Role "${name}" already exists`);
    }

    // Normal users should not create system roles
    if (isSystem === true) {
      throw new ApiError(403, 'System role cannot be created manually');
    }

    const role = await Prisma.role.create({
      data: {
        tenantId,
        name: name.trim(),
        description: description?.trim() || null,
        isSystem: false,
      },
    });

    return role;
  }

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

    // System role cannot be modified
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

  static async getAll(payload, req) {
    const tenantId = req.user?.tenantId;

    if (!tenantId) {
      throw new ApiError(401, 'Tenant not found');
    }

    const roles = await Prisma.role.findMany({
      where: {
        tenantId,
      },

      include: {
        _count: {
          select: {
            users: true,
            rolePermissions: true,
          },
        },
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return roles;
  }

  static async delete(payload, req) {
    const tenantId = req.user?.tenantId;

    if (!tenantId) {
      throw new ApiError(401, 'Tenant not found');
    }

    const { id } = payload;

    if (!id) {
      throw new ApiError(400, 'Role id is required');
    }

    const role = await Prisma.role.findFirst({
      where: {
        id,
        tenantId,
      },

      include: {
        _count: {
          select: {
            users: true,
          },
        },
      },
    });

    if (!role) {
      throw new ApiError(404, 'Role not found');
    }

    // Don't allow deleting system roles
    if (role.isSystem) {
      throw new ApiError(403, 'System role cannot be deleted');
    }

    // Don't delete role if users are assigned
    if (role._count.users > 0) {
      throw new ApiError(
        400,
        'Cannot delete role because users are assigned to this role',
      );
    }

    await Prisma.role.delete({
      where: {
        id,
      },
    });

    return null;
  }
}

export default RoleServices;
