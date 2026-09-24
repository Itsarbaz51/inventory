import Prisma from '../database/db.js';

class SaleItemService {
  /**
   * Create Sale Item
   */
  async create(tenantId, data) {
    const {
      saleId,
      productId,
      quantity,
      rate,
      discount = 0,
      taxRate = 0,
      taxAmount = 0,
      total = 0,
    } = data;

    // Check Sale
    const sale = await Prisma.sale.findFirst({
      where: {
        id: saleId,
        tenantId,
      },
    });

    if (!sale) {
      throw new Error('Sale not found');
    }

    // Check Product
    const product = await Prisma.product.findFirst({
      where: {
        id: productId,
        tenantId,
      },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    const saleItem = await Prisma.saleItem.create({
      data: {
        saleId,
        productId,
        quantity,
        rate,
        discount,
        taxRate,
        taxAmount,
        total,
      },
      include: {
        product: true,
        sale: true,
      },
    });

    return saleItem;
  }

  /**
   * Get all Sale Items
   */
  async getAll(tenantId, query = {}) {
    const { page = 1, limit = 20, saleId, productId } = query;

    const skip = (Number(page) - 1) * Number(limit);

    const where = {
      sale: {
        tenantId,
      },
    };

    if (saleId) {
      where.saleId = saleId;
    }

    if (productId) {
      where.productId = productId;
    }

    const [items, total] = await Promise.all([
      Prisma.saleItem.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: {
          id: 'desc',
        },
        include: {
          product: true,
          sale: true,
        },
      }),

      Prisma.saleItem.count({
        where,
      }),
    ]);

    return {
      items,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  }

  /**
   * Get Sale Item By ID
   */
  async getById(tenantId, id) {
    const saleItem = await Prisma.saleItem.findFirst({
      where: {
        id,
        sale: {
          tenantId,
        },
      },
      include: {
        product: true,
        sale: true,
      },
    });

    if (!saleItem) {
      throw new Error('Sale item not found');
    }

    return saleItem;
  }

  /**
   * Get items of a Sale
   */
  async getBySale(tenantId, saleId) {
    const sale = await Prisma.sale.findFirst({
      where: {
        id: saleId,
        tenantId,
      },
    });

    if (!sale) {
      throw new Error('Sale not found');
    }

    return Prisma.saleItem.findMany({
      where: {
        saleId,
        sale: {
          tenantId,
        },
      },
      include: {
        product: true,
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  /**
   * Update Sale Item
   */
  async update(tenantId, id, data) {
    const existingItem = await Prisma.saleItem.findFirst({
      where: {
        id,
        sale: {
          tenantId,
        },
      },
    });

    if (!existingItem) {
      throw new Error('Sale item not found');
    }

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

    return Prisma.saleItem.update({
      where: {
        id,
      },
      data,
      include: {
        product: true,
        sale: true,
      },
    });
  }

  /**
   * Delete Sale Item
   */
  async delete(tenantId, id) {
    const existingItem = await Prisma.saleItem.findFirst({
      where: {
        id,
        sale: {
          tenantId,
        },
      },
    });

    if (!existingItem) {
      throw new Error('Sale item not found');
    }

    await Prisma.saleItem.delete({
      where: {
        id,
      },
    });

    return {
      id,
      message: 'Sale item deleted successfully',
    };
  }
}

export default new SaleItemService();
