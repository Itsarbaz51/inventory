import { Router } from 'express';

import { SalesReturnItemController } from '../controllers/index.js';
import { SalesReturnItemValidationSchemas } from '../validation/index.js';

import { AuthMiddleware, ValidateRequest } from '../middleware/index.js';

const router = Router();

// =====================================================
// AUTH
// =====================================================

router.use(AuthMiddleware.isAuthenticated);

// =====================================================
// CREATE
// POST /api/sales-return-items
// =====================================================

router.post(
  '/',
  ValidateRequest.validate(SalesReturnItemValidationSchemas.create),
  SalesReturnItemController.create,
);

// =====================================================
// GET ALL
// GET /api/sales-return-items
// =====================================================

router.get(
  '/',
  ValidateRequest.validate(SalesReturnItemValidationSchemas.getAll),
  SalesReturnItemController.getAll,
);

// =====================================================
// GET BY ID
// GET /api/sales-return-items/:id
// =====================================================

router.get(
  '/:id',
  ValidateRequest.validate(SalesReturnItemValidationSchemas.getById),
  SalesReturnItemController.getById,
);

// =====================================================
// UPDATE
// PUT /api/sales-return-items/:id
// =====================================================

router.put(
  '/:id',
  ValidateRequest.validate(SalesReturnItemValidationSchemas.update),
  SalesReturnItemController.update,
);

// =====================================================
// DELETE
// DELETE /api/sales-return-items/:id
// =====================================================

router.delete(
  '/:id',
  ValidateRequest.validate(SalesReturnItemValidationSchemas.delete),
  SalesReturnItemController.delete,
);

export default router;
