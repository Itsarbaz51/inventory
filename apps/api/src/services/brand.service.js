import { ApiError } from '../utils/ApiError.js';
import Prisma from '../database/db.js';

class BrandServices {
  // =====================================================
  // CREATE BRAND
  // =====================================================

  static async create(payload, req) {
    const tenantId = req.user?.tenantId;

    if (!tenantId) {
      throw ApiError.internal(401, 'Tenant not found');
    }

    const {
      name,
      description,
      isActive = true,
    } = payload;

    if (!name?.trim()) {
      throw ApiError.badRequest(400, 'Brand name is required');
    }

    // Check duplicate brand inside same tenant
    const existingBrand = await Prisma.brand.findFirst({
      where: {
        tenantId,
        name: name.trim(),
      },
    });

    if (existingBrand) {
      throw ApiError.conflict(
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
      throw ApiError.internal(401, 'Tenant not found');
    }

    const { id } = payload;

    if (!id) {
      throw ApiError.badRequest(400, 'Brand id is required');
    }

    const brand = await Prisma.brand.findFirst({
      where: {
        id,
        tenantId,
      },
    });

    if (!brand) {
      throw ApiError.notFound(404, 'Brand not found');
    }

    const {
      name,
      description,
      isActive,
    } = req.body;

    // Check duplicate name
    if (name !== undefined) {
      if (!name?.trim()) {
        throw ApiError.badRequest(
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
        throw ApiError.conflict(
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
      throw ApiError.internal(401, 'Tenant not found');
    }

    const { id } = payload;

    if (!id) {
      throw ApiError.badRequest(400, 'Brand id is required');
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
      throw ApiError.notFound(404, 'Brand not found');
    }

    return brand;
  }

  // =====================================================
  // GET ALL BRANDS
  // =====================================================
  static async getAll(req) {
    const tenantId = req.user?.tenantId;

    if (!tenantId) {
      throw ApiError.badRequest(401, "Tenant not found");
    }

    const {
      page = 1,
      limit = 20,
      search = "",
      status = "ALL",
    } = req.query;

    const currentPage = Math.max(Number(page) || 1, 1);
    const currentLimit = Math.max(Number(limit) || 20, 1);

    const skip = (currentPage - 1) * currentLimit;

    const where = {
      tenantId,
    };

    // =====================================================
    // SEARCH
    // =====================================================

    if (search.trim()) {
      where.OR = [
        {
          name: {
            contains: search.trim(),
            // mode: "insensitive",
          },
        },
        {
          description: {
            contains: search.trim(),
            // mode: "insensitive",
          },
        },
      ];
    }

    // =====================================================
    // STATUS
    // =====================================================

    if (status === "ACTIVE") {
      where.isActive = true;
    }

    if (status === "INACTIVE") {
      where.isActive = false;
    }

    // =====================================================
    // GET DATA + TOTAL
    // =====================================================

    const [brands, total] = await Prisma.$transaction([
      Prisma.brand.findMany({
        where,

        skip,
        take: currentLimit,

        include: {
          _count: {
            select: {
              products: true,
            },
          },
        },

        orderBy: {
          createdAt: "desc",
        },
      }),

      Prisma.brand.count({
        where,
      }),
    ]);

    // =====================================================
    // RESPONSE
    // =====================================================

    return {
      brands,

      pagination: {
        page: currentPage,
        limit: currentLimit,
        total,
        totalPages: Math.ceil(total / currentLimit),
      },
    };
  }


  // =====================================================
  // DELETE BRAND
  // =====================================================

  static async delete(payload, req) {
    const tenantId = req.user?.tenantId;

    if (!tenantId) {
      throw ApiError.badRequest(401, 'Tenant not found');
    }

    const { id } = payload;

    if (!id) {
      throw ApiError.badRequest(400, 'Brand id is required');
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
      throw ApiError.notFound(404, 'Brand not found');
    }

    // Don't delete if products are assigned
    if (brand._count.products > 0) {
      throw ApiError.badRequest(
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