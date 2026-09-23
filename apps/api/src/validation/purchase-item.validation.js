import { z } from 'zod';

const PurchaseItemValidationSchemas = {
  create: {
    body: z.object({
      purchaseId: z.string().uuid(),

      productId: z.string().uuid(),

      quantity: z.coerce
        .number()
        .positive('Quantity must be greater than 0'),

      receivedQuantity: z.coerce
        .number()
        .min(0, 'Received quantity cannot be negative')
        .default(0),

      rate: z.coerce
        .number()
        .min(0, 'Rate cannot be negative'),

      discount: z.coerce
        .number()
        .min(0, 'Discount cannot be negative')
        .default(0),

      taxRate: z.coerce
        .number()
        .min(0)
        .max(100)
        .default(0),

      taxAmount: z.coerce
        .number()
        .min(0)
        .default(0),

      total: z.coerce
        .number()
        .min(0)
        .default(0),
    }),
  },

  update: {
    params: z.object({
      id: z.string().uuid(),
    }),

    body: z
      .object({
        productId: z.string().uuid().optional(),

        quantity: z.coerce
          .number()
          .positive()
          .optional(),

        receivedQuantity: z.coerce
          .number()
          .min(0)
          .optional(),

        rate: z.coerce
          .number()
          .min(0)
          .optional(),

        discount: z.coerce
          .number()
          .min(0)
          .optional(),

        taxRate: z.coerce
          .number()
          .min(0)
          .max(100)
          .optional(),

        taxAmount: z.coerce
          .number()
          .min(0)
          .optional(),

        total: z.coerce
          .number()
          .min(0)
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
};

export default PurchaseItemValidationSchemas;