import { z } from 'zod';

const BrandValidationSchemas = {
  create: {
    body: z.object({
      name: z
        .string()
        .trim()
        .min(2, 'Brand name must be at least 2 characters')
        .max(150, 'Brand name cannot exceed 150 characters'),

      description: z
        .string()
        .trim()
        .max(500, 'Description cannot exceed 500 characters')
        .optional(),

      isActive: z.boolean().optional().default(true),
    }),
  },

  update: {
    params: z.object({
      id: z.string().uuid('Invalid brand id'),
    }),

    body: z
      .object({
        name: z
          .string()
          .trim()
          .min(2, 'Brand name must be at least 2 characters')
          .max(150, 'Brand name cannot exceed 150 characters')
          .optional(),

        description: z
          .string()
          .trim()
          .max(500, 'Description cannot exceed 500 characters')
          .optional(),

        isActive: z.boolean().optional(),
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
      id: z.string().uuid('Invalid brand id'),
    }),
  },

  delete: {
    params: z.object({
      id: z.string().uuid('Invalid brand id'),
    }),
  },
};

export default BrandValidationSchemas;