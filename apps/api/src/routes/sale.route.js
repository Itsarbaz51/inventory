import { Router } from 'express';

import { SaleController } from '../controllers/index.js';
import { SaleValidationSchemas } from '../validation/index.js';

import { AuthMiddleware, ValidateRequest } from '../middleware/index.js';

const router = Router();

// CREATE SALE
router.post(
  '/',
  AuthMiddleware.isAuthenticated,
  ValidateRequest.validate(SaleValidationSchemas.create),
  SaleController.create,
);

// GET ALL SALES
router.get('/', AuthMiddleware.isAuthenticated, SaleController.getAll);

// GET SALE BY ID
router.get(
  '/:id',
  AuthMiddleware.isAuthenticated,
  ValidateRequest.validate(SaleValidationSchemas.getById),
  SaleController.getById,
);

// UPDATE SALE
router.patch(
  '/:id',
  AuthMiddleware.isAuthenticated,
  ValidateRequest.validate(SaleValidationSchemas.update),
  SaleController.update,
);

// DELETE SALE
router.delete(
  '/:id',
  AuthMiddleware.isAuthenticated,
  ValidateRequest.validate(SaleValidationSchemas.delete),
  SaleController.delete,
);

export default router;
