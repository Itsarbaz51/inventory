import { Router } from 'express';

import { AuthMiddleware, ValidateRequest } from '../middleware/index.js';

import { BrandValidationSchemas } from '../validation/index.js';

import asyncHandler from '../utils/AsyncHandler.js';

import { BrandController } from '../controllers/index.js';

const route = Router();

// =====================================================
// CREATE BRAND
// =====================================================

route.post(
  '/',
  AuthMiddleware.isAuthenticated,
  ValidateRequest.validate(BrandValidationSchemas.create),
  asyncHandler(BrandController.create),
);

// =====================================================
// GET ALL BRANDS
// =====================================================

route.get(
  '/',
  AuthMiddleware.isAuthenticated,
  asyncHandler(BrandController.getAll),
);

// =====================================================
// GET BRAND BY ID
// =====================================================

route.get(
  '/:id',
  AuthMiddleware.isAuthenticated,
  ValidateRequest.validate(BrandValidationSchemas.getById),
  asyncHandler(BrandController.getById),
);

// =====================================================
// UPDATE BRAND
// =====================================================

route.patch(
  '/:id',
  AuthMiddleware.isAuthenticated,
  ValidateRequest.validate(BrandValidationSchemas.update),
  asyncHandler(BrandController.update),
);

// =====================================================
// DELETE BRAND
// =====================================================

route.delete(
  '/:id',
  AuthMiddleware.isAuthenticated,
  ValidateRequest.validate(BrandValidationSchemas.delete),
  asyncHandler(BrandController.delete),
);

export default route;
