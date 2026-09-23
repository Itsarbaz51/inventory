import { z } from 'zod';

const WarehouseValidationSchemas = {
  create: {
    body: z.object({
      name: z
        .string()
        .trim()
        .min(2, 'Warehouse name must be at least 2 characters')
        .max(150, 'Warehouse name cannot exceed 150 characters'),

      code: z
        .string()
        .trim()
        .min(2, 'Warehouse code must be at least 2 characters')
        .max(50, 'Warehouse code cannot exceed 50 characters')
        .regex(
          /^[A-Za-z0-9_-]+$/,
          'Warehouse code can only contain letters, numbers, underscore and hyphen',
        ),

      address: z
        .string()
        .trim()
        .max(1000, 'Address cannot exceed 1000 characters')
        .optional()
        .nullable(),

      city: z
        .string()
        .trim()
        .max(100, 'City cannot exceed 100 characters')
        .optional()
        .nullable(),

      state: z
        .string()
        .trim()
        .max(100, 'State cannot exceed 100 characters')
        .optional()
        .nullable(),

      pincode: z
        .string()
        .trim()
        .max(20, 'Pincode cannot exceed 20 characters')
        .optional()
        .nullable(),

      managerName: z
        .string()
        .trim()
        .max(150, 'Manager name cannot exceed 150 characters')
        .optional()
        .nullable(),

      phone: z
        .string()
        .trim()
        .max(20, 'Phone cannot exceed 20 characters')
        .optional()
        .nullable(),

      isActive: z.boolean().default(true),
    }),
  },

  update: {
    params: z.object({
      id: z.string().uuid('Invalid warehouse ID'),
    }),

    body: z
      .object({
        name: z
          .string()
          .trim()
          .min(2, 'Warehouse name must be at least 2 characters')
          .max(150, 'Warehouse name cannot exceed 150 characters')
          .optional(),

        code: z
          .string()
          .trim()
          .min(2, 'Warehouse code must be at least 2 characters')
          .max(50, 'Warehouse code cannot exceed 50 characters')
          .regex(
            /^[A-Za-z0-9_-]+$/,
            'Warehouse code can only contain letters, numbers, underscore and hyphen',
          )
          .optional(),

        address: z
          .string()
          .trim()
          .max(1000, 'Address cannot exceed 1000 characters')
          .optional()
          .nullable(),

        city: z
          .string()
          .trim()
          .max(100, 'City cannot exceed 100 characters')
          .optional()
          .nullable(),

        state: z
          .string()
          .trim()
          .max(100, 'State cannot exceed 100 characters')
          .optional()
          .nullable(),

        pincode: z
          .string()
          .trim()
          .max(20, 'Pincode cannot exceed 20 characters')
          .optional()
          .nullable(),

        managerName: z
          .string()
          .trim()
          .max(150, 'Manager name cannot exceed 150 characters')
          .optional()
          .nullable(),

        phone: z
          .string()
          .trim()
          .max(20, 'Phone cannot exceed 20 characters')
          .optional()
          .nullable(),

        isActive: z.boolean().optional(),
      })
      .refine(
        (data) => Object.keys(data).length > 0,
        'At least one field is required',
      ),
  },

  getById: {
    params: z.object({
      id: z.string().uuid('Invalid warehouse ID'),
    }),
  },

  delete: {
    params: z.object({
      id: z.string().uuid('Invalid warehouse ID'),
    }),
  },

  getAll: {
    query: z.object({
      search: z.string().trim().optional(),

      isActive: z
        .string()
        .optional()
        .transform((value) => {
          if (value === undefined) return undefined;
          return value === 'true';
        }),

      page: z
        .string()
        .optional()
        .transform((value) => {
          if (!value) return 1;

          const parsed = Number(value);

          return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
        }),

      limit: z
        .string()
        .optional()
        .transform((value) => {
          if (!value) return 20;

          const parsed = Number(value);

          return Number.isInteger(parsed) && parsed > 0 && parsed <= 100
            ? parsed
            : 20;
        }),
    }),
  },
};

export default WarehouseValidationSchemas;
