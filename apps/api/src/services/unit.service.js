import { ApiError } from '../utils/ApiError.js';
import Prisma from '../database/db.js';

class UnitServices {
  // =====================================================
  // CREATE UNIT
  // =====================================================

  static async create(payload, req) {
    const tenantId = req.user?.tenantId;

    if (!tenantId) {
      throw new ApiError(401, 'Tenant not found');
    }

    const { name, shortName, isActive = true } = payload;

    if (!name?.trim()) {
      throw new ApiError(400, 'Unit name is required');
    }

    if (!shortName?.trim()) {
      throw new ApiError(400, 'Unit short name is required');
    }

    // Check duplicate unit inside same tenant
    const existingUnit = await Prisma.unit.findFirst({
      where: {
        tenantId,
        name: name.trim(),
      },
    });

    if (existingUnit) {
      throw new ApiError(409, `Unit "${name.trim()}" already exists`);
    }

    const unit = await Prisma.unit.create({
      data: {
        tenantId,
        name: name.trim(),
        shortName: shortName.trim(),
        isActive,
      },
    });

    return unit;
  }

  // =====================================================
  // UPDATE UNIT
  // =====================================================

  static async update(payload, req) {
    const tenantId = req.user?.tenantId;

    if (!tenantId) {
      throw new ApiError(401, 'Tenant not found');
    }

    const { id } = payload;

    if (!id) {
      throw new ApiError(400, 'Unit id is required');
    }

    const unit = await Prisma.unit.findFirst({
      where: {
        id,
        tenantId,
      },
    });

    if (!unit) {
      throw new ApiError(404, 'Unit not found');
    }

    const { name, shortName, isActive } = req.body;

    // Check duplicate name
    if (name !== undefined) {
      if (!name?.trim()) {
        throw new ApiError(400, 'Unit name cannot be empty');
      }

      const duplicateUnit = await Prisma.unit.findFirst({
        where: {
          tenantId,
          name: name.trim(),
          NOT: {
            id,
          },
        },
      });

      if (duplicateUnit) {
        throw new ApiError(409, `Unit "${name.trim()}" already exists`);
      }
    }

    const updatedUnit = await Prisma.unit.update({
      where: {
        id,
      },

      data: {
        ...(name !== undefined && {
          name: name.trim(),
        }),

        ...(shortName !== undefined && {
          shortName: shortName.trim(),
        }),

        ...(isActive !== undefined && {
          isActive,
        }),
      },
    });

    return updatedUnit;
  }

  // =====================================================
  // GET UNIT BY ID
  // =====================================================

  static async getById(payload, req) {
    const tenantId = req.user?.tenantId;

    if (!tenantId) {
      throw new ApiError(401, 'Tenant not found');
    }

    const { id } = payload;

    if (!id) {
      throw new ApiError(400, 'Unit id is required');
    }

    const unit = await Prisma.unit.findFirst({
      where: {
        id,
        tenantId,
      },

      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    if (!unit) {
      throw new ApiError(404, 'Unit not found');
    }

    return unit;
  }

  // =====================================================
  // GET ALL UNITS
  // =====================================================

  static async getAll(payload, req) {
    const tenantId = req.user?.tenantId;

    if (!tenantId) {
      throw new ApiError(401, 'Tenant not found');
    }

    const units = await Prisma.unit.findMany({
      where: {
        tenantId,
      },

      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return units;
  }

  // =====================================================
  // DELETE UNIT
  // =====================================================

  static async delete(payload, req) {
    const tenantId = req.user?.tenantId;

    if (!tenantId) {
      throw new ApiError(401, 'Tenant not found');
    }

    const { id } = payload;

    if (!id) {
      throw new ApiError(400, 'Unit id is required');
    }

    const unit = await Prisma.unit.findFirst({
      where: {
        id,
        tenantId,
      },

      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    if (!unit) {
      throw new ApiError(404, 'Unit not found');
    }

    // Don't delete if products are using this unit
    if (unit._count.products > 0) {
      throw new ApiError(
        400,
        'Cannot delete unit because products are assigned to this unit',
      );
    }

    await Prisma.unit.delete({
      where: {
        id,
      },
    });

    return null;
  }
}

export default UnitServices;
