
import { z } from 'zod';

const CategoryValidationSchemas = {
  // =====================================================
  // CREATE
  // =====================================================
  create: {
    body: z.object({
      name: z
        .string()
        .trim()
        .min(2, 'Category name must be at least 2 characters')
        .max(150, 'Category name cannot exceed 150 characters'),

      description: z
        .string()
        .trim()
        .max(1000, 'Description cannot exceed 1000 characters')
        .optional()
        .nullable(),

      parentId: z
        .string()
        .uuid('Invalid parent category ID')
        .optional()
        .nullable(),

      isActive: z
        .boolean()
        .optional()
        .default(true),
    }),
  },

  // =====================================================
  // UPDATE
  // =====================================================
  update: {
    params: z.object({
      id: z.string().uuid('Invalid category ID'),
    }),

    body: z
      .object({
        name: z
          .string()
          .trim()
          .min(2, 'Category name must be at least 2 characters')
          .max(150, 'Category name cannot exceed 150 characters')
          .optional(),

        description: z
          .string()
          .trim()
          .max(1000, 'Description cannot exceed 1000 characters')
          .optional()
          .nullable(),

        parentId: z
          .string()
          .uuid('Invalid parent category ID')
          .optional()
          .nullable(),

        isActive: z.boolean().optional(),
      })
      .refine(
        (data) => Object.keys(data).length > 0,
        {
          message: 'At least one field is required',
        },
      ),
  },

  // =====================================================
  // GET BY ID
  // =====================================================
  getById: {
    params: z.object({
      id: z.string().uuid('Invalid category ID'),
    }),
  },

  // =====================================================
  // DELETE
  // =====================================================
  delete: {
    params: z.object({
      id: z.string().uuid('Invalid category ID'),
    }),
  },
};

export default CategoryValidationSchemas;

