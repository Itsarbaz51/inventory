import Prisma from "../database/db.js";

class SalesReturnService {
  /**
   * CREATE SALES RETURN
   */
  async create(tenantId, createdById, data) {
    const {
      customerId,
      saleId,
      returnNumber,
      returnDate,
      totalAmount = 0,
      status = 'DRAFT',
      reason,
    } = data;

    // Check duplicate return number
    const existingReturn = await Prisma.salesReturn.findFirst({
      where: {
        tenantId,
        returnNumber,
      },
    });

    if (existingReturn) {
      throw new Error('Sales return number already exists');
    }

    // Check customer
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

    // Check sale
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
    }

    // Check user
    const user = await Prisma.user.findFirst({
      where: {
        id: createdById,
        tenantId,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const salesReturn = await Prisma.salesReturn.create({
      data: {
        tenantId,
        customerId: customerId || null,
        saleId: saleId || null,
        createdById,
        returnNumber,
        returnDate,
        totalAmount,
        status,
        reason: reason || null,
      },

      include: {
        customer: true,
        sale: true,
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
      },
    });

    return salesReturn;
  }

  /**
   * GET ALL
   */
  async getAll(tenantId, query = {}) {
    const { page = 1, limit = 20, status, customerId, saleId } = query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    const skip = (pageNumber - 1) * limitNumber;

    const where = {
      tenantId,
    };

    if (status) {
      where.status = status;
    }

    if (customerId) {
      where.customerId = customerId;
    }

    if (saleId) {
      where.saleId = saleId;
    }

    const [returns, total] = await Promise.all([
      Prisma.salesReturn.findMany({
        where,

        skip,
        take: limitNumber,

        orderBy: {
          createdAt: 'desc',
        },

        include: {
          customer: true,

          sale: true,

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
        },
      }),

      Prisma.salesReturn.count({
        where,
      }),
    ]);

    return {
      data: returns,

      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        totalPages: Math.ceil(total / limitNumber),
      },
    };
  }

  /**
   * GET BY ID
   */
  async getById(tenantId, id) {
    const salesReturn = await Prisma.salesReturn.findFirst({
      where: {
        id,
        tenantId,
      },

      include: {
        customer: true,

        sale: true,

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
      },
    });

    if (!salesReturn) {
      throw new Error('Sales return not found');
    }

    return salesReturn;
  }

  /**
   * UPDATE
   */
  async update(tenantId, id, data) {
    const existingReturn = await Prisma.salesReturn.findFirst({
      where: {
        id,
        tenantId,
      },
    });

    if (!existingReturn) {
      throw new Error('Sales return not found');
    }

    // Customer validation
    if (data.customerId) {
      const customer = await Prisma.customer.findFirst({
        where: {
          id: data.customerId,
          tenantId,
        },
      });

      if (!customer) {
        throw new Error('Customer not found');
      }
    }

    // Sale validation
    if (data.saleId) {
      const sale = await Prisma.sale.findFirst({
        where: {
          id: data.saleId,
          tenantId,
        },
      });

      if (!sale) {
        throw new Error('Sale not found');
      }
    }

    // Check duplicate return number
    if (
      data.returnNumber &&
      data.returnNumber !== existingReturn.returnNumber
    ) {
      const duplicate = await Prisma.salesReturn.findFirst({
        where: {
          tenantId,
          returnNumber: data.returnNumber,
          NOT: {
            id,
          },
        },
      });

      if (duplicate) {
        throw new Error('Sales return number already exists');
      }
    }

    return Prisma.salesReturn.update({
      where: {
        id,
      },

      data,

      include: {
        customer: true,
        sale: true,

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
      },
    });
  }

  /**
   * DELETE
   */
  async delete(tenantId, id) {
    const existingReturn = await Prisma.salesReturn.findFirst({
      where: {
        id,
        tenantId,
      },

      include: {
        items: true,
      },
    });

    if (!existingReturn) {
      throw new Error('Sales return not found');
    }

    // Prevent deleting completed return
    if (existingReturn.status === 'COMPLETED') {
      throw new Error('Completed sales return cannot be deleted');
    }

    // Delete items first
    await Prisma.$transaction(async (tx) => {
      await tx.salesReturnItem.deleteMany({
        where: {
          salesReturnId: id,
        },
      });

      await tx.salesReturn.delete({
        where: {
          id,
        },
      });
    });

    return {
      id,
      message: 'Sales return deleted successfully',
    };
  }
}

export default new SalesReturnService();
