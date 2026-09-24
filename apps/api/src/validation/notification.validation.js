import { z } from 'zod';

const NotificationValidationSchemas = {
  // =====================================================
  // CREATE
  // =====================================================

  create: {
    body: z.object({
      userId: z.string().uuid().optional(),

      type: z.string().min(1).max(100),

      title: z.string().trim().min(1, 'Title is required').max(200),

      message: z.string().trim().min(1, 'Message is required').max(5000),

      referenceId: z.string().uuid().optional(),
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
      userId: z.string().uuid().optional(),

      type: z.string().max(100).optional(),

      isRead: z
        .enum(['true', 'false'])
        .transform((value) => value === 'true')
        .optional(),

      page: z.coerce.number().int().positive().default(1),

      limit: z.coerce.number().int().positive().max(100).default(10),
    }),
  },

  // =====================================================
  // MARK AS READ
  // =====================================================

  markAsRead: {
    params: z.object({
      id: z.string().uuid(),
    }),
  },

  // =====================================================
  // MARK ALL AS READ
  // =====================================================

  markAllAsRead: {
    body: z.object({
      userId: z.string().uuid().optional(),
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

export default NotificationValidationSchemas;
