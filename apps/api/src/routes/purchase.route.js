import express from 'express';

import { PurchaseController } from '../controllers/index.js';

import { PurchaseValidationSchemas } from '../validation/index.js';

import { AuthMiddleware, ValidateRequest } from '../middleware/index.js';

const router = express.Router();

// =====================================================
// CREATE
// =====================================================

router.post(
  '/',
  AuthMiddleware.isAuthenticated,
  ValidateRequest.validate(PurchaseValidationSchemas.create),
  PurchaseController.create,
);

// =====================================================
// GET ALL
// =====================================================

router.get('/', AuthMiddleware.isAuthenticated, PurchaseController.getAll);

// =====================================================
// GET BY ID
// =====================================================

router.get(
  '/:id',
  AuthMiddleware.isAuthenticated,
  ValidateRequest.validate(PurchaseValidationSchemas.getById),
  PurchaseController.getById,
);

// =====================================================
// UPDATE
// =====================================================

router.patch(
  '/:id',
  AuthMiddleware.isAuthenticated,
  ValidateRequest.validate(PurchaseValidationSchemas.update),
  PurchaseController.update,
);

// =====================================================
// DELETE
// =====================================================

router.delete(
  '/:id',
  AuthMiddleware.isAuthenticated,
  ValidateRequest.validate(PurchaseValidationSchemas.delete),
  PurchaseController.delete,
);

export default router;
