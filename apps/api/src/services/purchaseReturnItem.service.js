import { ApiError } from '../utils/ApiError.js';
import Prisma from '../database/db.js';

class PurchaseReturnItemServices {
  // =====================================================
  // CREATE
  // =====================================================

  static async create(payload, req) {
    const tenantId = req.user?.tenantId;

    if (!tenantId) {
      throw new ApiError(401, 'Tenant not found');
    }

    const {
      purchaseReturnId,
      productId,
      quantity,
      rate,
      total,
    } = payload;

    // Check Purchase Return
    const purchaseReturn =
      await Prisma.purchaseReturn.findFirst({
        where: {
          id: purchaseReturnId,
          tenantId,
        },
      });

    if (!purchaseReturn) {
      throw new ApiError(
        404,
        'Purchase return not found',
      );
    }

    // Don't allow item modification after completed return
    if (purchaseReturn.status === 'COMPLETED') {
      throw new ApiError(
        400,
        'Cannot add item to completed purchase return',
      );
    }

    // Check Product
    const product = await Prisma.product.findFirst({
      where: {
        id: productId,
        tenantId,
      },
    });

    if (!product) {
      throw new ApiError(
        404,
        'Product not found',
      );
    }

    const calculatedTotal =
      total ?? Number(quantity) * Number(rate);

    const item =
      await Prisma.purchaseReturnItem.create({
        data: {
          purchaseReturnId,
          productId,
          quantity,
          rate,
          total: calculatedTotal,
        },

        include: {
          product: {
            select: {
              id: true,
              name: true,
              sku: true,
              barcode: true,
            },
          },

          purchaseReturn: {
            select: {
              id: true,
              returnNumber: true,
              status: true,
            },
          },
        },
      });

    return item;
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

    const {
      productId,
      quantity,
      rate,
      total,
    } = req.body;

    const item =
      await Prisma.purchaseReturnItem.findFirst({
        where: {
          id,
          purchaseReturn: {
            tenantId,
          },
        },

        include: {
          purchaseReturn: true,
        },
      });

    if (!item) {
      throw new ApiError(
        404,
        'Purchase return item not found',
      );
    }

    if (
      item.purchaseReturn.status ===
      'COMPLETED'
    ) {
      throw new ApiError(
        400,
        'Completed purchase return cannot be modified',
      );
    }

    // Product validation
    if (productId) {
      const product =
        await Prisma.product.findFirst({
          where: {
            id: productId,
            tenantId,
          },
        });

      if (!product) {
        throw new ApiError(
          404,
          'Product not found',
        );
      }
    }

    // Calculate total if quantity/rate changed
    let finalTotal = total;

    if (
      finalTotal === undefined &&
      (quantity !== undefined ||
        rate !== undefined)
    ) {
      finalTotal =
        Number(quantity ?? item.quantity) *
        Number(rate ?? item.rate);
    }

    const updatedItem =
      await Prisma.purchaseReturnItem.update({
        where: {
          id,
        },

        data: {
          ...(productId !== undefined && {
            productId,
          }),

          ...(quantity !== undefined && {
            quantity,
          }),

          ...(rate !== undefined && {
            rate,
          }),

          ...(finalTotal !== undefined && {
            total: finalTotal,
          }),
        },

        include: {
          product: {
            select: {
              id: true,
              name: true,
              sku: true,
              barcode: true,
            },
          },

          purchaseReturn: {
            select: {
              id: true,
              returnNumber: true,
              status: true,
            },
          },
        },
      });

    return updatedItem;
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

    const item =
      await Prisma.purchaseReturnItem.findFirst({
        where: {
          id,

          purchaseReturn: {
            tenantId,
          },
        },

        include: {
          product: {
            select: {
              id: true,
              name: true,
              sku: true,
              barcode: true,
              purchasePrice: true,
              sellingPrice: true,
            },
          },

          purchaseReturn: {
            select: {
              id: true,
              returnNumber: true,
              returnDate: true,
              status: true,
              supplier: {
                select: {
                  id: true,
                  name: true,
                  companyName: true,
                },
              },
            },
          },
        },
      });

    if (!item) {
      throw new ApiError(
        404,
        'Purchase return item not found',
      );
    }

    return item;
  }

  // =====================================================
  // GET ALL
  // =====================================================

  static async getAll(payload, req) {
    const tenantId = req.user?.tenantId;

    if (!tenantId) {
      throw new ApiError(401, 'Tenant not found');
    }

    const {
      page = 1,
      limit = 10,
      purchaseReturnId,
      productId,
    } = payload;

    const skip = (page - 1) * limit;

    const where = {
      purchaseReturn: {
        tenantId,
      },

      ...(purchaseReturnId && {
        purchaseReturnId,
      }),

      ...(productId && {
        productId,
      }),
    };

    const [items, total] =
      await Prisma.$transaction([
        Prisma.purchaseReturnItem.findMany({
          where,

          skip,
          take: limit,

          orderBy: {
            id: 'desc',
          },

          include: {
            product: {
              select: {
                id: true,
                name: true,
                sku: true,
                barcode: true,
              },
            },

            purchaseReturn: {
              select: {
                id: true,
                returnNumber: true,
                returnDate: true,
                status: true,

                supplier: {
                  select: {
                    id: true,
                    name: true,
                    companyName: true,
                  },
                },
              },
            },
          },
        }),

        Prisma.purchaseReturnItem.count({
          where,
        }),
      ]);

    return {
      data: items,

      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(
          total / limit,
        ),
      },
    };
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

    const item =
      await Prisma.purchaseReturnItem.findFirst({
        where: {
          id,

          purchaseReturn: {
            tenantId,
          },
        },

        include: {
          purchaseReturn: true,
        },
      });

    if (!item) {
      throw new ApiError(
        404,
        'Purchase return item not found',
      );
    }

    if (
      item.purchaseReturn.status ===
      'COMPLETED'
    ) {
      throw new ApiError(
        400,
        'Completed purchase return item cannot be deleted',
      );
    }

    await Prisma.purchaseReturnItem.delete({
      where: {
        id,
      },
    });

    return null;
  }
}

export default PurchaseReturnItemServices;