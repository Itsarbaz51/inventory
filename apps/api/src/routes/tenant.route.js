import { Router } from 'express';

import { AuthMiddleware, ValidateRequest } from '../middleware/index.js';

import asyncHandler from '../utils/AsyncHandler.js';

import { TenantValidationSchemas } from '../validation/index.js';
import { TenantController } from '../controllers/index.js';

const route = Router();

// =====================================================
// CREATE TENANT
// =====================================================

route.post(
  '/',
  ValidateRequest.validate(TenantValidationSchemas.create),
  asyncHandler(TenantController.create),
);

// =====================================================
// GET ALL TENANTS
// =====================================================

route.get(
  '/',
  AuthMiddleware.isAuthenticated,

  ValidateRequest.validate(TenantValidationSchemas.getAll),

  asyncHandler(TenantController.getAll),
);

// =====================================================
// GET TENANT BY ID
// =====================================================

route.get(
  '/:id',
  AuthMiddleware.isAuthenticated,

  ValidateRequest.validate(TenantValidationSchemas.getById),

  asyncHandler(TenantController.getById),
);

// =====================================================
// UPDATE TENANT
// =====================================================

route.patch(
  '/:id',
  AuthMiddleware.isAuthenticated,

  ValidateRequest.validate(TenantValidationSchemas.update),

  asyncHandler(TenantController.update),
);

// =====================================================
// DELETE TENANT
// =====================================================

route.delete(
  '/:id',
  AuthMiddleware.isAuthenticated,

  ValidateRequest.validate(TenantValidationSchemas.delete),

  asyncHandler(TenantController.delete),
);

export default route;
