import { z } from 'zod';

const ProductValidationSchemas = {
  // =====================================================
  // CREATE PRODUCT
  // =====================================================
  create: {
    body: z.object({
      name: z
        .string()
        .trim()
        .min(2, 'Product name must be at least 2 characters')
        .max(200, 'Product name cannot exceed 200 characters'),

      sku: z
        .string()
        .trim()
        .min(1, 'SKU is required')
        .max(100, 'SKU cannot exceed 100 characters'),

      barcode: z
        .string()
        .trim()
        .max(100, 'Barcode cannot exceed 100 characters')
        .optional()
        .nullable(),

      categoryId: z.string().uuid('Invalid category ID').optional().nullable(),

      brandId: z.string().uuid('Invalid brand ID').optional().nullable(),

      unitId: z.string().uuid('Invalid unit ID'),

      hsnCode: z
        .string()
        .trim()
        .max(50, 'HSN code cannot exceed 50 characters')
        .optional()
        .nullable(),

      purchasePrice: z.coerce
        .number()
        .min(0, 'Purchase price cannot be negative')
        .default(0),

      sellingPrice: z.coerce
        .number()
        .min(0, 'Selling price cannot be negative')
        .default(0),

      mrp: z.coerce
        .number()
        .min(0, 'MRP cannot be negative')
        .optional()
        .nullable(),

      taxRate: z.coerce
        .number()
        .min(0, 'Tax rate cannot be negative')
        .max(100, 'Tax rate cannot exceed 100')
        .default(0),

      minStock: z.coerce
        .number()
        .min(0, 'Minimum stock cannot be negative')
        .default(0),

      maxStock: z.coerce
        .number()
        .min(0, 'Maximum stock cannot be negative')
        .optional()
        .nullable(),

      image: z
        .string()
        .trim()
        .max(500, 'Image URL cannot exceed 500 characters')
        .optional()
        .nullable(),

      description: z
        .string()
        .trim()
        .max(5000, 'Description cannot exceed 5000 characters')
        .optional()
        .nullable(),

      isActive: z.boolean().default(true),
    }),
  },

  // =====================================================
  // UPDATE PRODUCT
  // =====================================================
  update: {
    params: z.object({
      id: z.string().uuid('Invalid product ID'),
    }),

    body: z
      .object({
        name: z
          .string()
          .trim()
          .min(2, 'Product name must be at least 2 characters')
          .max(200)
          .optional(),

        sku: z
          .string()
          .trim()
          .min(1, 'SKU cannot be empty')
          .max(100)
          .optional(),

        barcode: z.string().trim().max(100).optional().nullable(),

        categoryId: z
          .string()
          .uuid('Invalid category ID')
          .optional()
          .nullable(),

        brandId: z.string().uuid('Invalid brand ID').optional().nullable(),

        unitId: z.string().uuid('Invalid unit ID').optional(),

        hsnCode: z.string().trim().max(50).optional().nullable(),

        purchasePrice: z.coerce.number().min(0).optional(),

        sellingPrice: z.coerce.number().min(0).optional(),

        mrp: z.coerce.number().min(0).optional().nullable(),

        taxRate: z.coerce.number().min(0).max(100).optional(),

        minStock: z.coerce.number().min(0).optional(),

        maxStock: z.coerce.number().min(0).optional().nullable(),

        image: z.string().trim().max(500).optional().nullable(),

        description: z.string().trim().max(5000).optional().nullable(),

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
      id: z.string().uuid('Invalid product ID'),
    }),
  },

  // =====================================================
  // DELETE
  // =====================================================
  delete: {
    params: z.object({
      id: z.string().uuid('Invalid product ID'),
    }),
  },

  // =====================================================
  // GET ALL
  // =====================================================
  getAll: {
    query: z.object({
      page: z.coerce.number().int().min(1).default(1),

      limit: z.coerce.number().int().min(1).max(100).default(20),

      search: z.string().trim().optional(),

      categoryId: z.string().uuid().optional(),

      brandId: z.string().uuid().optional(),

      unitId: z.string().uuid().optional(),

      isActive: z.enum(['true', 'false']).optional(),
    }),
  },
};

export default ProductValidationSchemas;
