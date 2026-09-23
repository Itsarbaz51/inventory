import { Router } from 'express';

import { AuthMiddleware, ValidateRequest } from '../middleware/index.js';

import { CategoryValidationSchemas } from '../validation/index.js';
import { CategoryController } from '../controllers/index.js';

import asyncHandler from '../utils/AsyncHandler.js';

const route = Router();

// =====================================================
// CREATE CATEGORY
// =====================================================

route.post(
  '/',
  AuthMiddleware.isAuthenticated,
  ValidateRequest.validate(CategoryValidationSchemas.create),
  asyncHandler(CategoryController.create),
);

// =====================================================
// GET ALL CATEGORIES
// =====================================================

route.get(
  '/',
  AuthMiddleware.isAuthenticated,
  asyncHandler(CategoryController.getAll),
);

// =====================================================
// GET CATEGORY BY ID
// =====================================================

route.get(
  '/:id',
  AuthMiddleware.isAuthenticated,
  ValidateRequest.validate(CategoryValidationSchemas.getById),
  asyncHandler(CategoryController.getById),
);

// =====================================================
// UPDATE CATEGORY
// =====================================================

route.put(
  '/:id',
  AuthMiddleware.isAuthenticated,
  ValidateRequest.validate(CategoryValidationSchemas.update),
  asyncHandler(CategoryController.update),
);

// =====================================================
// DELETE CATEGORY
// =====================================================

route.delete(
  '/:id',
  AuthMiddleware.isAuthenticated,
  ValidateRequest.validate(CategoryValidationSchemas.delete),
  asyncHandler(CategoryController.delete),
);

export default route;
