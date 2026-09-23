import { ApiError } from '../utils/ApiError.js';
import Prisma from '../database/db.js';

class WarehouseServices {
  // =====================================================
  // CREATE
  // =====================================================

  static async create(payload, req) {
    const tenantId = req.user?.tenantId;

    if (!tenantId) {
      throw new ApiError(401, 'Tenant not found');
    }

    const {
      name,
      code,
      address,
      city,
      state,
      pincode,
      managerName,
      phone,
      isActive = true,
    } = payload;

    if (!name?.trim()) {
      throw new ApiError(400, 'Warehouse name is required');
    }

    if (!code?.trim()) {
      throw new ApiError(400, 'Warehouse code is required');
    }

    // Check duplicate warehouse code inside same tenant
    const existingWarehouse = await Prisma.warehouse.findFirst({
      where: {
        tenantId,
        code: code.trim(),
      },
    });

    if (existingWarehouse) {
      throw new ApiError(409, `Warehouse code "${code}" already exists`);
    }

    const warehouse = await Prisma.warehouse.create({
      data: {
        tenantId,
        name: name.trim(),
        code: code.trim().toUpperCase(),
        address: address?.trim() || null,
        city: city?.trim() || null,
        state: state?.trim() || null,
        pincode: pincode?.trim() || null,
        managerName: managerName?.trim() || null,
        phone: phone?.trim() || null,
        isActive,
      },
    });

    return warehouse;
  }

  // =====================================================
  // UPDATE
  // =====================================================

  static async update(id, payload, req) {
    const tenantId = req.user?.tenantId;

    if (!tenantId) {
      throw new ApiError(401, 'Tenant not found');
    }

    if (!id) {
      throw new ApiError(400, 'Warehouse id is required');
    }

    const warehouse = await Prisma.warehouse.findFirst({
      where: {
        id,
        tenantId,
      },
    });

    if (!warehouse) {
      throw new ApiError(404, 'Warehouse not found');
    }

    const {
      name,
      code,
      address,
      city,
      state,
      pincode,
      managerName,
      phone,
      isActive,
    } = payload;

    // Check duplicate code
    if (code !== undefined) {
      const normalizedCode = code.trim().toUpperCase();

      const duplicateWarehouse = await Prisma.warehouse.findFirst({
        where: {
          tenantId,
          code: normalizedCode,
          NOT: {
            id,
          },
        },
      });

      if (duplicateWarehouse) {
        throw new ApiError(409, `Warehouse code "${code}" already exists`);
      }
    }

    const updatedWarehouse = await Prisma.warehouse.update({
      where: {
        id,
      },

      data: {
        ...(name !== undefined && {
          name: name.trim(),
        }),

        ...(code !== undefined && {
          code: code.trim().toUpperCase(),
        }),

        ...(address !== undefined && {
          address: address?.trim() || null,
        }),

        ...(city !== undefined && {
          city: city?.trim() || null,
        }),

        ...(state !== undefined && {
          state: state?.trim() || null,
        }),

        ...(pincode !== undefined && {
          pincode: pincode?.trim() || null,
        }),

        ...(managerName !== undefined && {
          managerName: managerName?.trim() || null,
        }),

        ...(phone !== undefined && {
          phone: phone?.trim() || null,
        }),

        ...(isActive !== undefined && {
          isActive,
        }),
      },
    });

    return updatedWarehouse;
  }

  // =====================================================
  // GET BY ID
  // =====================================================

  static async getById(id, req) {
    const tenantId = req.user?.tenantId;

    if (!tenantId) {
      throw new ApiError(401, 'Tenant not found');
    }

    if (!id) {
      throw new ApiError(400, 'Warehouse id is required');
    }

    const warehouse = await Prisma.warehouse.findFirst({
      where: {
        id,
        tenantId,
      },

      include: {
        _count: {
          select: {
            stocks: true,
            purchases: true,
            sales: true,
            stockMovements: true,
          },
        },
      },
    });

    if (!warehouse) {
      throw new ApiError(404, 'Warehouse not found');
    }

    return warehouse;
  }

  // =====================================================
  // GET ALL
  // =====================================================

  static async getAll(req) {
    const tenantId = req.user?.tenantId;

    if (!tenantId) {
      throw new ApiError(401, 'Tenant not found');
    }

    const { search, isActive, page = 1, limit = 20 } = req.query;

    const skip = (page - 1) * limit;

    const where = {
      tenantId,

      ...(isActive !== undefined && {
        isActive,
      }),

      ...(search && {
        OR: [
          {
            name: {
              contains: search,
            },
          },
          {
            code: {
              contains: search,
            },
          },
          {
            city: {
              contains: search,
            },
          },
          {
            managerName: {
              contains: search,
            },
          },
        ],
      }),
    };

    const [warehouses, total] = await Promise.all([
      Prisma.warehouse.findMany({
        where,

        include: {
          _count: {
            select: {
              stocks: true,
              purchases: true,
              sales: true,
              stockMovements: true,
            },
          },
        },

        orderBy: {
          createdAt: 'desc',
        },

        skip,
        take: limit,
      }),

      Prisma.warehouse.count({
        where,
      }),
    ]);

    return {
      data: warehouses,

      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // =====================================================
  // DELETE
  // =====================================================

  static async delete(id, req) {
    const tenantId = req.user?.tenantId;

    if (!tenantId) {
      throw new ApiError(401, 'Tenant not found');
    }

    if (!id) {
      throw new ApiError(400, 'Warehouse id is required');
    }

    const warehouse = await Prisma.warehouse.findFirst({
      where: {
        id,
        tenantId,
      },

      include: {
        _count: {
          select: {
            stocks: true,
            purchases: true,
            sales: true,
            stockMovements: true,
          },
        },
      },
    });

    if (!warehouse) {
      throw new ApiError(404, 'Warehouse not found');
    }

    // Don't delete warehouse if it has stock
    if (warehouse._count.stocks > 0) {
      throw new ApiError(
        400,
        'Cannot delete warehouse because stock records are assigned to this warehouse',
      );
    }

    // Don't delete warehouse if used in purchases
    if (warehouse._count.purchases > 0) {
      throw new ApiError(
        400,
        'Cannot delete warehouse because purchases are assigned to this warehouse',
      );
    }

    // Don't delete warehouse if used in sales
    if (warehouse._count.sales > 0) {
      throw new ApiError(
        400,
        'Cannot delete warehouse because sales are assigned to this warehouse',
      );
    }

    // Don't delete warehouse if stock movement exists
    if (warehouse._count.stockMovements > 0) {
      throw new ApiError(
        400,
        'Cannot delete warehouse because stock movements exist for this warehouse',
      );
    }

    await Prisma.warehouse.delete({
      where: {
        id,
      },
    });

    return null;
  }
}

export default WarehouseServices;
