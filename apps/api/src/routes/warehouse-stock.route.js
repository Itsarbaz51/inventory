import { Router } from 'express';

import { AuthMiddleware, ValidateRequest } from '../middleware/index.js';

import asyncHandler from '../utils/AsyncHandler.js';

import { WarehouseStockController } from '../controllers/index.js';
import { WarehouseStockValidationSchemas } from '../validation/index.js';

const route = Router();

// =====================================================
// CREATE / OPENING STOCK
// =====================================================

route.post(
  '/',
  AuthMiddleware.isAuthenticated,
  ValidateRequest.validate(WarehouseStockValidationSchemas.create),
  asyncHandler(WarehouseStockController.create),
);

// =====================================================
// GET ALL
// =====================================================

route.get(
  '/',
  AuthMiddleware.isAuthenticated,
  asyncHandler(WarehouseStockController.getAll),
);

// =====================================================
// GET BY ID
// =====================================================

route.get(
  '/:id',
  AuthMiddleware.isAuthenticated,
  ValidateRequest.validate(WarehouseStockValidationSchemas.getById),
  asyncHandler(WarehouseStockController.getById),
);

// =====================================================
// UPDATE
// =====================================================

route.patch(
  '/:id',
  AuthMiddleware.isAuthenticated,
  ValidateRequest.validate(WarehouseStockValidationSchemas.update),
  asyncHandler(WarehouseStockController.update),
);

// =====================================================
// DELETE
// =====================================================

route.delete(
  '/:id',
  AuthMiddleware.isAuthenticated,
  ValidateRequest.validate(WarehouseStockValidationSchemas.delete),
  asyncHandler(WarehouseStockController.delete),
);

export default route;
