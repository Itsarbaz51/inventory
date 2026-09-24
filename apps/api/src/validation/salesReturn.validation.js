import { z } from 'zod';

const uuid = z.string().uuid();

const SalesReturnValidationSchemas = {
  create: {
    body: z.object({
      customerId: uuid.optional(),

      saleId: uuid.optional(),

      returnNumber: z.string().trim().min(1).max(100),

      returnDate: z.coerce.date(),

      totalAmount: z.coerce.number().finite().min(0).default(0),

      status: z.enum(['DRAFT', 'COMPLETED', 'CANCELLED']).default('DRAFT'),

      reason: z.string().trim().max(5000).optional(),
    }),
  },

  update: {
    params: z.object({
      id: uuid,
    }),

    body: z
      .object({
        customerId: uuid.optional(),

        saleId: uuid.optional(),

        returnNumber: z.string().trim().min(1).max(100).optional(),

        returnDate: z.coerce.date().optional(),

        totalAmount: z.coerce.number().finite().min(0).optional(),

        status: z.enum(['DRAFT', 'COMPLETED', 'CANCELLED']).optional(),

        reason: z.string().trim().max(5000).optional(),
      })
      .refine((data) => Object.keys(data).length > 0, {
        message: 'At least one field is required',
      }),
  },

  getById: {
    params: z.object({
      id: uuid,
    }),
  },

  delete: {
    params: z.object({
      id: uuid,
    }),
  },

  getAll: {
    query: z.object({
      page: z.coerce.number().int().min(1).default(1),

      limit: z.coerce.number().int().min(1).max(100).default(20),

      status: z.enum(['DRAFT', 'COMPLETED', 'CANCELLED']).optional(),

      customerId: uuid.optional(),

      saleId: uuid.optional(),
    }),
  },
};

export default SalesReturnValidationSchemas;
