import express from 'express';

import { PurchaseReturnItemController } from '../controllers/index.js';

import { PurchaseReturnItemValidationSchemas } from '../validation/index.js';

import { AuthMiddleware, ValidateRequest } from '../middleware/index.js';

const router = express.Router();

// CREATE
router.post(
    '/',
    AuthMiddleware.isAuthenticated,
    ValidateRequest.validate(
        PurchaseReturnItemValidationSchemas.create,
    ),
    PurchaseReturnItemController.create,
);

// GET ALL
router.get(
    '/',
    AuthMiddleware.isAuthenticated,
    ValidateRequest.validate(
        PurchaseReturnItemValidationSchemas.getAll,
    ),
    PurchaseReturnItemController.getAll,
);

// GET BY ID
router.get(
    '/:id',
    AuthMiddleware.isAuthenticated,
    ValidateRequest.validate(
        PurchaseReturnItemValidationSchemas.getById,
    ),
    PurchaseReturnItemController.getById,
);

// UPDATE
router.put(
    '/:id',
    AuthMiddleware.isAuthenticated,
    ValidateRequest.validate(
        PurchaseReturnItemValidationSchemas.update,
    ),
    PurchaseReturnItemController.update,
);

// DELETE
router.delete(
    '/:id',
    AuthMiddleware.isAuthenticated,
    ValidateRequest.validate(
        PurchaseReturnItemValidationSchemas.delete,
    ),
    PurchaseReturnItemController.delete,
);

export default router;