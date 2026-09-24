import { ApiError } from '../utils/ApiError.js';
import Prisma from '../database/db.js';

class PurchaseItemServices {
  // =====================================================
  // CREATE
  // =====================================================

  static async create(payload, req) {
    const tenantId = req.user?.tenantId;

    if (!tenantId) {
      throw new ApiError(401, 'Tenant not found');
    }

    const {
      purchaseId,
      productId,
      quantity,
      receivedQuantity = 0,
      rate,
      discount = 0,
      taxRate = 0,
      taxAmount = 0,
      total = 0,
    } = payload;

    // -------------------------------------------------
    // Check Purchase
    // -------------------------------------------------

    const purchase = await Prisma.purchase.findFirst({
      where: {
        id: purchaseId,
        tenantId,
      },
    });

    if (!purchase) {
      throw new ApiError(
        404,
        'Purchase not found in this tenant',
      );
    }

    // -------------------------------------------------
    // Check Product
    // -------------------------------------------------

    const product = await Prisma.product.findFirst({
      where: {
        id: productId,
        tenantId,
      },
    });

    if (!product) {
      throw new ApiError(
        404,
        'Product not found in this tenant',
      );
    }

    // -------------------------------------------------
    // Received quantity validation
    // -------------------------------------------------

    if (receivedQuantity > quantity) {
      throw new ApiError(
        400,
        'Received quantity cannot be greater than purchase quantity',
      );
    }

    // -------------------------------------------------
    // Check duplicate product in same purchase
    // -------------------------------------------------

    const existingItem =
      await Prisma.purchaseItem.findFirst({
        where: {
          purchaseId,
          productId,
        },
      });

    if (existingItem) {
      throw new ApiError(
        409,
        'This product is already added to this purchase',
      );
    }

    // -------------------------------------------------
    // Create item
    // -------------------------------------------------

    const item = await Prisma.purchaseItem.create({
      data: {
        purchaseId,

        productId,

        quantity,

        receivedQuantity,

        rate,

        discount,

        taxRate,

        taxAmount,

        total,
      },

      include: {
        product: true,

        purchase: {
          select: {
            id: true,
            purchaseNumber: true,
            tenantId: true,
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

    if (!id) {
      throw new ApiError(
        400,
        'Purchase item id is required',
      );
    }

    const {
      productId,
      quantity,
      receivedQuantity,
      rate,
      discount,
      taxRate,
      taxAmount,
      total,
    } = req.body;

    // -------------------------------------------------
    // Find item through purchase tenant
    // -------------------------------------------------

    const item = await Prisma.purchaseItem.findFirst({
      where: {
        id,

        purchase: {
          tenantId,
        },
      },

      include: {
        purchase: true,
      },
    });

    if (!item) {
      throw new ApiError(
        404,
        'Purchase item not found',
      );
    }

    // -------------------------------------------------
    // Product validation
    // -------------------------------------------------

    if (productId !== undefined) {
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
          'Product not found in this tenant',
        );
      }

      const duplicate =
        await Prisma.purchaseItem.findFirst({
          where: {
            purchaseId: item.purchaseId,
            productId,

            NOT: {
              id,
            },
          },
        });

      if (duplicate) {
        throw new ApiError(
          409,
          'This product is already added to this purchase',
        );
      }
    }

    // -------------------------------------------------
    // Quantity validation
    // -------------------------------------------------

    const finalQuantity =
      quantity !== undefined
        ? quantity
        : Number(item.quantity);

    const finalReceivedQuantity =
      receivedQuantity !== undefined
        ? receivedQuantity
        : Number(item.receivedQuantity);

    if (finalReceivedQuantity > finalQuantity) {
      throw new ApiError(
        400,
        'Received quantity cannot be greater than purchase quantity',
      );
    }

    // -------------------------------------------------
    // Update
    // -------------------------------------------------

    const updatedItem =
      await Prisma.purchaseItem.update({
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

          ...(receivedQuantity !== undefined && {
            receivedQuantity,
          }),

          ...(rate !== undefined && {
            rate,
          }),

          ...(discount !== undefined && {
            discount,
          }),

          ...(taxRate !== undefined && {
            taxRate,
          }),

          ...(taxAmount !== undefined && {
            taxAmount,
          }),

          ...(total !== undefined && {
            total,
          }),
        },

        include: {
          product: true,

          purchase: {
            select: {
              id: true,
              purchaseNumber: true,
              tenantId: true,
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

    if (!id) {
      throw new ApiError(
        400,
        'Purchase item id is required',
      );
    }

    const item =
      await Prisma.purchaseItem.findFirst({
        where: {
          id,

          purchase: {
            tenantId,
          },
        },

        include: {
          product: true,

          purchase: {
            include: {
              supplier: true,

              warehouse: true,
            },
          },
        },
      });

    if (!item) {
      throw new ApiError(
        404,
        'Purchase item not found',
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

    const items =
      await Prisma.purchaseItem.findMany({
        where: {
          purchase: {
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
            },
          },

          purchase: {
            select: {
              id: true,
              purchaseNumber: true,
              purchaseDate: true,
              status: true,
              paymentStatus: true,

              supplier: {
                select: {
                  id: true,
                  name: true,
                  companyName: true,
                },
              },

              warehouse: {
                select: {
                  id: true,
                  name: true,
                  code: true,
                },
              },
            },
          },
        },

        orderBy: {
          purchase: {
            createdAt: 'desc',
          },
        },
      });

    return items;
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
      throw new ApiError(
        400,
        'Purchase item id is required',
      );
    }

    const item =
      await Prisma.purchaseItem.findFirst({
        where: {
          id,

          purchase: {
            tenantId,
          },
        },

        include: {
          purchase: true,
        },
      });

    if (!item) {
      throw new ApiError(
        404,
        'Purchase item not found',
      );
    }

    // -------------------------------------------------
    // Don't delete received item
    // -------------------------------------------------

    if (Number(item.receivedQuantity) > 0) {
      throw new ApiError(
        400,
        'Cannot delete purchase item because stock has already been received',
      );
    }

    await Prisma.purchaseItem.delete({
      where: {
        id,
      },
    });

    return null;
  }
}

export default PurchaseItemServices;