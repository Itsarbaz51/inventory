import { Router } from 'express';

import { AuthMiddleware, ValidateRequest } from '../middleware/index.js';

import asyncHandler from '../utils/AsyncHandler.js';

import { SupplierController } from '../controllers/index.js';
import { SupplierValidationSchemas } from '../validation/index.js';

const route = Router();

// =====================================================
// CREATE
// =====================================================

route.post(
  '/',
  AuthMiddleware.isAuthenticated,

  ValidateRequest.validate(SupplierValidationSchemas.create),

  asyncHandler(SupplierController.create),
);

// =====================================================
// GET ALL
// =====================================================

route.get(
  '/',
  AuthMiddleware.isAuthenticated,

  asyncHandler(SupplierController.getAll),
);

// =====================================================
// GET BY ID
// =====================================================

route.get(
  '/:id',
  AuthMiddleware.isAuthenticated,

  ValidateRequest.validate(SupplierValidationSchemas.getById),

  asyncHandler(SupplierController.getById),
);

// =====================================================
// UPDATE
// =====================================================

route.patch(
  '/:id',
  AuthMiddleware.isAuthenticated,

  ValidateRequest.validate(SupplierValidationSchemas.update),

  asyncHandler(SupplierController.update),
);

// =====================================================
// DELETE
// =====================================================

route.delete(
  '/:id',
  AuthMiddleware.isAuthenticated,

  ValidateRequest.validate(SupplierValidationSchemas.delete),

  asyncHandler(SupplierController.delete),
);

export default route;
