import { ApiError } from '../utils/ApiError.js';
import Prisma from '../database/db.js';

class WarehouseStockServices {
  // =====================================================
  // CREATE / OPENING STOCK
  // =====================================================
  static async create(payload, req) {
    const tenantId = req.user?.tenantId;

    if (!tenantId) {
      throw new ApiError(401, 'Tenant not found');
    }

    const { warehouseId, productId, quantity = 0, holdQuantity = 0 } = payload;

    // Check warehouse
    const warehouse = await Prisma.warehouse.findFirst({
      where: {
        id: warehouseId,
        tenantId,
      },
    });

    if (!warehouse) {
      throw new ApiError(404, 'Warehouse not found');
    }

    // Check product
    const product = await Prisma.product.findFirst({
      where: {
        id: productId,
        tenantId,
      },
    });

    if (!product) {
      throw new ApiError(404, 'Product not found');
    }

    // Hold quantity cannot be greater than quantity
    if (holdQuantity > quantity) {
      throw new ApiError(
        400,
        'Hold quantity cannot be greater than stock quantity',
      );
    }

    // Check existing stock
    const existingStock = await Prisma.warehouseStock.findUnique({
      where: {
        unique_warehouse_product: {
          warehouseId,
          productId,
        },
      },
    });

    if (existingStock) {
      throw new ApiError(
        409,
        'Stock already exists for this warehouse and product',
      );
    }

    const stock = await Prisma.warehouseStock.create({
      data: {
        tenantId,
        warehouseId,
        productId,
        quantity,
        holdQuantity,
      },

      include: {
        warehouse: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },

        product: {
          select: {
            id: true,
            name: true,
            sku: true,
          },
        },
      },
    });

    return stock;
  }

  // =====================================================
  // GET ALL
  // =====================================================
  static async getAll(req) {
    const tenantId = req.user?.tenantId;

    if (!tenantId) {
      throw new ApiError(401, 'Tenant not found');
    }

    const { warehouseId, productId } = req.query;

    const stocks = await Prisma.warehouseStock.findMany({
      where: {
        tenantId,

        ...(warehouseId && {
          warehouseId,
        }),

        ...(productId && {
          productId,
        }),
      },

      include: {
        warehouse: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },

        product: {
          select: {
            id: true,
            name: true,
            sku: true,
            barcode: true,
          },
        },
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return stocks;
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

    const stock = await Prisma.warehouseStock.findFirst({
      where: {
        id,
        tenantId,
      },

      include: {
        warehouse: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },

        product: {
          select: {
            id: true,
            name: true,
            sku: true,
            barcode: true,
          },
        },
      },
    });

    if (!stock) {
      throw new ApiError(404, 'Warehouse stock not found');
    }

    return stock;
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

    const { quantity, holdQuantity } = req.body;

    const stock = await Prisma.warehouseStock.findFirst({
      where: {
        id,
        tenantId,
      },
    });

    if (!stock) {
      throw new ApiError(404, 'Warehouse stock not found');
    }

    const newQuantity =
      quantity !== undefined ? quantity : Number(stock.quantity);

    const newHoldQuantity =
      holdQuantity !== undefined ? holdQuantity : Number(stock.holdQuantity);

    if (newHoldQuantity > newQuantity) {
      throw new ApiError(
        400,
        'Hold quantity cannot be greater than stock quantity',
      );
    }

    const updatedStock = await Prisma.warehouseStock.update({
      where: {
        id,
      },

      data: {
        ...(quantity !== undefined && {
          quantity,
        }),

        ...(holdQuantity !== undefined && {
          holdQuantity,
        }),
      },

      include: {
        warehouse: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },

        product: {
          select: {
            id: true,
            name: true,
            sku: true,
          },
        },
      },
    });

    return updatedStock;
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

    const stock = await Prisma.warehouseStock.findFirst({
      where: {
        id,
        tenantId,
      },
    });

    if (!stock) {
      throw new ApiError(404, 'Warehouse stock not found');
    }

    // Don't delete stock if quantity exists
    if (Number(stock.quantity) > 0 || Number(stock.holdQuantity) > 0) {
      throw new ApiError(
        400,
        'Cannot delete stock while quantity or hold quantity exists',
      );
    }

    await Prisma.warehouseStock.delete({
      where: {
        id,
      },
    });

    return null;
  }
}

export default WarehouseStockServices;
