import { z } from 'zod';

const purchaseReturnItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.coerce.number().positive(),
  rate: z.coerce.number().nonnegative(),
  total: z.coerce.number().nonnegative().optional(),
});

const PurchaseReturnValidationSchemas = {
  create: {
    body: z.object({
      supplierId: z.string().uuid(),
      purchaseId: z.string().uuid().optional().nullable(),

      returnNumber: z.string().trim().min(1).max(100),

      returnDate: z.coerce.date(),

      totalAmount: z.coerce.number().nonnegative().default(0),

      status: z
        .enum(['DRAFT', 'COMPLETED', 'CANCELLED'])
        .default('DRAFT'),

      reason: z.string().trim().max(2000).optional().nullable(),

      items: z
        .array(purchaseReturnItemSchema)
        .min(1, 'At least one return item is required'),
    }),
  },

  update: {
    params: z.object({
      id: z.string().uuid(),
    }),

    body: z
      .object({
        supplierId: z.string().uuid().optional(),
        purchaseId: z.string().uuid().optional().nullable(),

        returnNumber: z.string().trim().min(1).max(100).optional(),

        returnDate: z.coerce.date().optional(),

        totalAmount: z.coerce.number().nonnegative().optional(),

        status: z
          .enum(['DRAFT', 'COMPLETED', 'CANCELLED'])
          .optional(),

        reason: z.string().trim().max(2000).optional().nullable(),

        items: z
          .array(purchaseReturnItemSchema)
          .min(1, 'At least one return item is required')
          .optional(),
      })
      .refine(
        (data) => Object.keys(data).length > 0,
        {
          message: 'At least one field is required',
        },
      ),
  },

  getById: {
    params: z.object({
      id: z.string().uuid(),
    }),
  },

  delete: {
    params: z.object({
      id: z.string().uuid(),
    }),
  },

  getAll: {
    query: z.object({
      page: z.coerce.number().int().positive().default(1),
      limit: z.coerce.number().int().positive().max(100).default(10),
      search: z.string().trim().optional(),
      status: z
        .enum(['DRAFT', 'COMPLETED', 'CANCELLED'])
        .optional(),
      supplierId: z.string().uuid().optional(),
      purchaseId: z.string().uuid().optional(),
    }),
  },
};

export default PurchaseReturnValidationSchemas;