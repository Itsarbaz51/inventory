import { z } from 'zod';

const SaleValidationSchemas = {
  create: {
    body: z.object({
      customerId: z
        .string()
        .uuid('Invalid customer id')
        .optional()
        .nullable(),

      warehouseId: z
        .string()
        .uuid('Invalid warehouse id'),

      invoiceNumber: z
        .string()
        .trim()
        .min(1, 'Invoice number is required')
        .max(100),

      saleDate: z
        .coerce
        .date(),

      subtotal: z
        .coerce
        .number()
        .min(0)
        .default(0),

      discount: z
        .coerce
        .number()
        .min(0)
        .default(0),

      taxAmount: z
        .coerce
        .number()
        .min(0)
        .default(0),

      shippingCost: z
        .coerce
        .number()
        .min(0)
        .default(0),

      grandTotal: z
        .coerce
        .number()
        .min(0)
        .default(0),

      paidAmount: z
        .coerce
        .number()
        .min(0)
        .default(0),

      dueAmount: z
        .coerce
        .number()
        .min(0)
        .default(0),

      status: z
        .enum([
          'DRAFT',
          'CONFIRMED',
          'COMPLETED',
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
        .optional()
        .nullable(),
    }),
  },

  update: {
    params: z.object({
      id: z.string().uuid('Invalid sale id'),
    }),

    body: z
      .object({
        customerId: z
          .string()
          .uuid('Invalid customer id')
          .optional()
          .nullable(),

        warehouseId: z
          .string()
          .uuid('Invalid warehouse id')
          .optional(),

        invoiceNumber: z
          .string()
          .trim()
          .min(1)
          .max(100)
          .optional(),

        saleDate: z
          .coerce
          .date()
          .optional(),

        subtotal: z
          .coerce
          .number()
          .min(0)
          .optional(),

        discount: z
          .coerce
          .number()
          .min(0)
          .optional(),

        taxAmount: z
          .coerce
          .number()
          .min(0)
          .optional(),

        shippingCost: z
          .coerce
          .number()
          .min(0)
          .optional(),

        grandTotal: z
          .coerce
          .number()
          .min(0)
          .optional(),

        paidAmount: z
          .coerce
          .number()
          .min(0)
          .optional(),

        dueAmount: z
          .coerce
          .number()
          .min(0)
          .optional(),

        status: z
          .enum([
            'DRAFT',
            'CONFIRMED',
            'COMPLETED',
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
          .optional()
          .nullable(),
      })
      .refine(
        (data) => Object.keys(data).length > 0,
        {
          message: 'At least one field is required',
        }
      ),
  },

  getById: {
    params: z.object({
      id: z.string().uuid('Invalid sale id'),
    }),
  },

  delete: {
    params: z.object({
      id: z.string().uuid('Invalid sale id'),
    }),
  },
};

export default SaleValidationSchemas;