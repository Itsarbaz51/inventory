import Prisma from '../database/db.js';

import { ApiError } from '../utils/ApiError.js';

class PermissionServices {
  // GET ALL PERMISSIONS

  static async getAll(payload, req) {
    const permissions = await Prisma.permission.findMany({
      orderBy: [
        {
          module: 'asc',
        },
        {
          action: 'asc',
        },
      ],
    });

    return permissions;
  }

  // GET ROLE PERMISSIONS

  static async getRolePermissions(payload, req) {
    const tenantId = req.user?.tenantId;

    if (!tenantId) {
      throw ApiError(401, 'Tenant not found');
    }

    const { roleId } = payload;

    if (!roleId) {
      throw ApiError(400, 'Role id is required');
    }

    // Check role belongs to current tenant
    const role = await Prisma.role.findFirst({
      where: {
        id: roleId,
        tenantId,
      },
    });

    if (!role) {
      throw ApiError(404, 'Role not found');
    }

    const rolePermissions = await Prisma.rolePermission.findMany({
      where: {
        roleId,
      },

      include: {
        permission: true,
      },

      orderBy: {
        permission: {
          module: 'asc',
        },
      },
    });

    return {
      role,
      permissions: rolePermissions.map((item) => item.permission),
    };
  }

  // UPDATE ROLE PERMISSIONS

  // UPDATE ROLE PERMISSIONS

  static async updateRolePermissions(payload, req) {
    const tenantId = req.user?.tenantId;

    if (!tenantId) {
      throw ApiError(401, 'Tenant not found');
    }

    const { roleId, permissionIds = [] } = payload;

    if (!roleId) {
      throw ApiError(400, 'Role id is required');
    }

    // CHECK ROLE

    const role = await Prisma.role.findFirst({
      where: {
        id: roleId,
        tenantId,
      },
    });

    if (!role) {
      throw ApiError(404, 'Role not found');
    }

    // SYSTEM ROLE

    if (role.isSystem) {
      throw ApiError(403, 'System role permissions cannot be modified');
    }

    // REMOVE DUPLICATES

    const uniquePermissionIds = [...new Set(permissionIds)];

    // VALIDATE PERMISSIONS

    if (uniquePermissionIds.length > 0) {
      const existingPermissions = await Prisma.permission.findMany({
        where: {
          id: {
            in: uniquePermissionIds,
          },
        },
        select: {
          id: true,
        },
      });

      const existingPermissionIds = existingPermissions.map(
        (permission) => permission.id,
      );

      const invalidPermissionIds = uniquePermissionIds.filter(
        (id) => !existingPermissionIds.includes(id),
      );

      if (invalidPermissionIds.length > 0) {
        throw ApiError(400, 'One or more permissions are invalid');
      }
    }

    // TRANSACTION

    await Prisma.$transaction(async (tx) => {
      // Remove old permissions
      await tx.rolePermission.deleteMany({
        where: {
          roleId,
        },
      });

      // Add new permissions
      if (uniquePermissionIds.length > 0) {
        await tx.rolePermission.createMany({
          data: uniquePermissionIds.map((permissionId) => ({
            roleId,
            permissionId,
          })),
          skipDuplicates: true,
        });
      }
    });

    // RETURN UPDATED DATA

    const updatedPermissions = await Prisma.rolePermission.findMany({
      where: {
        roleId,
      },
      include: {
        permission: true,
      },
      orderBy: {
        permission: {
          module: 'asc',
        },
      },
    });

    return {
      role,
      permissions: updatedPermissions.map((item) => item.permission),
    };
  }

  // GET LOGGED-IN USER PERMISSIONS

  static async getMyPermissions(payload, req) {
    const userId = req.user?.id;
    const tenantId = req.user?.tenantId;

    if (!userId) {
      throw ApiError(401, 'User not authenticated');
    }

    if (!tenantId) {
      throw ApiError(401, 'Tenant not found');
    }

    const user = await Prisma.user.findFirst({
      where: {
        id: userId,
        tenantId,
      },

      include: {
        role: {
          include: {
            rolePermissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw ApiError(404, 'User not found');
    }

    if (!user.role) {
      return {
        role: null,
        permissions: [],
      };
    }

    return {
      role: {
        id: user.role.id,
        name: user.role.name,
      },

      permissions: user.role.rolePermissions.map((item) => item.permission),
    };
  }
}

export default PermissionServices;
