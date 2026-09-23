import Prisma from '../database/db.js';
import { ApiError } from '../utils/ApiError.js';
import CryptoService from '../utils/crypto.utils.js';
import HelperUtils from '../utils/helper.utils.js';

class UserServices {
  static async create(payload, req) {
    const tenantId = req.user?.tenantId;

    if (!tenantId) {
      throw new ApiError(401, 'Tenant not found');
    }

    const { name, email, phone, password, roleId, status = 'ACTIVE' } = payload;

    // ---------------------------------------------------
    // Check email
    // ---------------------------------------------------
    const existingUser = await Prisma.user.findFirst({
      where: {
        tenantId,
        email: email.toLowerCase(),
      },
    });

    if (existingUser) {
      throw new ApiError(409, 'User with this email already exists');
    }

    // ---------------------------------------------------
    // Validate Role
    // ---------------------------------------------------
    if (roleId) {
      const role = await Prisma.role.findFirst({
        where: {
          id: roleId,
          tenantId,
        },
      });

      if (!role) {
        throw new ApiError(404, 'Role not found');
      }
    }

    const hashedPassword = await CryptoService.encrypt(password);

    // ---------------------------------------------------
    // Generate User Number
    // ---------------------------------------------------
    const userNumber = await HelperUtils.generateUniqueId('USR');

    const user = await Prisma.user.create({
      data: {
        userNumber,
        tenantId,
        name: name.trim(),
        email: email.toLowerCase(),

        phone: phone?.trim() || null,

        password: hashedPassword,

        roleId: roleId || null,

        status,
      },

      select: {
        id: true,
        userNumber: true,
        tenantId: true,
        name: true,
        email: true,
        phone: true,
        roleId: true,
        status: true,
        createdAt: true,
        updatedAt: true,

        role: {
          select: {
            id: true,
            name: true,
            description: true,
            isSystem: true,
          },
        },
      },
    });

    return user;
  }

  // =====================================================
  // UPDATE USER
  // =====================================================
  static async update(payload, req) {
    const tenantId = req.user?.tenantId;

    if (!tenantId) {
      throw new ApiError(401, 'Tenant not found');
    }

    const { id } = payload;

    if (!id) {
      throw new ApiError(400, 'User id is required');
    }

    const { name, email, phone, password, roleId, status } = req.body;

    // ---------------------------------------------------
    // Find User
    // ---------------------------------------------------
    const user = await Prisma.user.findFirst({
      where: {
        id,
        tenantId,
      },
    });

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    // ---------------------------------------------------
    // Email duplicate check
    // ---------------------------------------------------
    if (email !== undefined) {
      const existingUser = await Prisma.user.findFirst({
        where: {
          tenantId,
          email: email.toLowerCase(),

          NOT: {
            id,
          },
        },
      });

      if (existingUser) {
        throw new ApiError(409, 'User with this email already exists');
      }
    }

    // ---------------------------------------------------
    // Validate Role
    // ---------------------------------------------------
    if (roleId !== undefined && roleId !== null) {
      const role = await Prisma.role.findFirst({
        where: {
          id: roleId,
          tenantId,
        },
      });

      if (!role) {
        throw new ApiError(404, 'Role not found');
      }
    }

    // ---------------------------------------------------
    // Prepare Update Data
    // ---------------------------------------------------
    const updateData = {};

    if (name !== undefined) {
      updateData.name = name.trim();
    }

    if (email !== undefined) {
      updateData.email = email.toLowerCase();
    }

    if (phone !== undefined) {
      updateData.phone = phone?.trim() || null;
    }

    if (roleId !== undefined) {
      updateData.roleId = roleId;
    }

    if (status !== undefined) {
      updateData.status = status;
    }

    if (password !== undefined) {
      updateData.password = await bcrypt.hash(password, 12);
    }

    // ---------------------------------------------------
    // Update
    // ---------------------------------------------------
    const updatedUser = await Prisma.user.update({
      where: {
        id,
      },

      data: updateData,

      select: {
        id: true,
        userNumber: true,
        tenantId: true,
        name: true,
        email: true,
        phone: true,
        roleId: true,
        status: true,
        createdAt: true,
        updatedAt: true,

        role: {
          select: {
            id: true,
            name: true,
            description: true,
            isSystem: true,
          },
        },
      },
    });

    return updatedUser;
  }

  // =====================================================
  // GET BY ID
  // =====================================================
  static async getById(payload, req) {
    const tenantId = req.user?.tenantId;

    if (!tenantId) {
      throw new ApiError(401, 'Tenant not found');
    }

    const { id } = payload;

    if (!id) {
      throw new ApiError(400, 'User id is required');
    }

    const user = await Prisma.user.findFirst({
      where: {
        id,
        tenantId,
      },

      select: {
        id: true,
        userNumber: true,
        tenantId: true,
        name: true,
        email: true,
        phone: true,
        roleId: true,
        status: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,

        role: {
          select: {
            id: true,
            name: true,
            description: true,
            isSystem: true,
          },
        },

        _count: {
          select: {
            purchases: true,
            sales: true,
            payments: true,
            notifications: true,
          },
        },
      },
    });

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    return user;
  }

  // =====================================================
  // GET ALL
  // =====================================================
  static async getAll(payload, req) {
    const tenantId = req.user?.tenantId;

    if (!tenantId) {
      throw new ApiError(401, 'Tenant not found');
    }

    const { page = 1, limit = 10, search, status, roleId } = payload;

    const skip = (page - 1) * limit;

    const where = {
      tenantId,
    };

    // ---------------------------------------------------
    // Search
    // ---------------------------------------------------
    if (search) {
      where.OR = [
        {
          name: {
            contains: search,
          },
        },
        {
          email: {
            contains: search,
          },
        },
        {
          userNumber: {
            contains: search,
          },
        },
        {
          phone: {
            contains: search,
          },
        },
      ];
    }

    // ---------------------------------------------------
    // Status
    // ---------------------------------------------------
    if (status) {
      where.status = status;
    }

    // ---------------------------------------------------
    // Role
    // ---------------------------------------------------
    if (roleId) {
      where.roleId = roleId;
    }

    const [users, total] = await Prisma.$transaction([
      Prisma.user.findMany({
        where,

        skip,

        take: limit,

        orderBy: {
          createdAt: 'desc',
        },

        select: {
          id: true,
          userNumber: true,
          tenantId: true,
          name: true,
          email: true,
          phone: true,
          roleId: true,
          status: true,
          lastLoginAt: true,
          createdAt: true,
          updatedAt: true,

          role: {
            select: {
              id: true,
              name: true,
              description: true,
              isSystem: true,
            },
          },
        },
      }),

      Prisma.user.count({
        where,
      }),
    ]);

    return {
      users,

      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // =====================================================
  // DELETE USER
  // =====================================================
  static async delete(payload, req) {
    const tenantId = req.user?.tenantId;

    if (!tenantId) {
      throw new ApiError(401, 'Tenant not found');
    }

    const { id } = payload;

    if (!id) {
      throw new ApiError(400, 'User id is required');
    }

    const user = await Prisma.user.findFirst({
      where: {
        id,
        tenantId,
      },

      include: {
        _count: {
          select: {
            purchases: true,
            sales: true,
            payments: true,
          },
        },
      },
    });

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    // ---------------------------------------------------
    // Prevent deleting user having transactions
    // ---------------------------------------------------
    if (
      user._count.purchases > 0 ||
      user._count.sales > 0 ||
      user._count.payments > 0
    ) {
      throw new ApiError(
        400,
        'Cannot delete user because transaction records are associated with this user',
      );
    }

    await Prisma.user.delete({
      where: {
        id,
      },
    });

    return null;
  }
}

export default UserServices;
