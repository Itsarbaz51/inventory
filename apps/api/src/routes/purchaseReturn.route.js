import express from 'express';

import { PurchaseReturnController } from '../controllers/index.js';

import { PurchaseReturnValidationSchemas } from '../validation/index.js';

import { AuthMiddleware, ValidateRequest } from '../middleware/index.js';


const router = express.Router();

// CREATE
router.post(
    '/',
    AuthMiddleware.isAuthenticated,
    ValidateRequest.validate(PurchaseReturnValidationSchemas.create),
    PurchaseReturnController.create,
);

// GET ALL
router.get(
    '/',
    AuthMiddleware.isAuthenticated,
    ValidateRequest.validate(PurchaseReturnValidationSchemas.getAll),
    PurchaseReturnController.getAll,
);

// GET BY ID
router.get(
    '/:id',
    AuthMiddleware.isAuthenticated,
    ValidateRequest.validate(PurchaseReturnValidationSchemas.getById),
    PurchaseReturnController.getById,
);

// UPDATE
router.put(
    '/:id',
    AuthMiddleware.isAuthenticated,
    ValidateRequest.validate(PurchaseReturnValidationSchemas.update),
    PurchaseReturnController.update,
);

// DELETE
router.delete(
    '/:id',
    AuthMiddleware.isAuthenticated,
    ValidateRequest.validate(PurchaseReturnValidationSchemas.delete),
    PurchaseReturnController.delete,
);

export default router;