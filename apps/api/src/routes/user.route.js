import { Router } from 'express';

import { AuthMiddleware, ValidateRequest } from '../middleware/index.js';
import asyncHandler from '../utils/AsyncHandler.js';

import { UserValidationSchemas } from '../validation/index.js';
import { UserController } from '../controllers/index.js';

const route = Router();

// CREATE USER

route.post(
  '/',
  AuthMiddleware.isAuthenticated,

  ValidateRequest.validate(UserValidationSchemas.create),

  asyncHandler(UserController.create),
);

// GET ALL USERS

route.get(
  '/',
  AuthMiddleware.isAuthenticated,

  ValidateRequest.validate(UserValidationSchemas.getAll),

  asyncHandler(UserController.getAll),
);

// GET USER BY ID

route.get(
  '/:id',
  AuthMiddleware.isAuthenticated,

  ValidateRequest.validate(UserValidationSchemas.getById),

  asyncHandler(UserController.getById),
);

// UPDATE USER

route.patch(
  '/:id',
  AuthMiddleware.isAuthenticated,

  ValidateRequest.validate(UserValidationSchemas.update),

  asyncHandler(UserController.update),
);

// DELETE USER

route.delete(
  '/:id',
  AuthMiddleware.isAuthenticated,

  ValidateRequest.validate(UserValidationSchemas.delete),

  asyncHandler(UserController.delete),
);

export default route;
