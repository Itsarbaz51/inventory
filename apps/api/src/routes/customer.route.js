import { Router } from 'express';

import {CustomerController} from '../controllers/index.js';
import { CustomerValidationSchemas } from '../validation/index.js';

import { AuthMiddleware, ValidateRequest } from '../middleware/index.js';

const router = Router();

// CREATE
router.post(
    '/',
    AuthMiddleware.isAuthenticated,
    ValidateRequest.validate(CustomerValidationSchemas.create),
    CustomerController.create
);

// GET ALL
router.get(
    '/',
    AuthMiddleware.isAuthenticated,
    CustomerController.getAll
);

// GET BY ID
router.get(
    '/:id',
    AuthMiddleware.isAuthenticated,
    ValidateRequest.validate(CustomerValidationSchemas.getById),
    CustomerController.getById
);

// UPDATE
router.patch(
    '/:id',
    AuthMiddleware.isAuthenticated,
    ValidateRequest.validate(CustomerValidationSchemas.update),
    CustomerController.update
);

// DELETE
router.delete(
    '/:id',
    AuthMiddleware.isAuthenticated,
    ValidateRequest.validate(CustomerValidationSchemas.delete),
    CustomerController.delete
);

export default router;