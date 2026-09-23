import { ApiError } from '../utils/ApiError.js';
import Prisma from '../database/db.js';

class CategoryServices {
  // =====================================================
  // CREATE CATEGORY
  // =====================================================
  static async create(payload, req) {
    const tenantId = req.user?.tenantId;

    if (!tenantId) {
      throw new ApiError(401, 'Tenant not found');
    }

    const { name, description, parentId = null, isActive = true } = payload;

    const categoryName = name?.trim();

    if (!categoryName) {
      throw new ApiError(400, 'Category name is required');
    }

    // ---------------------------------------------------
    // Check duplicate category in same tenant
    // ---------------------------------------------------
    const existingCategory = await Prisma.category.findFirst({
      where: {
        tenantId,
        name: categoryName,
      },
    });

    if (existingCategory) {
      throw new ApiError(409, `Category "${categoryName}" already exists`);
    }

    // ---------------------------------------------------
    // Validate parent category
    // ---------------------------------------------------
    if (parentId) {
      const parentCategory = await Prisma.category.findFirst({
        where: {
          id: parentId,
          tenantId,
        },
      });

      if (!parentCategory) {
        throw new ApiError(404, 'Parent category not found');
      }
    }

    // ---------------------------------------------------
    // Create
    // ---------------------------------------------------
    const category = await Prisma.category.create({
      data: {
        tenantId,
        name: categoryName,
        description: description?.trim() || null,
        parentId: parentId || null,
        isActive,
      },
      include: {
        parent: true,
      },
    });

    return category;
  }

  // =====================================================
  // UPDATE CATEGORY
  // =====================================================
  static async update(payload, req) {
    const tenantId = req.user?.tenantId;

    if (!tenantId) {
      throw new ApiError(401, 'Tenant not found');
    }

    const { id } = payload;

    if (!id) {
      throw new ApiError(400, 'Category id is required');
    }

    const { name, description, parentId, isActive } = req.body;

    // ---------------------------------------------------
    // Find category
    // ---------------------------------------------------
    const category = await Prisma.category.findFirst({
      where: {
        id,
        tenantId,
      },
    });

    if (!category) {
      throw new ApiError(404, 'Category not found');
    }

    // ---------------------------------------------------
    // Duplicate name check
    // ---------------------------------------------------
    if (name !== undefined) {
      const categoryName = name.trim();

      if (!categoryName) {
        throw new ApiError(400, 'Category name cannot be empty');
      }

      const duplicateCategory = await Prisma.category.findFirst({
        where: {
          tenantId,
          name: categoryName,
          NOT: {
            id,
          },
        },
      });

      if (duplicateCategory) {
        throw new ApiError(409, `Category "${categoryName}" already exists`);
      }
    }

    // ---------------------------------------------------
    // Parent category validation
    // ---------------------------------------------------
    if (parentId !== undefined && parentId !== null) {
      // Cannot make itself parent
      if (parentId === id) {
        throw new ApiError(400, 'Category cannot be its own parent');
      }

      const parentCategory = await Prisma.category.findFirst({
        where: {
          id: parentId,
          tenantId,
        },
      });

      if (!parentCategory) {
        throw new ApiError(404, 'Parent category not found');
      }
    }

    // ---------------------------------------------------
    // Update
    // ---------------------------------------------------
    const updatedCategory = await Prisma.category.update({
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

        ...(parentId !== undefined && {
          parentId: parentId || null,
        }),

        ...(isActive !== undefined && {
          isActive,
        }),
      },

      include: {
        parent: true,
        children: true,
      },
    });

    return updatedCategory;
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
      throw new ApiError(400, 'Category id is required');
    }

    const category = await Prisma.category.findFirst({
      where: {
        id,
        tenantId,
      },

      include: {
        parent: true,

        children: {
          orderBy: {
            name: 'asc',
          },
        },

        _count: {
          select: {
            products: true,
            children: true,
          },
        },
      },
    });

    if (!category) {
      throw new ApiError(404, 'Category not found');
    }

    return category;
  }

  // =====================================================
  // GET ALL
  // =====================================================
  static async getAll(req) {
    const tenantId = req.user?.tenantId;

    if (!tenantId) {
      throw new ApiError(401, 'Tenant not found');
    }

    const categories = await Prisma.category.findMany({
      where: {
        tenantId,
      },

      include: {
        parent: {
          select: {
            id: true,
            name: true,
          },
        },

        _count: {
          select: {
            products: true,
            children: true,
          },
        },
      },

      orderBy: {
        name: 'asc',
      },
    });

    return categories;
  }

  // =====================================================
  // DELETE
  // =====================================================
  static async delete(payload, req) {
    const tenantId = req.user?.tenantId;

    if (!tenantId) {
      throw new ApiError(401, 'Tenant not found');
    }

    const { id } = payload;

    if (!id) {
      throw new ApiError(400, 'Category id is required');
    }

    const category = await Prisma.category.findFirst({
      where: {
        id,
        tenantId,
      },

      include: {
        _count: {
          select: {
            children: true,
            products: true,
          },
        },
      },
    });

    if (!category) {
      throw new ApiError(404, 'Category not found');
    }

    // ---------------------------------------------------
    // Don't delete if child categories exist
    // ---------------------------------------------------
    if (category._count.children > 0) {
      throw new ApiError(
        400,
        'Cannot delete category because child categories are assigned',
      );
    }

    // ---------------------------------------------------
    // Don't delete if products exist
    // ---------------------------------------------------
    if (category._count.products > 0) {
      throw new ApiError(
        400,
        'Cannot delete category because products are assigned',
      );
    }

    await Prisma.category.delete({
      where: {
        id,
      },
    });

    return null;
  }
}

export default CategoryServices;
