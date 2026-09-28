import { Router } from 'express';

import { AuthMiddleware, ValidateRequest } from '../middleware/index.js';
import asyncHandler from '../utils/AsyncHandler.js';

import { UserValidationSchemas } from '../validation/index.js';
import { UserController } from '../controllers/index.js';
import PermissionMiddleware from '../middleware/permission.middleware.js';
import { PermissionsRegistry } from '../utils/PermissionsRegistry.js';

const route = Router();

// CREATE USER

route.post(
  '/',
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.authorize(["SUPER_ADMIN"]),
  PermissionMiddleware.check(
    PermissionsRegistry.USER.CREATE,
  ),

  ValidateRequest.validate(UserValidationSchemas.create),

  asyncHandler(UserController.create),
);

// GET ALL USERS

route.get(
  '/',
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.authorize(["SUPER_ADMIN"]),
  PermissionMiddleware.check(
    PermissionsRegistry.USER.VIEW,
  ),

  ValidateRequest.validate(UserValidationSchemas.getAll),

  asyncHandler(UserController.getAll),
);

// GET USER BY ID

route.get(
  '/:id',
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.authorize(["SUPER_ADMIN"]),
  PermissionMiddleware.check(
    PermissionsRegistry.ROLE.VIEW,
  ),

  ValidateRequest.validate(UserValidationSchemas.getById),

  asyncHandler(UserController.getById),
);

// UPDATE USER

route.patch(
  '/:id',
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.authorize(["SUPER_ADMIN"]),
  PermissionMiddleware.check(
    PermissionsRegistry.ROLE.UPDATE,
  ),

  ValidateRequest.validate(UserValidationSchemas.update),

  asyncHandler(UserController.update),
);

// DELETE USER

route.delete(
  '/:id',
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.authorize(["SUPER_ADMIN"]),
  PermissionMiddleware.check(
    PermissionsRegistry.ROLE.DELETE,
  ),

  ValidateRequest.validate(UserValidationSchemas.delete),

  asyncHandler(UserController.delete),
);

export default route;
