import { Router } from 'express';

import StockMovementController from '../controllers/stock-movement.controller.js';

import StockMovementValidationSchemas from '../validation/stock-movement.validation.js';

import { AuthMiddleware, ValidateRequest } from '../middleware/index.js';

const router = Router();

// =====================================================
// AUTH
// =====================================================

router.use(AuthMiddleware.isAuthenticated);

// =====================================================
// CREATE
// POST /api/stock-movements
// =====================================================

router.post(
  '/',
  ValidateRequest.validate(StockMovementValidationSchemas.create),
  StockMovementController.create,
);

// =====================================================
// GET ALL
// GET /api/stock-movements
// =====================================================

router.get(
  '/',
  ValidateRequest.validate(StockMovementValidationSchemas.getAll),
  StockMovementController.getAll,
);

// =====================================================
// GET BY ID
// GET /api/stock-movements/:id
// =====================================================

router.get(
  '/:id',
  ValidateRequest.validate(StockMovementValidationSchemas.getById),
  StockMovementController.getById,
);

// =====================================================
// DELETE
// DELETE /api/stock-movements/:id
// =====================================================

router.delete(
  '/:id',
  ValidateRequest.validate(StockMovementValidationSchemas.delete),
  StockMovementController.delete,
);

export default router;
