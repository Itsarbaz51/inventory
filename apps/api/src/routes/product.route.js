import { Router } from 'express';

import { AuthMiddleware, ValidateRequest } from '../middleware/index.js';

import asyncHandler from '../utils/AsyncHandler.js';

import { ProductValidationSchemas } from '../validation/index.js';
import { ProductController } from '../controllers/index.js';

const route = Router();

// =====================================================
// CREATE PRODUCT
// =====================================================

route.post(
  '/',
  AuthMiddleware.isAuthenticated,
  ValidateRequest.validate(ProductValidationSchemas.create),
  asyncHandler(ProductController.create),
);

// =====================================================
// GET ALL PRODUCTS
// =====================================================

route.get(
  '/',
  AuthMiddleware.isAuthenticated,
  ValidateRequest.validate(ProductValidationSchemas.getAll),
  asyncHandler(ProductController.getAll),
);

// =====================================================
// GET PRODUCT BY ID
// =====================================================

route.get(
  '/:id',
  AuthMiddleware.isAuthenticated,
  ValidateRequest.validate(ProductValidationSchemas.getById),
  asyncHandler(ProductController.getById),
);

// =====================================================
// UPDATE PRODUCT
// =====================================================

route.patch(
  '/:id',
  AuthMiddleware.isAuthenticated,
  ValidateRequest.validate(ProductValidationSchemas.update),
  asyncHandler(ProductController.update),
);

// =====================================================
// DELETE PRODUCT
// =====================================================

route.delete(
  '/:id',
  AuthMiddleware.isAuthenticated,
  ValidateRequest.validate(ProductValidationSchemas.delete),
  asyncHandler(ProductController.delete),
);

export default route;
