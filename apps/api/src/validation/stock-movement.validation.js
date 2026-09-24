import { z } from 'zod';

const StockMovementValidationSchemas = {
  // =====================================================
  // CREATE
  // =====================================================

  create: {
    body: z.object({
      productId: z.string().uuid(),
      warehouseId: z.string().uuid(),
      movementType: z.enum([
        'OPENING_STOCK',
        'PURCHASE',
        'SALE',
        'PURCHASE_RETURN',
        'SALES_RETURN',
        'TRANSFER_IN',
        'TRANSFER_OUT',
        'ADJUSTMENT_IN',
        'ADJUSTMENT_OUT',
      ]),
      referenceType: z.enum([
        'OPENING',
        'PURCHASE',
        'SALE',
        'PURCHASE_RETURN',
        'SALES_RETURN',
        'TRANSFER',
        'ADJUSTMENT',
      ]),
      referenceId: z.string().uuid().optional(),

      quantity: z.number().positive('Quantity must be greater than 0'),

      beforeQuantity: z.number().min(0, 'Before quantity cannot be negative'),

      afterQuantity: z.number().min(0, 'After quantity cannot be negative'),

      reason: z.string().trim().max(1000).optional(),
    }),
  },

  // =====================================================
  // GET BY ID
  // =====================================================

  getById: {
    params: z.object({
      id: z.string().uuid(),
    }),
  },

  // =====================================================
  // GET ALL
  // =====================================================

  getAll: {
    query: z.object({
      productId: z.string().uuid().optional(),

      warehouseId: z.string().uuid().optional(),

      movementType: z
        .enum([
          'OPENING_STOCK',
          'PURCHASE',
          'SALE',
          'PURCHASE_RETURN',
          'SALES_RETURN',
          'TRANSFER_IN',
          'TRANSFER_OUT',
          'ADJUSTMENT_IN',
          'ADJUSTMENT_OUT',
        ])
        .optional(),

      referenceType: z
        .enum([
          'OPENING',
          'PURCHASE',
          'SALE',
          'PURCHASE_RETURN',
          'SALES_RETURN',
          'TRANSFER',
          'ADJUSTMENT',
        ])
        .optional(),

      referenceId: z.string().uuid().optional(),

      page: z.coerce.number().int().positive().default(1),

      limit: z.coerce.number().int().positive().max(100).default(10),
    }),
  },

  // =====================================================
  // DELETE
  // =====================================================

  delete: {
    params: z.object({
      id: z.string().uuid(),
    }),
  },
};

export default StockMovementValidationSchemas;
