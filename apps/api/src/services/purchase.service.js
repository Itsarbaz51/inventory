import { ApiError } from '../utils/ApiError.js';
import Prisma from '../database/db.js';

class PurchaseServices {
  // =====================================================
  // CREATE
  // =====================================================

  static async create(payload, req) {
    const tenantId = req.user?.tenantId;
    const userId = req.user?.id;

    if (!tenantId) {
      throw new ApiError(401, 'Tenant not found');
    }

    if (!userId) {
      throw new ApiError(401, 'User not found');
    }

    const {
      supplierId,
      warehouseId,
      purchaseNumber,
      purchaseDate,
      expectedDate,
      subtotal = 0,
      discount = 0,
      taxAmount = 0,
      shippingCost = 0,
      grandTotal = 0,
      paidAmount = 0,
      dueAmount = 0,
      status = 'DRAFT',
      paymentStatus = 'UNPAID',
      notes,
    } = payload;

    // -------------------------------------------------
    // Check supplier belongs to same tenant
    // -------------------------------------------------

    const supplier = await Prisma.supplier.findFirst({
      where: {
        id: supplierId,
        tenantId,
      },
    });

    if (!supplier) {
      throw new ApiError(
        404,
        'Supplier not found in this tenant',
      );
    }

    // -------------------------------------------------
    // Check warehouse belongs to same tenant
    // -------------------------------------------------

    const warehouse = await Prisma.warehouse.findFirst({
      where: {
        id: warehouseId,
        tenantId,
      },
    });

    if (!warehouse) {
      throw new ApiError(
        404,
        'Warehouse not found in this tenant',
      );
    }

    // -------------------------------------------------
    // Check purchase number
    // -------------------------------------------------

    const existingPurchase =
      await Prisma.purchase.findFirst({
        where: {
          tenantId,
          purchaseNumber: purchaseNumber.trim(),
        },
      });

    if (existingPurchase) {
      throw new ApiError(
        409,
        `Purchase number "${purchaseNumber}" already exists`,
      );
    }

    // -------------------------------------------------
    // Create purchase
    // -------------------------------------------------

    const purchase = await Prisma.purchase.create({
      data: {
        tenantId,

        supplierId,

        warehouseId,

        createdById: userId,

        purchaseNumber: purchaseNumber.trim(),

        purchaseDate,

        expectedDate: expectedDate || null,

        subtotal,

        discount,

        taxAmount,

        shippingCost,

        grandTotal,

        paidAmount,

        dueAmount,

        status,

        paymentStatus,

        notes: notes?.trim() || null,
      },

      include: {
        supplier: true,

        warehouse: true,

        createdBy: {
          select: {
            id: true,
            userNumber: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return purchase;
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
      throw new ApiError(400, 'Purchase id is required');
    }

    const {
      supplierId,
      warehouseId,
      purchaseNumber,
      purchaseDate,
      expectedDate,
      subtotal,
      discount,
      taxAmount,
      shippingCost,
      grandTotal,
      paidAmount,
      dueAmount,
      status,
      paymentStatus,
      notes,
    } = req.body;

    // -------------------------------------------------
    // Find purchase
    // -------------------------------------------------

    const purchase =
      await Prisma.purchase.findFirst({
        where: {
          id,
          tenantId,
        },
      });

    if (!purchase) {
      throw new ApiError(404, 'Purchase not found');
    }

    // -------------------------------------------------
    // Supplier validation
    // -------------------------------------------------

    if (supplierId !== undefined) {
      const supplier =
        await Prisma.supplier.findFirst({
          where: {
            id: supplierId,
            tenantId,
          },
        });

      if (!supplier) {
        throw new ApiError(
          404,
          'Supplier not found in this tenant',
        );
      }
    }

    // -------------------------------------------------
    // Warehouse validation
    // -------------------------------------------------

    if (warehouseId !== undefined) {
      const warehouse =
        await Prisma.warehouse.findFirst({
          where: {
            id: warehouseId,
            tenantId,
          },
        });

      if (!warehouse) {
        throw new ApiError(
          404,
          'Warehouse not found in this tenant',
        );
      }
    }

    // -------------------------------------------------
    // Duplicate purchase number
    // -------------------------------------------------

    if (purchaseNumber !== undefined) {
      const duplicatePurchase =
        await Prisma.purchase.findFirst({
          where: {
            tenantId,
            purchaseNumber: purchaseNumber.trim(),

            NOT: {
              id,
            },
          },
        });

      if (duplicatePurchase) {
        throw new ApiError(
          409,
          `Purchase number "${purchaseNumber}" already exists`,
        );
      }
    }

    // -------------------------------------------------
    // Update
    // -------------------------------------------------

    const updatedPurchase =
      await Prisma.purchase.update({
        where: {
          id,
        },

        data: {
          ...(supplierId !== undefined && {
            supplierId,
          }),

          ...(warehouseId !== undefined && {
            warehouseId,
          }),

          ...(purchaseNumber !== undefined && {
            purchaseNumber: purchaseNumber.trim(),
          }),

          ...(purchaseDate !== undefined && {
            purchaseDate,
          }),

          ...(expectedDate !== undefined && {
            expectedDate,
          }),

          ...(subtotal !== undefined && {
            subtotal,
          }),

          ...(discount !== undefined && {
            discount,
          }),

          ...(taxAmount !== undefined && {
            taxAmount,
          }),

          ...(shippingCost !== undefined && {
            shippingCost,
          }),

          ...(grandTotal !== undefined && {
            grandTotal,
          }),

          ...(paidAmount !== undefined && {
            paidAmount,
          }),

          ...(dueAmount !== undefined && {
            dueAmount,
          }),

          ...(status !== undefined && {
            status,
          }),

          ...(paymentStatus !== undefined && {
            paymentStatus,
          }),

          ...(notes !== undefined && {
            notes: notes?.trim() || null,
          }),
        },

        include: {
          supplier: true,

          warehouse: true,

          createdBy: {
            select: {
              id: true,
              userNumber: true,
              name: true,
              email: true,
            },
          },
        },
      });

    return updatedPurchase;
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
      throw new ApiError(400, 'Purchase id is required');
    }

    const purchase =
      await Prisma.purchase.findFirst({
        where: {
          id,
          tenantId,
        },

        include: {
          supplier: true,

          warehouse: true,

          createdBy: {
            select: {
              id: true,
              userNumber: true,
              name: true,
              email: true,
            },
          },

          items: {
            include: {
              product: true,
            },
          },

          payments: true,

          returns: true,
        },
      });

    if (!purchase) {
      throw new ApiError(
        404,
        'Purchase not found',
      );
    }

    return purchase;
  }

  // =====================================================
  // GET ALL
  // =====================================================

  static async getAll(payload, req) {
    const tenantId = req.user?.tenantId;

    if (!tenantId) {
      throw new ApiError(401, 'Tenant not found');
    }

    const purchases =
      await Prisma.purchase.findMany({
        where: {
          tenantId,
        },

        include: {
          supplier: {
            select: {
              id: true,
              name: true,
              companyName: true,
              phone: true,
            },
          },

          warehouse: {
            select: {
              id: true,
              name: true,
              code: true,
            },
          },

          createdBy: {
            select: {
              id: true,
              userNumber: true,
              name: true,
            },
          },

          _count: {
            select: {
              items: true,
              payments: true,
              returns: true,
            },
          },
        },

        orderBy: {
          createdAt: 'desc',
        },
      });

    return purchases;
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
      throw new ApiError(400, 'Purchase id is required');
    }

    const purchase =
      await Prisma.purchase.findFirst({
        where: {
          id,
          tenantId,
        },

        include: {
          _count: {
            select: {
              items: true,
              payments: true,
              returns: true,
            },
          },
        },
      });

    if (!purchase) {
      throw new ApiError(
        404,
        'Purchase not found',
      );
    }

    // -----------------------------------------------
    // Don't delete purchase if it has transactions
    // -----------------------------------------------

    if (purchase._count.items > 0) {
      throw new ApiError(
        400,
        'Cannot delete purchase because items are already added',
      );
    }

    if (purchase._count.payments > 0) {
      throw new ApiError(
        400,
        'Cannot delete purchase because payments are already recorded',
      );
    }

    if (purchase._count.returns > 0) {
      throw new ApiError(
        400,
        'Cannot delete purchase because returns are already recorded',
      );
    }

    await Prisma.purchase.delete({
      where: {
        id,
      },
    });

    return null;
  }
}

export default PurchaseServices;