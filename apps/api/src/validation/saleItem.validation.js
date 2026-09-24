import { z } from 'zod';

const decimalField = z.coerce.number().finite().min(0);

const uuidField = z.string().uuid();

const SaleItemValidationSchemas = {
  create: {
    body: z.object({
      saleId: uuidField,

      productId: uuidField,

      quantity: decimalField.positive('Quantity must be greater than 0'),

      rate: decimalField,

      discount: decimalField.default(0),

      taxRate: decimalField.max(100, 'Tax rate cannot exceed 100').default(0),

      taxAmount: decimalField.default(0),

      total: decimalField.default(0),
    }),
  },

  update: {
    params: z.object({
      id: uuidField,
    }),

    body: z
      .object({
        productId: uuidField.optional(),

        quantity: decimalField
          .positive('Quantity must be greater than 0')
          .optional(),

        rate: decimalField.optional(),

        discount: decimalField.optional(),

        taxRate: decimalField.max(100, 'Tax rate cannot exceed 100').optional(),

        taxAmount: decimalField.optional(),

        total: decimalField.optional(),
      })
      .refine((data) => Object.keys(data).length > 0, {
        message: 'At least one field is required',
      }),
  },

  getById: {
    params: z.object({
      id: uuidField,
    }),
  },

  delete: {
    params: z.object({
      id: uuidField,
    }),
  },

  getBySale: {
    params: z.object({
      saleId: uuidField,
    }),
  },
};

export default SaleItemValidationSchemas;
