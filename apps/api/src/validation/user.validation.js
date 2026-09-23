import { z } from 'zod';

const UserValidationSchemas = {
  // CREATE USER

  create: {
    body: z.object({
      name: z
        .string()
        .trim()
        .min(2, 'Name must be at least 2 characters')
        .max(150, 'Name cannot exceed 150 characters'),

      email: z
        .string()
        .trim()
        .email('Invalid email address')
        .max(150, 'Email cannot exceed 150 characters'),

      phone: z
        .string()
        .trim()
        .max(20, 'Phone cannot exceed 20 characters')
        .optional()
        .nullable(),

      password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .max(100, 'Password cannot exceed 100 characters'),

      roleId: z.string().uuid('Invalid role id').optional().nullable(),

      status: z.enum(['ACTIVE', 'INACTIVE', 'BLOCKED']).default('ACTIVE'),
    }),
  },

  // UPDATE USER

  update: {
    params: z.object({
      id: z.string().uuid('Invalid user id'),
    }),

    body: z
      .object({
        name: z.string().trim().min(2).max(150).optional(),

        email: z
          .string()
          .trim()
          .email('Invalid email address')
          .max(150)
          .optional(),

        phone: z.string().trim().max(20).optional().nullable(),

        password: z.string().min(8).max(100).optional(),

        roleId: z.string().uuid('Invalid role id').optional().nullable(),

        status: z.enum(['ACTIVE', 'INACTIVE', 'BLOCKED']).optional(),
      })
      .refine((data) => Object.keys(data).length > 0, {
        message: 'At least one field is required',
      }),
  },

  // GET BY ID

  getById: {
    params: z.object({
      id: z.string().uuid('Invalid user id'),
    }),
  },

  // DELETE

  delete: {
    params: z.object({
      id: z.string().uuid('Invalid user id'),
    }),
  },

  // GET ALL

  getAll: {
    query: z.object({
      page: z.coerce.number().int().min(1).default(1),

      limit: z.coerce.number().int().min(1).max(100).default(10),

      search: z.string().trim().max(100).optional(),

      status: z.enum(['ACTIVE', 'INACTIVE', 'BLOCKED']).optional(),

      roleId: z.string().uuid().optional(),
    }),
  },
};

export default UserValidationSchemas;
