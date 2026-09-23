import { Router } from 'express';

import { AuthMiddleware, ValidateRequest } from '../middleware/index.js';
import RoleValidationSchemas from '../validation/role.validation.js';
import RoleController from '../controllers/role.controller.js';
import asyncHandler from '../utils/AsyncHandler.js';

const route = Router();

// CREATE ROLE
route.post(
  '/',
  AuthMiddleware.isAuthenticated,
  ValidateRequest.validate(RoleValidationSchemas.create),
  asyncHandler(RoleController.create),
);

// GET ALL ROLES
route.get(
  '/',
  AuthMiddleware.isAuthenticated,
  asyncHandler(RoleController.getAll),
);

// UPDATE ROLE
route.patch(
  '/:id',
  AuthMiddleware.isAuthenticated,
  ValidateRequest.validate(RoleValidationSchemas.update),
  asyncHandler(RoleController.update),
);

// DELETE ROLE
route.delete(
  '/:id',
  AuthMiddleware.isAuthenticated,
  ValidateRequest.validate(RoleValidationSchemas.delete),
  asyncHandler(RoleController.delete),
);

export default route;
