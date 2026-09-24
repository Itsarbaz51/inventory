import Prisma from '../database/db.js';

class StockMovementService {
  // =====================================================
  // CREATE
  // =====================================================

  async create(data, tenantId, userId) {
    const {
      productId,
      warehouseId,
      movementType,
      referenceType,
      referenceId,
      quantity,
      beforeQuantity,
      afterQuantity,
      reason,
    } = data;

    // -----------------------------------------
    // Check Product
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
    // Check Warehouse
    // -----------------------------------------

    const warehouse = await prisma.warehouse.findFirst({
      where: {
        id: warehouseId,
        tenantId,
      },
    });

    if (!warehouse) {
      throw new Error('Warehouse not found');
    }

    // -----------------------------------------
    // Create movement
    // -----------------------------------------

    const movement = await prisma.stockMovement.create({
      data: {
        tenantId,
        productId,
        warehouseId,
        createdById: userId,

        movementType,
        referenceType,
        referenceId,

        quantity,
        beforeQuantity,
        afterQuantity,

        reason,
      },

      include: {
        product: true,
        warehouse: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return movement;
  }

  // =====================================================
  // GET BY ID
  // =====================================================

  async getById(id, tenantId) {
    const movement = await prisma.stockMovement.findFirst({
      where: {
        id,
        tenantId,
      },

      include: {
        product: true,

        warehouse: true,

        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!movement) {
      throw new Error('Stock movement not found');
    }

    return movement;
  }

  // =====================================================
  // GET ALL
  // =====================================================

  async getAll(query, tenantId) {
    const {
      productId,
      warehouseId,
      movementType,
      referenceType,
      referenceId,
      page = 1,
      limit = 10,
    } = query;

    const skip = (page - 1) * limit;

    const where = {
      tenantId,
    };

    if (productId) {
      where.productId = productId;
    }

    if (warehouseId) {
      where.warehouseId = warehouseId;
    }

    if (movementType) {
      where.movementType = movementType;
    }

    if (referenceType) {
      where.referenceType = referenceType;
    }

    if (referenceId) {
      where.referenceId = referenceId;
    }

    const [movements, total] = await prisma.$transaction([
      prisma.stockMovement.findMany({
        where,

        skip,
        take: limit,

        orderBy: {
          createdAt: 'desc',
        },

        include: {
          product: true,

          warehouse: true,

          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),

      prisma.stockMovement.count({
        where,
      }),
    ]);

    return {
      movements,

      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // =====================================================
  // DELETE
  // =====================================================

  async delete(id, tenantId) {
    const movement = await prisma.stockMovement.findFirst({
      where: {
        id,
        tenantId,
      },
    });

    if (!movement) {
      throw new Error('Stock movement not found');
    }

    await prisma.stockMovement.delete({
      where: {
        id,
      },
    });

    return {
      id,
      message: 'Stock movement deleted successfully',
    };
  }
}

export default new StockMovementService();
