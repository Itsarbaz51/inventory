import { ApiError } from '../utils/ApiError.js';
import Prisma from '../database/db.js';

class BrandServices {
  // =====================================================
  // CREATE BRAND
  // =====================================================

  static async create(payload, req) {
    const tenantId = req.user?.tenantId;

    if (!tenantId) {
      throw new ApiError(401, 'Tenant not found');
    }

    const {
      name,
      description,
      isActive = true,
    } = payload;

    if (!name?.trim()) {
      throw new ApiError(400, 'Brand name is required');
    }

    // Check duplicate brand inside same tenant
    const existingBrand = await Prisma.brand.findFirst({
      where: {
        tenantId,
        name: name.trim(),
      },
    });

    if (existingBrand) {
      throw new ApiError(
        409,
        `Brand "${name.trim()}" already exists`,
      );
    }

    const brand = await Prisma.brand.create({
      data: {
        tenantId,
        name: name.trim(),
        description: description?.trim() || null,
        isActive,
      },
    });

    return brand;
  }

  // =====================================================
  // UPDATE BRAND
  // =====================================================

  static async update(payload, req) {
    const tenantId = req.user?.tenantId;

    if (!tenantId) {
      throw new ApiError(401, 'Tenant not found');
    }

    const { id } = payload;

    if (!id) {
      throw new ApiError(400, 'Brand id is required');
    }

    const brand = await Prisma.brand.findFirst({
      where: {
        id,
        tenantId,
      },
    });

    if (!brand) {
      throw new ApiError(404, 'Brand not found');
    }

    const {
      name,
      description,
      isActive,
    } = req.body;

    // Check duplicate name
    if (name !== undefined) {
      if (!name?.trim()) {
        throw new ApiError(
          400,
          'Brand name cannot be empty',
        );
      }

      const duplicateBrand = await Prisma.brand.findFirst({
        where: {
          tenantId,
          name: name.trim(),
          NOT: {
            id,
          },
        },
      });

      if (duplicateBrand) {
        throw new ApiError(
          409,
          `Brand "${name.trim()}" already exists`,
        );
      }
    }

    const updatedBrand = await Prisma.brand.update({
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

        ...(isActive !== undefined && {
          isActive,
        }),
      },
    });

    return updatedBrand;
  }

  // =====================================================
  // GET BRAND BY ID
  // =====================================================

  static async getById(payload, req) {
    const tenantId = req.user?.tenantId;

    if (!tenantId) {
      throw new ApiError(401, 'Tenant not found');
    }

    const { id } = payload;

    if (!id) {
      throw new ApiError(400, 'Brand id is required');
    }

    const brand = await Prisma.brand.findFirst({
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

    if (!brand) {
      throw new ApiError(404, 'Brand not found');
    }

    return brand;
  }

  // =====================================================
  // GET ALL BRANDS
  // =====================================================

  static async getAll(payload, req) {
    const tenantId = req.user?.tenantId;

    if (!tenantId) {
      throw new ApiError(401, 'Tenant not found');
    }

    const brands = await Prisma.brand.findMany({
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

    return brands;
  }

  // =====================================================
  // DELETE BRAND
  // =====================================================

  static async delete(payload, req) {
    const tenantId = req.user?.tenantId;

    if (!tenantId) {
      throw new ApiError(401, 'Tenant not found');
    }

    const { id } = payload;

    if (!id) {
      throw new ApiError(400, 'Brand id is required');
    }

    const brand = await Prisma.brand.findFirst({
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

    if (!brand) {
      throw new ApiError(404, 'Brand not found');
    }

    // Don't delete if products are assigned
    if (brand._count.products > 0) {
      throw new ApiError(
        400,
        'Cannot delete brand because products are assigned to this brand',
      );
    }

    await Prisma.brand.delete({
      where: {
        id,
      },
    });

    return null;
  }
}

export default BrandServices;