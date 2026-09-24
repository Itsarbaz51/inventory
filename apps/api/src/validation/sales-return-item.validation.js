import { z } from 'zod';

const SalesReturnItemValidationSchemas = {
  create: {
    body: z.object({
      salesReturnId: z.string().uuid(),
      productId: z.string().uuid(),

      quantity: z.number().positive('Quantity must be greater than 0'),

      rate: z.number().min(0, 'Rate cannot be negative'),

      total: z.number().min(0, 'Total cannot be negative').optional(),
    }),
  },

  update: {
    params: z.object({
      id: z.string().uuid(),
    }),

    body: z
      .object({
        productId: z.string().uuid().optional(),

        quantity: z
          .number()
          .positive('Quantity must be greater than 0')
          .optional(),

        rate: z.number().min(0, 'Rate cannot be negative').optional(),

        total: z.number().min(0, 'Total cannot be negative').optional(),
      })
      .refine((data) => Object.keys(data).length > 0, {
        message: 'At least one field is required',
      }),
  },

  getById: {
    params: z.object({
      id: z.string().uuid(),
    }),
  },

  getAll: {
    query: z.object({
      salesReturnId: z.string().uuid().optional(),
      productId: z.string().uuid().optional(),
      page: z.coerce.number().int().positive().default(1),
      limit: z.coerce.number().int().positive().max(100).default(10),
      search: z.string().trim().optional(),
    }),
  },

  delete: {
    params: z.object({
      id: z.string().uuid(),
    }),
  },
};

export default SalesReturnItemValidationSchemas;
