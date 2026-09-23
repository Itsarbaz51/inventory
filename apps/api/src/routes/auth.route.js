import { Router } from 'express';

import { AuthValidationSchemas } from '../validation/index.js';
import { AuthMiddleware, ValidateRequest } from '../middleware/index.js';
import asyncHandler from '../utils/AsyncHandler.js';
import { AuthController } from '../controllers/index.js';

const route = Router();

// Login
route.post(
  '/login',
  ValidateRequest.validate(AuthValidationSchemas.login),
  asyncHandler(AuthController.login),
);

// Forgot Password
route.post(
  '/forgot-password',
  ValidateRequest.validate(AuthValidationSchemas.forgotPassword),
  asyncHandler(AuthController.forgotPassword),
);

// Forgot Password Verify
route.post(
  '/forgot-password-verify',
  ValidateRequest.validate(AuthValidationSchemas.forgotPasswordVerify),
  asyncHandler(AuthController.forgotPasswordVerify),
);

// Current User
route.get(
  '/',
  AuthMiddleware.isAuthenticated,
  asyncHandler(AuthController.me),
);

// Reset Password
route.post(
  '/reset-password',
  AuthMiddleware.isAuthenticated,
  ValidateRequest.validate(AuthValidationSchemas.resetPassword),
  asyncHandler(AuthController.resetPassword),
);

// Logout
route.post(
  '/logout',
  AuthMiddleware.isAuthenticated,
  asyncHandler(AuthController.logout),
);

export default route;
