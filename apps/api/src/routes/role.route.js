import { Router } from 'express';

import { AuthMiddleware, ValidateRequest } from '../middleware/index.js';
import RoleValidationSchemas from '../validation/role.validation.js';
import RoleController from '../controllers/role.controller.js';
import asyncHandler from '../utils/AsyncHandler.js';
import PermissionMiddleware from '../middleware/permission.middleware.js';
import { PermissionsRegistry } from '../utils/PermissionsRegistry.js';

const route = Router();

// CREATE ROLE
route.post(
  '/',
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.authorize(["SUPER_ADMIN"]),
  PermissionMiddleware.check(
    PermissionsRegistry.ROLE.CREATE,
  ),

  ValidateRequest.validate(RoleValidationSchemas.create),
  asyncHandler(RoleController.create),
);

// GET ALL ROLES
route.get(
  '/',
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.authorize(["SUPER_ADMIN"]),
  PermissionMiddleware.check(
    PermissionsRegistry.ROLE.VIEW,
  ),
  asyncHandler(RoleController.getAll),
);

// UPDATE ROLE
route.patch(
  '/:id',
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.authorize(["SUPER_ADMIN"]),
  PermissionMiddleware.check(
    PermissionsRegistry.ROLE.UPDATE,
  ),
  ValidateRequest.validate(RoleValidationSchemas.update),
  asyncHandler(RoleController.update),
);

// DELETE ROLE
route.delete(
  '/:id',
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.authorize(["SUPER_ADMIN"]),
  PermissionMiddleware.check(
    PermissionsRegistry.ROLE.DELETE,
  ),
  ValidateRequest.validate(RoleValidationSchemas.delete),
  asyncHandler(RoleController.delete),
);

export default route;
