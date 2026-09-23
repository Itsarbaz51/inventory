import { z } from 'zod';

const PurchaseValidationSchemas = {
  create: {
    body: z.object({
      supplierId: z.string().uuid(),
      warehouseId: z.string().uuid(),

      purchaseNumber: z
        .string()
        .trim()
        .min(1)
        .max(100),

      purchaseDate: z.coerce.date(),

      expectedDate: z.coerce.date().optional().nullable(),

      subtotal: z.coerce.number().min(0).default(0),

      discount: z.coerce.number().min(0).default(0),

      taxAmount: z.coerce.number().min(0).default(0),

      shippingCost: z.coerce.number().min(0).default(0),

      grandTotal: z.coerce.number().min(0).default(0),

      paidAmount: z.coerce.number().min(0).default(0),

      dueAmount: z.coerce.number().min(0).default(0),

      status: z
        .enum([
          'DRAFT',
          'ORDERED',
          'PARTIALLY_RECEIVED',
          'RECEIVED',
          'CANCELLED',
        ])
        .default('DRAFT'),

      paymentStatus: z
        .enum([
          'UNPAID',
          'PARTIAL',
          'PAID',
        ])
        .default('UNPAID'),

      notes: z
        .string()
        .trim()
        .max(5000)
        .optional()
        .nullable(),
    }),
  },

  update: {
    params: z.object({
      id: z.string().uuid(),
    }),

    body: z
      .object({
        supplierId: z.string().uuid().optional(),

        warehouseId: z.string().uuid().optional(),

        purchaseNumber: z
          .string()
          .trim()
          .min(1)
          .max(100)
          .optional(),

        purchaseDate: z.coerce.date().optional(),

        expectedDate: z.coerce.date().optional().nullable(),

        subtotal: z.coerce.number().min(0).optional(),

        discount: z.coerce.number().min(0).optional(),

        taxAmount: z.coerce.number().min(0).optional(),

        shippingCost: z.coerce.number().min(0).optional(),

        grandTotal: z.coerce.number().min(0).optional(),

        paidAmount: z.coerce.number().min(0).optional(),

        dueAmount: z.coerce.number().min(0).optional(),

        status: z
          .enum([
            'DRAFT',
            'ORDERED',
            'PARTIALLY_RECEIVED',
            'RECEIVED',
            'CANCELLED',
          ])
          .optional(),

        paymentStatus: z
          .enum([
            'UNPAID',
            'PARTIAL',
            'PAID',
          ])
          .optional(),

        notes: z
          .string()
          .trim()
          .max(5000)
          .optional()
          .nullable(),
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
};

export default PurchaseValidationSchemas;