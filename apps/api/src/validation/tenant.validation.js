import { z } from 'zod';

const TenantValidationSchemas = {
  // =====================================================
  // CREATE
  // =====================================================
  create: {
    body: z.object({
      name: z.string().trim().min(2).max(150),

      businessName: z.string().trim().max(150).optional().nullable(),

      email: z.string().trim().email().max(150).optional().nullable(),

      phone: z.string().trim().max(20).optional().nullable(),

      gstNumber: z.string().trim().max(30).optional().nullable(),

      panNumber: z.string().trim().max(20).optional().nullable(),

      businessType: z.string().trim().max(100).optional().nullable(),

      logo: z.string().trim().max(500).optional().nullable(),

      address: z.string().trim().optional().nullable(),

      city: z.string().trim().max(100).optional().nullable(),

      state: z.string().trim().max(100).optional().nullable(),

      pincode: z.string().trim().max(20).optional().nullable(),

      country: z.string().trim().max(100).default('India'),

      invoicePrefix: z.string().trim().min(1).max(20).default('INV'),

      purchasePrefix: z.string().trim().min(1).max(20).default('PUR'),

      salesReturnPrefix: z.string().trim().min(1).max(20).default('SR'),

      purchaseReturnPrefix: z.string().trim().min(1).max(20).default('PR'),

      invoiceStartNumber: z.number().int().min(1).default(1),

      purchaseStartNumber: z.number().int().min(1).default(1),

      salesReturnStartNumber: z.number().int().min(1).default(1),

      purchaseReturnStartNumber: z.number().int().min(1).default(1),

      lowStockThreshold: z.number().int().min(0).default(10),

      status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).default('ACTIVE'),
    }),
  },

  // =====================================================
  // UPDATE
  // =====================================================
  update: {
    params: z.object({
      id: z.string().uuid('Invalid tenant id'),
    }),

    body: z
      .object({
        name: z.string().trim().min(2).max(150).optional(),

        businessName: z.string().trim().max(150).optional().nullable(),

        email: z.string().trim().email().max(150).optional().nullable(),

        phone: z.string().trim().max(20).optional().nullable(),

        gstNumber: z.string().trim().max(30).optional().nullable(),

        panNumber: z.string().trim().max(20).optional().nullable(),

        businessType: z.string().trim().max(100).optional().nullable(),

        logo: z.string().trim().max(500).optional().nullable(),

        address: z.string().trim().optional().nullable(),

        city: z.string().trim().max(100).optional().nullable(),

        state: z.string().trim().max(100).optional().nullable(),

        pincode: z.string().trim().max(20).optional().nullable(),

        country: z.string().trim().max(100).optional(),

        invoicePrefix: z.string().trim().min(1).max(20).optional(),

        purchasePrefix: z.string().trim().min(1).max(20).optional(),

        salesReturnPrefix: z.string().trim().min(1).max(20).optional(),

        purchaseReturnPrefix: z.string().trim().min(1).max(20).optional(),

        invoiceStartNumber: z.number().int().min(1).optional(),

        purchaseStartNumber: z.number().int().min(1).optional(),

        salesReturnStartNumber: z.number().int().min(1).optional(),

        purchaseReturnStartNumber: z.number().int().min(1).optional(),

        lowStockThreshold: z.number().int().min(0).optional(),

        status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).optional(),
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
      id: z.string().uuid('Invalid tenant id'),
    }),
  },

  // =====================================================
  // GET ALL
  // =====================================================
  getAll: {
    query: z.object({
      page: z.coerce.number().int().min(1).default(1),

      limit: z.coerce.number().int().min(1).max(100).default(10),

      search: z.string().trim().max(100).optional(),

      status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).optional(),
    }),
  },

  // =====================================================
  // DELETE
  // =====================================================
  delete: {
    params: z.object({
      id: z.string().uuid('Invalid tenant id'),
    }),
  },
};

export default TenantValidationSchemas;
