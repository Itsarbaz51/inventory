import { z } from 'zod';

const UnitValidationSchemas = {
  // =====================================================
  // CREATE
  // =====================================================

  create: {
    body: z.object({
      name: z
        .string()
        .trim()
        .min(2, 'Unit name must be at least 2 characters')
        .max(100, 'Unit name cannot exceed 100 characters'),

      shortName: z
        .string()
        .trim()
        .min(1, 'Short name is required')
        .max(20, 'Short name cannot exceed 20 characters'),

      isActive: z.boolean().optional().default(true),
    }),
  },

  // =====================================================
  // UPDATE
  // =====================================================

  update: {
    params: z.object({
      id: z.string().uuid('Invalid unit id'),
    }),

    body: z
      .object({
        name: z
          .string()
          .trim()
          .min(2, 'Unit name must be at least 2 characters')
          .max(100, 'Unit name cannot exceed 100 characters')
          .optional(),

        shortName: z
          .string()
          .trim()
          .min(1, 'Short name is required')
          .max(20, 'Short name cannot exceed 20 characters')
          .optional(),

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
      id: z.string().uuid('Invalid unit id'),
    }),
  },

  // =====================================================
  // DELETE
  // =====================================================

  delete: {
    params: z.object({
      id: z.string().uuid('Invalid unit id'),
    }),
  },
};

export default UnitValidationSchemas;
