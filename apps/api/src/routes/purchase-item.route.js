import express from 'express';

import { PurchaseItemController } from '../controllers/index.js';

import { PurchaseItemValidationSchemas } from '../validation/index.js';

import { AuthMiddleware, ValidateRequest } from '../middleware/index.js';


const router = express.Router();

// =====================================================
// CREATE
// =====================================================

router.post(
    '/',
    AuthMiddleware.isAuthenticated,
    ValidateRequest.validate(PurchaseItemValidationSchemas.create),
    PurchaseItemController.create,
);

// =====================================================
// GET ALL
// =====================================================

router.get(
    '/',
    AuthMiddleware.isAuthenticated,
    PurchaseItemController.getAll,
);

// =====================================================
// GET BY ID
// =====================================================

router.get(
    '/:id',
    AuthMiddleware.isAuthenticated,
    ValidateRequest.validate(PurchaseItemValidationSchemas.getById),
    PurchaseItemController.getById,
);

// =====================================================
// UPDATE
// =====================================================

router.patch(
    '/:id',
    AuthMiddleware.isAuthenticated,
    ValidateRequest.validate(PurchaseItemValidationSchemas.update),
    PurchaseItemController.update,
);

// =====================================================
// DELETE
// =====================================================

router.delete(
    '/:id',
    AuthMiddleware.isAuthenticated,
    ValidateRequest.validate(PurchaseItemValidationSchemas.delete),
    PurchaseItemController.delete,
);

export default router;