import { z } from 'zod';

const RoleValidationSchemas = {
  // ==========================================
  // CREATE ROLE
  // ==========================================
  create: {
    body: z.object({
      name: z
        .string()
        .trim()
        .min(2, 'Role name must be at least 2 characters')
        .max(100, 'Role name must not exceed 100 characters'),

      description: z
        .string()
        .trim()
        .max(500, 'Description must not exceed 500 characters')
        .optional()
        .nullable(),

      isSystem: z.boolean().default(false),
    }),
  },

  // ==========================================
  // UPDATE ROLE
  // ==========================================
  update: {
    params: z.object({
      id: z.string().uuid('Invalid role id'),
    }),

    body: z.object({
      name: z
        .string()
        .trim()
        .min(2, 'Role name must be at least 2 characters')
        .max(100, 'Role name must not exceed 100 characters')
        .optional(),

      description: z
        .string()
        .trim()
        .max(500, 'Description must not exceed 500 characters')
        .optional()
        .nullable(),
    }),
  },

  // ==========================================
  // DELETE ROLE
  // ==========================================
  delete: {
    params: z.object({
      id: z.string().uuid('Invalid role id'),
    }),
  },
};

export default RoleValidationSchemas;
