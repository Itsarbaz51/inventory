import { ProductServices } from '../services/index.js';
import { ApiResponse } from '../utils/ApiResponse.js';

class ProductController {
  // =====================================================
  // CREATE
  // =====================================================
  static async create(req, res) {
    const result = await ProductServices.create(req.body, req);

    return res
      .status(201)
      .json(ApiResponse.success(result, 'Product created successfully'));
  }

  // =====================================================
  // GET BY ID
  // =====================================================
  static async getById(req, res) {
    const result = await ProductServices.getById(req.params, req);

    return res
      .status(200)
      .json(ApiResponse.success(result, 'Product fetched successfully'));
  }

  // =====================================================
  // GET ALL
  // =====================================================
  static async getAll(req, res) {
    const result = await ProductServices.getAll(req.query, req);

    return res
      .status(200)
      .json(ApiResponse.success(result, 'Products fetched successfully'));
  }

  // =====================================================
  // UPDATE
  // =====================================================
  static async update(req, res) {
    const result = await ProductServices.update(req.params, req);

    return res
      .status(200)
      .json(ApiResponse.success(result, 'Product updated successfully'));
  }

  // =====================================================
  // DELETE
  // =====================================================
  static async delete(req, res) {
    await ProductServices.delete(req.params, req);

    return res
      .status(200)
      .json(ApiResponse.success(null, 'Product deleted successfully'));
  }
}

export default ProductController;
