import express from 'express';

import { saleItemController } from '../controllers/index.js';
import { SaleItemValidationSchemas } from '../validation/index.js';

import { AuthMiddleware, ValidateRequest } from '../middleware/index.js';

const router = express.Router();

/**
 * All routes require authentication
 */
router.use(AuthMiddleware.isAuthenticated);

/**
 * CREATE
 * POST /api/sale-items
 */
router.post(
  '/',
  ValidateRequest.validate(SaleItemValidationSchemas.create),
  saleItemController.create,
);

/**
 * GET ALL
 * GET /api/sale-items
 */
router.get('/', saleItemController.getAll);

/**
 * GET ITEMS BY SALE
 * GET /api/sale-items/sale/:saleId
 */
router.get(
  '/sale/:saleId',
  ValidateRequest.validate(SaleItemValidationSchemas.getBySale),
  saleItemController.getBySale,
);

/**
 * GET BY ID
 * GET /api/sale-items/:id
 */
router.get(
  '/:id',
  ValidateRequest.validate(SaleItemValidationSchemas.getById),
  saleItemController.getById,
);

/**
 * UPDATE
 * PUT /api/sale-items/:id
 */
router.put(
  '/:id',
  ValidateRequest.validate(SaleItemValidationSchemas.update),
  saleItemController.update,
);

/**
 * DELETE
 * DELETE /api/sale-items/:id
 */
router.delete(
  '/:id',
  ValidateRequest.validate(SaleItemValidationSchemas.delete),
  saleItemController.delete,
);

export default router;
