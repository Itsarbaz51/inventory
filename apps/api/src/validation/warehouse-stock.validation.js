import { z } from 'zod';

const decimalNumber = z.coerce
  .number()
  .finite()
  .min(0, 'Value cannot be negative');

const WarehouseStockValidationSchemas = {
  create: {
    body: z.object({
      warehouseId: z.string().uuid('Invalid warehouse ID'),
      productId: z.string().uuid('Invalid product ID'),

      quantity: decimalNumber.default(0),

      holdQuantity: decimalNumber.default(0),
    }),
  },

  update: {
    params: z.object({
      id: z.string().uuid('Invalid warehouse stock ID'),
    }),

    body: z
      .object({
        quantity: decimalNumber.optional(),

        holdQuantity: decimalNumber.optional(),
      })
      .refine(
        (data) =>
          data.quantity !== undefined || data.holdQuantity !== undefined,
        {
          message: 'At least one field is required',
        },
      ),
  },

  getById: {
    params: z.object({
      id: z.string().uuid('Invalid warehouse stock ID'),
    }),
  },

  delete: {
    params: z.object({
      id: z.string().uuid('Invalid warehouse stock ID'),
    }),
  },
};

export default WarehouseStockValidationSchemas;
