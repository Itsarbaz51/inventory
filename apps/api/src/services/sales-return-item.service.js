import Prisma from '../database/db.js';

class SalesReturnItemService {
  // =====================================================
  // CREATE
  // =====================================================

  async create(data, tenantId) {
    const { salesReturnId, productId, quantity, rate, total } = data;

    // -----------------------------------------
    // Check Sales Return belongs to tenant
    // -----------------------------------------

    const salesReturn = await Prisma.salesReturn.findFirst({
      where: {
        id: salesReturnId,
        tenantId,
      },
    });

    if (!salesReturn) {
      throw new Error('Sales return not found');
    }

    // -----------------------------------------
    // Check Product belongs to tenant
    // -----------------------------------------

    const product = await Prisma.product.findFirst({
      where: {
        id: productId,
        tenantId,
      },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    // -----------------------------------------
    // Calculate total
    // -----------------------------------------

    const calculatedTotal =
      total !== undefined ? total : Number(quantity) * Number(rate);

    const item = await Prisma.salesReturnItem.create({
      data: {
        salesReturnId,
        productId,
        quantity,
        rate,
        total: calculatedTotal,
      },
      include: {
        product: true,
        salesReturn: true,
      },
    });

    return item;
  }

  // =====================================================
  // GET BY ID
  // =====================================================

  async getById(id, tenantId) {
    const item = await Prisma.salesReturnItem.findFirst({
      where: {
        id,
        salesReturn: {
          tenantId,
        },
      },
      include: {
        product: true,
        salesReturn: true,
      },
    });

    if (!item) {
      throw new Error('Sales return item not found');
    }

    return item;
  }

  // =====================================================
  // GET ALL
  // =====================================================

  async getAll(query, tenantId) {
    const { salesReturnId, productId, search, page = 1, limit = 10 } = query;

    const skip = (page - 1) * limit;

    const where = {
      salesReturn: {
        tenantId,
      },
    };

    if (salesReturnId) {
      where.salesReturnId = salesReturnId;
    }

    if (productId) {
      where.productId = productId;
    }

    if (search) {
      where.product = {
        name: {
          contains: search,
        },
      };
    }

    const [items, total] = await Prisma.$transaction([
      Prisma.salesReturnItem.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          id: 'desc',
        },
        include: {
          product: true,
          salesReturn: true,
        },
      }),

      Prisma.salesReturnItem.count({
        where,
      }),
    ]);

    return {
      items,
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

  async update(id, data, tenantId) {
    const existingItem = await Prisma.salesReturnItem.findFirst({
      where: {
        id,
        salesReturn: {
          tenantId,
        },
      },
    });

    if (!existingItem) {
      throw new Error('Sales return item not found');
    }

    // -----------------------------------------
    // Product validation
    // -----------------------------------------

    if (data.productId) {
      const product = await Prisma.product.findFirst({
        where: {
          id: data.productId,
          tenantId,
        },
      });

      if (!product) {
        throw new Error('Product not found');
      }
    }

    const quantity =
      data.quantity !== undefined
        ? Number(data.quantity)
        : Number(existingItem.quantity);

    const rate =
      data.rate !== undefined ? Number(data.rate) : Number(existingItem.rate);

    const total = data.total !== undefined ? data.total : quantity * rate;

    const item = await Prisma.salesReturnItem.update({
      where: {
        id,
      },

      data: {
        ...(data.productId && {
          productId: data.productId,
        }),

        ...(data.quantity !== undefined && {
          quantity: data.quantity,
        }),

        ...(data.rate !== undefined && {
          rate: data.rate,
        }),

        total,
      },

      include: {
        product: true,
        salesReturn: true,
      },
    });

    return item;
  }

  // =====================================================
  // DELETE
  // =====================================================

  async delete(id, tenantId) {
    const existingItem = await Prisma.salesReturnItem.findFirst({
      where: {
        id,
        salesReturn: {
          tenantId,
        },
      },
    });

    if (!existingItem) {
      throw new Error('Sales return item not found');
    }

    await Prisma.salesReturnItem.delete({
      where: {
        id,
      },
    });

    return {
      id,
      message: 'Sales return item deleted successfully',
    };
  }
}

export default new SalesReturnItemService();
