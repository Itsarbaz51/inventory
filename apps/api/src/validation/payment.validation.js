import { z } from 'zod';

const PaymentValidationSchemas = {
  // =====================================================
  // CREATE
  // =====================================================

  create: {
    body: z
      .object({
        customerId: z.string().uuid().optional(),
        supplierId: z.string().uuid().optional(),

        saleId: z.string().uuid().optional(),
        purchaseId: z.string().uuid().optional(),

        amount: z.number().positive('Payment amount must be greater than 0'),

        method: z.enum([
          'CASH',
          'BANK',
          'UPI',
          'CARD',
          'CHEQUE',
          'ONLINE',
          'OTHER',
        ]),

        type: z.enum(['RECEIPT', 'PAYMENT']),

        referenceNumber: z.string().trim().max(150).optional(),

        paymentDate: z.coerce.date(),

        notes: z.string().trim().max(2000).optional(),
      })
      .superRefine((data, ctx) => {
        // -------------------------------------------------
        // RECEIPT
        // -------------------------------------------------

        if (data.type === 'RECEIPT') {
          if (!data.customerId && !data.saleId) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ['customerId'],
              message: 'Customer or sale is required for receipt payment',
            });
          }

          if (data.supplierId || data.purchaseId) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ['type'],
              message: 'Receipt payment cannot be linked to supplier/purchase',
            });
          }
        }

        // -------------------------------------------------
        // PAYMENT
        // -------------------------------------------------

        if (data.type === 'PAYMENT') {
          if (!data.supplierId && !data.purchaseId) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ['supplierId'],
              message: 'Supplier or purchase is required for payment',
            });
          }

          if (data.customerId || data.saleId) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ['type'],
              message: 'Supplier payment cannot be linked to customer/sale',
            });
          }
        }
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
      customerId: z.string().uuid().optional(),

      supplierId: z.string().uuid().optional(),

      saleId: z.string().uuid().optional(),

      purchaseId: z.string().uuid().optional(),

      type: z.enum(['RECEIPT', 'PAYMENT']).optional(),

      method: z
        .enum(['CASH', 'BANK', 'UPI', 'CARD', 'CHEQUE', 'ONLINE', 'OTHER'])
        .optional(),

      fromDate: z.coerce.date().optional(),

      toDate: z.coerce.date().optional(),

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

export default PaymentValidationSchemas;
