import { CategoryServices } from '../services/index.js';
import { ApiResponse } from '../utils/ApiResponse.js';

class CategoryController {
  // =====================================================
  // CREATE
  // =====================================================
  static async create(req, res) {
    const result = await CategoryServices.create(req.body, req);

    return res
      .status(201)
      .json(ApiResponse.success(result, 'Category created successfully'));
  }

  // =====================================================
  // UPDATE
  // =====================================================
  static async update(req, res) {
    const updated = await CategoryServices.update(req.params, req);

    return res.json(
      ApiResponse.success(updated, 'Category updated successfully'),
    );
  }

  // =====================================================
  // GET BY ID
  // =====================================================
  static async getById(req, res) {
    const category = await CategoryServices.getById(req.params, req);

    return res.json(
      ApiResponse.success(category, 'Category fetched successfully'),
    );
  }

  // =====================================================
  // GET ALL
  // =====================================================
  static async getAll(req, res) {
    const categories = await CategoryServices.getAll(req);

    return res.json(
      ApiResponse.success(categories, 'Categories fetched successfully'),
    );
  }

  // =====================================================
  // DELETE
  // =====================================================
  static async delete(req, res) {
    await CategoryServices.delete(req.params, req);

    return res.json(ApiResponse.success(null, 'Category deleted successfully'));
  }
}

export default CategoryController;
