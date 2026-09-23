import { Router } from 'express';

import { AuthMiddleware, ValidateRequest } from '../middleware/index.js';

import { UnitValidationSchemas } from '../validation/index.js';

import asyncHandler from '../utils/AsyncHandler.js';

import { UnitController } from '../controllers/index.js';

const route = Router();

// =====================================================
// CREATE UNIT
// =====================================================

route.post(
  '/',
  AuthMiddleware.isAuthenticated,
  ValidateRequest.validate(UnitValidationSchemas.create),
  asyncHandler(UnitController.create),
);

// =====================================================
// GET ALL UNITS
// =====================================================

route.get(
  '/',
  AuthMiddleware.isAuthenticated,
  asyncHandler(UnitController.getAll),
);

// =====================================================
// GET UNIT BY ID
// =====================================================

route.get(
  '/:id',
  AuthMiddleware.isAuthenticated,
  ValidateRequest.validate(UnitValidationSchemas.getById),
  asyncHandler(UnitController.getById),
);

// =====================================================
// UPDATE UNIT
// =====================================================

route.patch(
  '/:id',
  AuthMiddleware.isAuthenticated,
  ValidateRequest.validate(UnitValidationSchemas.update),
  asyncHandler(UnitController.update),
);

// =====================================================
// DELETE UNIT
// =====================================================

route.delete(
  '/:id',
  AuthMiddleware.isAuthenticated,
  ValidateRequest.validate(UnitValidationSchemas.delete),
  asyncHandler(UnitController.delete),
);

export default route;
