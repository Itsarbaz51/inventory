import { z } from 'zod';

const SupplierValidationSchemas = {
  // =====================================================
  // CREATE
  // =====================================================
  create: {
    body: z.object({
      name: z
        .string()
        .trim()
        .min(2, 'Supplier name must be at least 2 characters')
        .max(150),

      companyName: z.string().trim().max(150).optional().nullable(),

      phone: z.string().trim().max(20).optional().nullable(),

      email: z
        .string()
        .trim()
        .email('Invalid email address')
        .max(150)
        .optional()
        .nullable(),

      gstNumber: z.string().trim().max(30).optional().nullable(),

      panNumber: z.string().trim().max(20).optional().nullable(),

      address: z.string().trim().max(5000).optional().nullable(),

      city: z.string().trim().max(100).optional().nullable(),

      state: z.string().trim().max(100).optional().nullable(),

      pincode: z.string().trim().max(20).optional().nullable(),

      openingBalance: z.coerce
        .number()
        .finite()
        .min(0, 'Opening balance cannot be negative')
        .default(0),

      creditLimit: z.coerce
        .number()
        .finite()
        .min(0, 'Credit limit cannot be negative')
        .optional()
        .nullable(),

      paymentTerms: z.coerce
        .number()
        .int()
        .min(0, 'Payment terms cannot be negative')
        .optional()
        .nullable(),

      isActive: z.boolean().default(true),
    }),
  },

  // =====================================================
  // UPDATE
  // =====================================================
  update: {
    params: z.object({
      id: z.string().uuid('Invalid supplier ID'),
    }),

    body: z
      .object({
        name: z.string().trim().min(2).max(150).optional(),

        companyName: z.string().trim().max(150).optional().nullable(),

        phone: z.string().trim().max(20).optional().nullable(),

        email: z
          .string()
          .trim()
          .email('Invalid email address')
          .max(150)
          .optional()
          .nullable(),

        gstNumber: z.string().trim().max(30).optional().nullable(),

        panNumber: z.string().trim().max(20).optional().nullable(),

        address: z.string().trim().max(5000).optional().nullable(),

        city: z.string().trim().max(100).optional().nullable(),

        state: z.string().trim().max(100).optional().nullable(),

        pincode: z.string().trim().max(20).optional().nullable(),

        openingBalance: z.coerce.number().finite().min(0).optional(),

        creditLimit: z.coerce.number().finite().min(0).optional().nullable(),

        paymentTerms: z.coerce.number().int().min(0).optional().nullable(),

        isActive: z.boolean().optional(),
      })
      .refine((data) => Object.keys(data).length > 0, {
        message: 'At least one field is required',
      }),
  },

  // =====================================================
  // GET BY ID
  // =====================================================
  getById: {
    params: z.object({
      id: z.string().uuid('Invalid supplier ID'),
    }),
  },

  // =====================================================
  // DELETE
  // =====================================================
  delete: {
    params: z.object({
      id: z.string().uuid('Invalid supplier ID'),
    }),
  },
};

export default SupplierValidationSchemas;
