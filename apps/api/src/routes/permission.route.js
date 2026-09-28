import { Router } from 'express';

import { AuthMiddleware, ValidateRequest } from '../middleware/index.js';

import PermissionValidationSchemas from '../validation/permission.validation.js';

import PermissionController from '../controllers/permission.controller.js';

import asyncHandler from '../utils/AsyncHandler.js';

const route = Router();

// ==========================================
// GET ALL PERMISSIONS
// ==========================================

route.get(
    '/',
    AuthMiddleware.isAuthenticated,
    AuthMiddleware.authorize(["SUPER_ADMIN"]),
    asyncHandler(PermissionController.getAll),
);

// ==========================================
// GET MY PERMISSIONS
// ==========================================

route.get(
    '/my',
    AuthMiddleware.isAuthenticated,
    asyncHandler(PermissionController.getMyPermissions),
);

// ==========================================
// GET ROLE PERMISSIONS
// ==========================================

route.get(
    '/role/:roleId',
    AuthMiddleware.isAuthenticated,
    AuthMiddleware.authorize(["SUPER_ADMIN"]),
    ValidateRequest.validate(PermissionValidationSchemas.getRolePermissions),
    asyncHandler(PermissionController.getRolePermissions),
);

// ==========================================
// UPDATE ROLE PERMISSIONS
// ==========================================

route.put(
    '/role/:roleId',
    AuthMiddleware.isAuthenticated,
    AuthMiddleware.authorize(["SUPER_ADMIN"]),
    ValidateRequest.validate(PermissionValidationSchemas.updateRolePermissions),
    asyncHandler(PermissionController.updateRolePermissions),
);

export default route;