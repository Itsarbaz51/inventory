import Prisma from '../database/db.js';

class PaymentService {
  // =====================================================
  // CREATE
  // =====================================================

  async create(data, tenantId, userId) {
    const {
      customerId,
      supplierId,
      saleId,
      purchaseId,
      amount,
      method,
      type,
      referenceNumber,
      paymentDate,
      notes,
    } = data;

    // ===================================================
    // RECEIPT VALIDATION
    // ===================================================

    if (type === 'RECEIPT') {
      if (customerId) {
        const customer = await Prisma.customer.findFirst({
          where: {
            id: customerId,
            tenantId,
          },
        });

        if (!customer) {
          throw new Error('Customer not found');
        }
      }

      if (saleId) {
        const sale = await Prisma.sale.findFirst({
          where: {
            id: saleId,
            tenantId,
          },
        });

        if (!sale) {
          throw new Error('Sale not found');
        }

        // If sale has customer, ensure same customer
        if (sale.customerId && customerId && sale.customerId !== customerId) {
          throw new Error('Payment customer does not match sale customer');
        }
      }
    }

    // ===================================================
    // PAYMENT VALIDATION
    // ===================================================

    if (type === 'PAYMENT') {
      if (supplierId) {
        const supplier = await Prisma.supplier.findFirst({
          where: {
            id: supplierId,
            tenantId,
          },
        });

        if (!supplier) {
          throw new Error('Supplier not found');
        }
      }

      if (purchaseId) {
        const purchase = await Prisma.purchase.findFirst({
          where: {
            id: purchaseId,
            tenantId,
          },
        });

        if (!purchase) {
          throw new Error('Purchase not found');
        }

        // Ensure same supplier
        if (supplierId && purchase.supplierId !== supplierId) {
          throw new Error('Payment supplier does not match purchase supplier');
        }
      }
    }

    // ===================================================
    // CREATE PAYMENT
    // ===================================================

    const payment = await Prisma.payment.create({
      data: {
        tenantId,

        customerId: customerId || null,
        supplierId: supplierId || null,

        saleId: saleId || null,
        purchaseId: purchaseId || null,

        createdById: userId,

        amount,
        method,
        type,

        referenceNumber: referenceNumber || null,

        paymentDate,
        notes: notes || null,
      },

      include: {
        customer: true,

        supplier: true,

        sale: {
          select: {
            id: true,
            invoiceNumber: true,
            grandTotal: true,
            paidAmount: true,
            dueAmount: true,
          },
        },

        purchase: {
          select: {
            id: true,
            purchaseNumber: true,
            grandTotal: true,
            paidAmount: true,
            dueAmount: true,
          },
        },

        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return payment;
  }

  // =====================================================
  // GET BY ID
  // =====================================================

  async getById(id, tenantId) {
    const payment = await Prisma.payment.findFirst({
      where: {
        id,
        tenantId,
      },

      include: {
        customer: true,

        supplier: true,

        sale: {
          select: {
            id: true,
            invoiceNumber: true,
            saleDate: true,
            grandTotal: true,
            paidAmount: true,
            dueAmount: true,
          },
        },

        purchase: {
          select: {
            id: true,
            purchaseNumber: true,
            purchaseDate: true,
            grandTotal: true,
            paidAmount: true,
            dueAmount: true,
          },
        },

        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!payment) {
      throw new Error('Payment not found');
    }

    return payment;
  }

  // =====================================================
  // GET ALL
  // =====================================================

  async getAll(query, tenantId) {
    const {
      customerId,
      supplierId,
      saleId,
      purchaseId,
      type,
      method,
      fromDate,
      toDate,
      page = 1,
      limit = 10,
    } = query;

    const skip = (Number(page) - 1) * Number(limit);

    const where = {
      tenantId,
    };

    if (customerId) {
      where.customerId = customerId;
    }

    if (supplierId) {
      where.supplierId = supplierId;
    }

    if (saleId) {
      where.saleId = saleId;
    }

    if (purchaseId) {
      where.purchaseId = purchaseId;
    }

    if (type) {
      where.type = type;
    }

    if (method) {
      where.method = method;
    }

    // ===================================================
    // DATE FILTER
    // ===================================================

    if (fromDate || toDate) {
      where.paymentDate = {};

      if (fromDate) {
        where.paymentDate.gte = fromDate;
      }

      if (toDate) {
        const endDate = new Date(toDate);

        endDate.setHours(23, 59, 59, 999);

        where.paymentDate.lte = endDate;
      }
    }

    // ===================================================
    // FETCH
    // ===================================================

    const [payments, total] = await Prisma.$transaction([
      Prisma.payment.findMany({
        where,

        skip,
        take: Number(limit),

        orderBy: {
          paymentDate: 'desc',
        },

        include: {
          customer: {
            select: {
              id: true,
              name: true,
              phone: true,
            },
          },

          supplier: {
            select: {
              id: true,
              name: true,
              companyName: true,
              phone: true,
            },
          },

          sale: {
            select: {
              id: true,
              invoiceNumber: true,
            },
          },

          purchase: {
            select: {
              id: true,
              purchaseNumber: true,
            },
          },

          createdBy: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),

      Prisma.payment.count({
        where,
      }),
    ]);

    return {
      payments,

      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // =====================================================
  // REPORT SUMMARY
  // =====================================================

  async getReport(query, tenantId) {
    const { fromDate, toDate } = query;
    const dateRange = {};

    if (fromDate) dateRange.gte = fromDate;
    if (toDate) {
      const endDate = new Date(toDate);
      endDate.setHours(23, 59, 59, 999);
      dateRange.lte = endDate;
    }

    const hasDateRange = Object.keys(dateRange).length > 0;
    const salesWhere = { tenantId, ...(hasDateRange ? { saleDate: dateRange } : {}) };
    const purchasesWhere = { tenantId, ...(hasDateRange ? { purchaseDate: dateRange } : {}) };
    const paymentsWhere = { tenantId, ...(hasDateRange ? { paymentDate: dateRange } : {}) };
    const returnsWhere = { tenantId, ...(hasDateRange ? { returnDate: dateRange } : {}) };

    const [sales, purchases, payments, salesReturns, purchaseReturns] =
      await Promise.all([
        Prisma.sale.aggregate({
          where: salesWhere,
          _count: { _all: true },
          _sum: { grandTotal: true, paidAmount: true, dueAmount: true },
        }),
        Prisma.purchase.aggregate({
          where: purchasesWhere,
          _count: { _all: true },
          _sum: { grandTotal: true, paidAmount: true, dueAmount: true },
        }),
        Prisma.payment.aggregate({
          where: paymentsWhere,
          _count: { _all: true },
          _sum: { amount: true },
        }),
        Prisma.salesReturn.aggregate({
          where: returnsWhere,
          _count: { _all: true },
          _sum: { totalAmount: true },
        }),
        Prisma.purchaseReturn.aggregate({
          where: returnsWhere,
          _count: { _all: true },
          _sum: { totalAmount: true },
        }),
      ]);

    const number = (value) => Number(value || 0);

    return {
      period: {
        fromDate: fromDate || null,
        toDate: toDate || null,
      },
      sales: {
        count: sales._count._all,
        total: number(sales._sum.grandTotal),
        paid: number(sales._sum.paidAmount),
        due: number(sales._sum.dueAmount),
      },
      purchases: {
        count: purchases._count._all,
        total: number(purchases._sum.grandTotal),
        paid: number(purchases._sum.paidAmount),
        due: number(purchases._sum.dueAmount),
      },
      payments: {
        count: payments._count._all,
        total: number(payments._sum.amount),
      },
      returns: {
        salesCount: salesReturns._count._all,
        salesTotal: number(salesReturns._sum.totalAmount),
        purchasesCount: purchaseReturns._count._all,
        purchasesTotal: number(purchaseReturns._sum.totalAmount),
      },
    };
  }

  // =====================================================
  // DELETE
  // =====================================================

  async delete(id, tenantId) {
    const payment = await Prisma.payment.findFirst({
      where: {
        id,
        tenantId,
      },
    });

    if (!payment) {
      throw new Error('Payment not found');
    }

    await Prisma.payment.delete({
      where: {
        id,
      },
    });

    return {
      id,
      message: 'Payment deleted successfully',
    };
  }
}

export default new PaymentService();
