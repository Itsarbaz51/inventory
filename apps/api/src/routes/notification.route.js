import { Router } from 'express';

import NotificationController from '../controllers/notification.controller.js';

import NotificationValidationSchemas from '../validation/notification.validation.js';

import { AuthMiddleware, ValidateRequest } from '../middleware/index.js';

const router = Router();

// =====================================================
// AUTH
// =====================================================

router.use(AuthMiddleware.isAuthenticated);

// =====================================================
// CREATE
// POST /api/notifications
// =====================================================

router.post(
  '/',
  ValidateRequest.validate(NotificationValidationSchemas.create),
  NotificationController.create,
);

// =====================================================
// GET ALL
// GET /api/notifications
// =====================================================

router.get(
  '/',
  ValidateRequest.validate(NotificationValidationSchemas.getAll),
  NotificationController.getAll,
);

// =====================================================
// MARK ALL AS READ
// PATCH /api/notifications/mark-all-read
// =====================================================

router.patch(
  '/mark-all-read',
  ValidateRequest.validate(NotificationValidationSchemas.markAllAsRead),
  NotificationController.markAllAsRead,
);

// =====================================================
// MARK AS READ
// PATCH /api/notifications/:id/read
// =====================================================

router.patch(
  '/:id/read',
  ValidateRequest.validate(NotificationValidationSchemas.markAsRead),
  NotificationController.markAsRead,
);

// =====================================================
// GET BY ID
// GET /api/notifications/:id
// =====================================================

router.get(
  '/:id',
  ValidateRequest.validate(NotificationValidationSchemas.getById),
  NotificationController.getById,
);

// =====================================================
// DELETE
// DELETE /api/notifications/:id
// =====================================================

router.delete(
  '/:id',
  ValidateRequest.validate(NotificationValidationSchemas.delete),
  NotificationController.delete,
);

export default router;
