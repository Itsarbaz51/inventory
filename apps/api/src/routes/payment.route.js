import { Router } from 'express';

import { PaymentController } from '../controllers/index.js';

import { PaymentValidationSchemas } from '../validation/index.js';

import { AuthMiddleware, ValidateRequest } from '../middleware/index.js';

const router = Router();

// =====================================================
// AUTH
// =====================================================

router.use(AuthMiddleware.isAuthenticated);

// =====================================================
// CREATE
// POST /api/payments
// =====================================================

router.post(
  '/',
  ValidateRequest.validate(PaymentValidationSchemas.create),
  PaymentController.create,
);

// =====================================================
// GET ALL
// GET /api/payments
// =====================================================

router.get(
  '/',
  ValidateRequest.validate(PaymentValidationSchemas.getAll),
  PaymentController.getAll,
);

// =====================================================
// GET BY ID
// GET /api/payments/:id
// =====================================================

router.get(
  '/:id',
  ValidateRequest.validate(PaymentValidationSchemas.getById),
  PaymentController.getById,
);

// =====================================================
// DELETE
// DELETE /api/payments/:id
// =====================================================

router.delete(
  '/:id',
  ValidateRequest.validate(PaymentValidationSchemas.delete),
  PaymentController.delete,
);

export default router;
