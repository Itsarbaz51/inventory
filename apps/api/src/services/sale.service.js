import { ApiError } from '../utils/ApiError.js';
import Prisma from '../database/db.js';

class SaleServices {
  // CREATE
  static async create(payload, req) {
    const tenantId = req.user?.tenantId;
    const createdById = req.user?.id;

    if (!tenantId) {
      throw new ApiError(401, 'Tenant not found');
    }

    if (!createdById) {
      throw new ApiError(401, 'User not found');
    }

    const {
      customerId,
      warehouseId,
      invoiceNumber,
      saleDate,
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

    if (!invoiceNumber?.trim()) {
      throw new ApiError(400, 'Invoice number is required');
    }

    // Check duplicate invoice inside tenant
    const existingInvoice = await Prisma.sale.findFirst({
      where: {
        tenantId,
        invoiceNumber: invoiceNumber.trim(),
      },
    });

    if (existingInvoice) {
      throw new ApiError(409, `Invoice "${invoiceNumber}" already exists`);
    }

    // Validate warehouse belongs to tenant
    const warehouse = await Prisma.warehouse.findFirst({
      where: {
        id: warehouseId,
        tenantId,
        isActive: true,
      },
    });

    if (!warehouse) {
      throw new ApiError(404, 'Warehouse not found');
    }

    // Validate customer belongs to tenant
    if (customerId) {
      const customer = await Prisma.customer.findFirst({
        where: {
          id: customerId,
          tenantId,
          isActive: true,
        },
      });

      if (!customer) {
        throw new ApiError(404, 'Customer not found');
      }
    }

    // Validate user belongs to tenant
    const user = await Prisma.user.findFirst({
      where: {
        id: createdById,
        tenantId,
      },
    });

    if (!user) {
      throw new ApiError(404, 'Created by user not found');
    }

    if (paidAmount > grandTotal) {
      throw new ApiError(400, 'Paid amount cannot be greater than grand total');
    }

    const calculatedDueAmount = grandTotal - paidAmount;

    const sale = await Prisma.sale.create({
      data: {
        tenantId,

        customerId: customerId || null,

        warehouseId,

        createdById,

        invoiceNumber: invoiceNumber.trim(),

        saleDate,

        subtotal,
        discount,
        taxAmount,
        shippingCost,
        grandTotal,
        paidAmount,

        dueAmount: calculatedDueAmount,

        status,
        paymentStatus,

        notes: notes?.trim() || null,
      },

      include: {
        customer: true,
        warehouse: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: true,
      },
    });

    return sale;
  }

  // UPDATE
  static async update(params, req) {
    const tenantId = req.user?.tenantId;

    if (!tenantId) {
      throw new ApiError(401, 'Tenant not found');
    }

    const { id } = params;

    if (!id) {
      throw new ApiError(400, 'Sale id is required');
    }

    const sale = await Prisma.sale.findFirst({
      where: {
        id,
        tenantId,
      },
    });

    if (!sale) {
      throw new ApiError(404, 'Sale not found');
    }

    const {
      customerId,
      warehouseId,
      invoiceNumber,
      saleDate,
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

    // Invoice duplicate check
    if (invoiceNumber !== undefined) {
      const duplicateInvoice = await Prisma.sale.findFirst({
        where: {
          tenantId,
          invoiceNumber: invoiceNumber.trim(),
          NOT: {
            id,
          },
        },
      });

      if (duplicateInvoice) {
        throw new ApiError(409, `Invoice "${invoiceNumber}" already exists`);
      }
    }

    // Validate warehouse
    if (warehouseId !== undefined) {
      const warehouse = await Prisma.warehouse.findFirst({
        where: {
          id: warehouseId,
          tenantId,
          isActive: true,
        },
      });

      if (!warehouse) {
        throw new ApiError(404, 'Warehouse not found');
      }
    }

    // Validate customer
    if (customerId !== undefined && customerId !== null) {
      const customer = await Prisma.customer.findFirst({
        where: {
          id: customerId,
          tenantId,
          isActive: true,
        },
      });

      if (!customer) {
        throw new ApiError(404, 'Customer not found');
      }
    }

    const finalGrandTotal =
      grandTotal !== undefined ? grandTotal : Number(sale.grandTotal);

    const finalPaidAmount =
      paidAmount !== undefined ? paidAmount : Number(sale.paidAmount);

    if (finalPaidAmount > finalGrandTotal) {
      throw new ApiError(400, 'Paid amount cannot be greater than grand total');
    }

    const finalDueAmount =
      dueAmount !== undefined ? dueAmount : finalGrandTotal - finalPaidAmount;

    const updatedSale = await Prisma.sale.update({
      where: {
        id,
      },

      data: {
        ...(customerId !== undefined && {
          customerId: customerId || null,
        }),

        ...(warehouseId !== undefined && {
          warehouseId,
        }),

        ...(invoiceNumber !== undefined && {
          invoiceNumber: invoiceNumber.trim(),
        }),

        ...(saleDate !== undefined && {
          saleDate,
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

        dueAmount: finalDueAmount,

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
        customer: true,
        warehouse: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: true,
      },
    });

    return updatedSale;
  }

  // GET BY ID
  static async getById(params, req) {
    const tenantId = req.user?.tenantId;

    if (!tenantId) {
      throw new ApiError(401, 'Tenant not found');
    }

    const { id } = params;

    if (!id) {
      throw new ApiError(400, 'Sale id is required');
    }

    const sale = await Prisma.sale.findFirst({
      where: {
        id,
        tenantId,
      },

      include: {
        customer: true,

        warehouse: true,

        createdBy: {
          select: {
            id: true,
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

        _count: {
          select: {
            items: true,
            payments: true,
            returns: true,
          },
        },
      },
    });

    if (!sale) {
      throw new ApiError(404, 'Sale not found');
    }

    return sale;
  }

  // GET ALL
  static async getAll(req) {
    const tenantId = req.user?.tenantId;

    if (!tenantId) {
      throw new ApiError(401, 'Tenant not found');
    }

    const sales = await Prisma.sale.findMany({
      where: {
        tenantId,
      },

      include: {
        customer: {
          select: {
            id: true,
            name: true,
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
        saleDate: 'desc',
      },
    });

    return sales;
  }

  // DELETE
  static async delete(params, req) {
    const tenantId = req.user?.tenantId;

    if (!tenantId) {
      throw new ApiError(401, 'Tenant not found');
    }

    const { id } = params;

    if (!id) {
      throw new ApiError(400, 'Sale id is required');
    }

    const sale = await Prisma.sale.findFirst({
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

    if (!sale) {
      throw new ApiError(404, 'Sale not found');
    }

    // Don't delete completed/confirmed sale
    if (sale.status === 'CONFIRMED' || sale.status === 'COMPLETED') {
      throw new ApiError(400, 'Confirmed or completed sale cannot be deleted');
    }

    // Don't delete sale with related records
    if (
      sale._count.items > 0 ||
      sale._count.payments > 0 ||
      sale._count.returns > 0
    ) {
      throw new ApiError(
        400,
        'Cannot delete sale because related records exist',
      );
    }

    await Prisma.sale.delete({
      where: {
        id,
      },
    });

    return null;
  }
}

export default SaleServices;
