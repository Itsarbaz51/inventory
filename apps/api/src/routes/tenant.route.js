import { Router } from 'express';

import { AuthMiddleware, ValidateRequest } from '../middleware/index.js';

import asyncHandler from '../utils/AsyncHandler.js';

import { TenantValidationSchemas } from '../validation/index.js';
import { TenantController } from '../controllers/index.js';
import PermissionMiddleware from '../middleware/permission.middleware.js';
import { PermissionsRegistry } from '../utils/PermissionsRegistry.js';

const route = Router();

// =====================================================
// CREATE TENANT
// =====================================================

route.post(
  '/',
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.authorize(["SUPER_ADMIN"]),
  PermissionMiddleware.check(
    PermissionsRegistry.TENANT.CREATE,
  ),

  ValidateRequest.validate(TenantValidationSchemas.create),
  asyncHandler(TenantController.create),
);

// =====================================================
// GET ALL TENANTS
// =====================================================

route.get(
  '/',
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.authorize(["SUPER_ADMIN"]),
  PermissionMiddleware.check(
    PermissionsRegistry.ROLE.VIEW,
  ),

  ValidateRequest.validate(TenantValidationSchemas.getAll),

  asyncHandler(TenantController.getAll),
);

// =====================================================
// GET TENANT BY ID
// =====================================================

route.get(
  '/:id',
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.authorize(["SUPER_ADMIN"]),
  PermissionMiddleware.check(
    PermissionsRegistry.ROLE.VIEW,
  ),

  ValidateRequest.validate(TenantValidationSchemas.getById),

  asyncHandler(TenantController.getById),
);

// =====================================================
// UPDATE TENANT
// =====================================================

route.patch(
  '/:id',
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.authorize(["SUPER_ADMIN"]),
  PermissionMiddleware.check(
    PermissionsRegistry.ROLE.UPDATE,
  ),

  ValidateRequest.validate(TenantValidationSchemas.update),

  asyncHandler(TenantController.update),
);

// =====================================================
// DELETE TENANT
// =====================================================

route.delete(
  '/:id',
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.authorize(["SUPER_ADMIN"]),
  PermissionMiddleware.check(
    PermissionsRegistry.ROLE.DELETE,
  ),

  ValidateRequest.validate(TenantValidationSchemas.delete),

  asyncHandler(TenantController.delete),
);

export default route;
