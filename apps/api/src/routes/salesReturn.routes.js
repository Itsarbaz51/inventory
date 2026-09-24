import express from 'express';

import { salesReturnController } from '../controllers/index.js';

import { SalesReturnValidationSchemas } from '../validation/index.js';

import { AuthMiddleware, ValidateRequest } from '../middleware/index.js';

const router = express.Router();

router.use(AuthMiddleware.isAuthenticated);

/**
 * CREATE
 * POST /api/sales-returns
 */
router.post(
  '/',
  ValidateRequest.validate(SalesReturnValidationSchemas.create),
  salesReturnController.create,
);

/**
 * GET ALL
 * GET /api/sales-returns
 */
router.get(
  '/',
  ValidateRequest.validate(SalesReturnValidationSchemas.getAll),
  salesReturnController.getAll,
);

/**
 * GET BY ID
 * GET /api/sales-returns/:id
 */
router.get(
  '/:id',
  ValidateRequest.validate(SalesReturnValidationSchemas.getById),
  salesReturnController.getById,
);

/**
 * UPDATE
 * PUT /api/sales-returns/:id
 */
router.put(
  '/:id',
  ValidateRequest.validate(SalesReturnValidationSchemas.update),
  salesReturnController.update,
);

/**
 * DELETE
 * DELETE /api/sales-returns/:id
 */
router.delete(
  '/:id',
  ValidateRequest.validate(SalesReturnValidationSchemas.delete),
  salesReturnController.delete,
);

export default router;
