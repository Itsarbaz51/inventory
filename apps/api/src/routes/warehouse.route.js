import { Router } from 'express';

import { AuthMiddleware, ValidateRequest } from '../middleware/index.js';
import asyncHandler from '../utils/AsyncHandler.js';

import { WarehouseValidationSchemas } from '../validation/index.js';
import { WarehouseController } from '../controllers/index.js';

const route = Router();

// =====================================================
// CREATE WAREHOUSE
// =====================================================

route.post(
  '/',
  AuthMiddleware.isAuthenticated,
  ValidateRequest.validate(WarehouseValidationSchemas.create),
  asyncHandler(WarehouseController.create),
);

// =====================================================
// GET ALL WAREHOUSES
// =====================================================

route.get(
  '/',
  AuthMiddleware.isAuthenticated,
  ValidateRequest.validate(WarehouseValidationSchemas.getAll),
  asyncHandler(WarehouseController.getAll),
);

// =====================================================
// GET WAREHOUSE BY ID
// =====================================================

route.get(
  '/:id',
  AuthMiddleware.isAuthenticated,
  ValidateRequest.validate(WarehouseValidationSchemas.getById),
  asyncHandler(WarehouseController.getById),
);

// =====================================================
// UPDATE WAREHOUSE
// =====================================================

route.patch(
  '/:id',
  AuthMiddleware.isAuthenticated,
  ValidateRequest.validate(WarehouseValidationSchemas.update),
  asyncHandler(WarehouseController.update),
);

// =====================================================
// DELETE WAREHOUSE
// =====================================================

route.delete(
  '/:id',
  AuthMiddleware.isAuthenticated,
  ValidateRequest.validate(WarehouseValidationSchemas.delete),
  asyncHandler(WarehouseController.delete),
);

export default route;
