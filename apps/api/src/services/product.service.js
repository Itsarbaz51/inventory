import { ApiError } from '../utils/ApiError.js';
import Prisma from '../database/db.js';

class ProductServices {
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
      sku,
      barcode,
      categoryId,
      brandId,
      unitId,
      hsnCode,
      purchasePrice = 0,
      sellingPrice = 0,
      mrp,
      taxRate = 0,
      minStock = 0,
      maxStock,
      image,
      description,
      isActive = true,
    } = payload;

    // ---------------------------------------------------
    // Check SKU duplicate
    // ---------------------------------------------------
    const existingSku = await Prisma.product.findFirst({
      where: {
        tenantId,
        sku: sku.trim(),
      },
    });

    if (existingSku) {
      throw new ApiError(409, `Product with SKU "${sku}" already exists`);
    }

    // ---------------------------------------------------
    // Check barcode duplicate
    // ---------------------------------------------------
    if (barcode) {
      const existingBarcode = await Prisma.product.findFirst({
        where: {
          tenantId,
          barcode: barcode.trim(),
        },
      });

      if (existingBarcode) {
        throw new ApiError(
          409,
          `Product with barcode "${barcode}" already exists`,
        );
      }
    }

    // ---------------------------------------------------
    // Check Unit
    // ---------------------------------------------------
    const unit = await Prisma.unit.findFirst({
      where: {
        id: unitId,
        tenantId,
      },
    });

    if (!unit) {
      throw new ApiError(404, 'Unit not found');
    }

    // ---------------------------------------------------
    // Check Category
    // ---------------------------------------------------
    if (categoryId) {
      const category = await Prisma.category.findFirst({
        where: {
          id: categoryId,
          tenantId,
        },
      });

      if (!category) {
        throw new ApiError(404, 'Category not found');
      }
    }

    // ---------------------------------------------------
    // Check Brand
    // ---------------------------------------------------
    if (brandId) {
      const brand = await Prisma.brand.findFirst({
        where: {
          id: brandId,
          tenantId,
        },
      });

      if (!brand) {
        throw new ApiError(404, 'Brand not found');
      }
    }

    // ---------------------------------------------------
    // Business validation
    // ---------------------------------------------------
    if (mrp !== null && mrp !== undefined) {
      if (mrp < sellingPrice) {
        throw new ApiError(400, 'MRP cannot be less than selling price');
      }
    }

    if (maxStock !== null && maxStock !== undefined) {
      if (maxStock < minStock) {
        throw new ApiError(
          400,
          'Maximum stock cannot be less than minimum stock',
        );
      }
    }

    // ---------------------------------------------------
    // Create Product
    // ---------------------------------------------------
    const product = await Prisma.product.create({
      data: {
        tenantId,

        name: name.trim(),
        sku: sku.trim(),

        barcode: barcode?.trim() || null,

        categoryId: categoryId || null,
        brandId: brandId || null,
        unitId,

        hsnCode: hsnCode?.trim() || null,

        purchasePrice,
        sellingPrice,
        mrp: mrp ?? null,

        taxRate,
        minStock,
        maxStock: maxStock ?? null,

        image: image?.trim() || null,
        description: description?.trim() || null,

        isActive,
      },

      include: {
        category: true,
        brand: true,
        unit: true,
      },
    });

    return product;
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

    const product = await Prisma.product.findFirst({
      where: {
        id,
        tenantId,
      },

      include: {
        category: true,
        brand: true,
        unit: true,

        warehouseStocks: {
          include: {
            warehouse: true,
          },
        },
      },
    });

    if (!product) {
      throw new ApiError(404, 'Product not found');
    }

    return product;
  }

  // =====================================================
  // GET ALL
  // =====================================================
  static async getAll(query, req) {
    const tenantId = req.user?.tenantId;

    if (!tenantId) {
      throw new ApiError(401, 'Tenant not found');
    }

    const {
      page = 1,
      limit = 20,
      search,
      categoryId,
      brandId,
      unitId,
      isActive,
    } = query;

    const skip = (page - 1) * limit;

    const where = {
      tenantId,

      ...(search && {
        OR: [
          {
            name: {
              contains: search,
            },
          },
          {
            sku: {
              contains: search,
            },
          },
          {
            barcode: {
              contains: search,
            },
          },
        ],
      }),

      ...(categoryId && {
        categoryId,
      }),

      ...(brandId && {
        brandId,
      }),

      ...(unitId && {
        unitId,
      }),

      ...(isActive !== undefined && {
        isActive: isActive === 'true',
      }),
    };

    const [products, total] = await Prisma.$transaction([
      Prisma.product.findMany({
        where,

        include: {
          category: true,
          brand: true,
          unit: true,
        },

        orderBy: {
          createdAt: 'desc',
        },

        skip,
        take: limit,
      }),

      Prisma.product.count({
        where,
      }),
    ]);

    return {
      products,

      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // =====================================================
  // UPDATE
  // =====================================================
  static async update(payload, req) {
    const tenantId = req.user?.tenantId;

    if (!tenantId) {
      throw new ApiError(401, 'Tenant not found');
    }

    const { id } = payload;

    const product = await Prisma.product.findFirst({
      where: {
        id,
        tenantId,
      },
    });

    if (!product) {
      throw new ApiError(404, 'Product not found');
    }

    const data = req.body;

    // ---------------------------------------------------
    // SKU
    // ---------------------------------------------------
    if (data.sku !== undefined) {
      const sku = data.sku.trim();

      const duplicateSku = await Prisma.product.findFirst({
        where: {
          tenantId,
          sku,
          NOT: {
            id,
          },
        },
      });

      if (duplicateSku) {
        throw new ApiError(409, `Product with SKU "${sku}" already exists`);
      }

      data.sku = sku;
    }

    // ---------------------------------------------------
    // Barcode
    // ---------------------------------------------------
    if (data.barcode) {
      const barcode = data.barcode.trim();

      const duplicateBarcode = await Prisma.product.findFirst({
        where: {
          tenantId,
          barcode,
          NOT: {
            id,
          },
        },
      });

      if (duplicateBarcode) {
        throw new ApiError(
          409,
          `Product with barcode "${barcode}" already exists`,
        );
      }

      data.barcode = barcode;
    }

    // ---------------------------------------------------
    // Unit
    // ---------------------------------------------------
    if (data.unitId !== undefined) {
      const unit = await Prisma.unit.findFirst({
        where: {
          id: data.unitId,
          tenantId,
        },
      });

      if (!unit) {
        throw new ApiError(404, 'Unit not found');
      }
    }

    // ---------------------------------------------------
    // Category
    // ---------------------------------------------------
    if (data.categoryId) {
      const category = await Prisma.category.findFirst({
        where: {
          id: data.categoryId,
          tenantId,
        },
      });

      if (!category) {
        throw new ApiError(404, 'Category not found');
      }
    }

    // ---------------------------------------------------
    // Brand
    // ---------------------------------------------------
    if (data.brandId) {
      const brand = await Prisma.brand.findFirst({
        where: {
          id: data.brandId,
          tenantId,
        },
      });

      if (!brand) {
        throw new ApiError(404, 'Brand not found');
      }
    }

    // ---------------------------------------------------
    // Price validation
    // ---------------------------------------------------
    const finalSellingPrice =
      data.sellingPrice !== undefined
        ? data.sellingPrice
        : Number(product.sellingPrice);

    const finalMrp =
      data.mrp !== undefined
        ? data.mrp
        : product.mrp !== null
          ? Number(product.mrp)
          : null;

    if (finalMrp !== null && finalMrp < finalSellingPrice) {
      throw new ApiError(400, 'MRP cannot be less than selling price');
    }

    // ---------------------------------------------------
    // Stock validation
    // ---------------------------------------------------
    const finalMinStock =
      data.minStock !== undefined ? data.minStock : Number(product.minStock);

    const finalMaxStock =
      data.maxStock !== undefined
        ? data.maxStock
        : product.maxStock !== null
          ? Number(product.maxStock)
          : null;

    if (finalMaxStock !== null && finalMaxStock < finalMinStock) {
      throw new ApiError(
        400,
        'Maximum stock cannot be less than minimum stock',
      );
    }

    // ---------------------------------------------------
    // Clean string values
    // ---------------------------------------------------
    if (data.name !== undefined) {
      data.name = data.name.trim();
    }

    if (data.hsnCode !== undefined && data.hsnCode) {
      data.hsnCode = data.hsnCode.trim();
    }

    if (data.image !== undefined && data.image) {
      data.image = data.image.trim();
    }

    if (data.description !== undefined && data.description) {
      data.description = data.description.trim();
    }

    // ---------------------------------------------------
    // Update
    // ---------------------------------------------------
    const updatedProduct = await Prisma.product.update({
      where: {
        id,
      },

      data: {
        ...data,
      },

      include: {
        category: true,
        brand: true,
        unit: true,
      },
    });

    return updatedProduct;
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

    const product = await Prisma.product.findFirst({
      where: {
        id,
        tenantId,
      },

      include: {
        _count: {
          select: {
            purchaseItems: true,
            purchaseReturnItems: true,
            saleItems: true,
            salesReturnItems: true,
            stockMovements: true,
            warehouseStocks: true,
          },
        },
      },
    });

    if (!product) {
      throw new ApiError(404, 'Product not found');
    }

    // ---------------------------------------------------
    // Don't delete product if used anywhere
    // ---------------------------------------------------
    const isUsed =
      product._count.purchaseItems > 0 ||
      product._count.purchaseReturnItems > 0 ||
      product._count.saleItems > 0 ||
      product._count.salesReturnItems > 0 ||
      product._count.stockMovements > 0 ||
      product._count.warehouseStocks > 0;

    if (isUsed) {
      throw new ApiError(
        400,
        'Cannot delete product because it is already used in transactions or stock',
      );
    }

    await Prisma.product.delete({
      where: {
        id,
      },
    });

    return null;
  }
}

export default ProductServices;
    