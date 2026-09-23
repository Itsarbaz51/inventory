import {BrandServices} from '../services/index.js';
import { ApiResponse } from '../utils/ApiResponse.js';

class BrandController {
  // =====================================================
  // CREATE
  // =====================================================

  static async create(req, res) {
    const result = await BrandServices.create(
      req.body,
      req,
    );

    return res
      .status(201)
      .json(
        ApiResponse.success(
          result,
          'Brand created successfully',
        ),
      );
  }

  // =====================================================
  // UPDATE
  // =====================================================

  static async update(req, res) {
    const updated = await BrandServices.update(
      req.params,
      req,
    );

    return res
      .status(200)
      .json(
        ApiResponse.success(
          updated,
          'Brand updated successfully',
        ),
      );
  }

  // =====================================================
  // GET BY ID
  // =====================================================

  static async getById(req, res) {
    const brand = await BrandServices.getById(
      req.params,
      req,
    );

    return res
      .status(200)
      .json(
        ApiResponse.success(
          brand,
          'Brand fetched successfully',
        ),
      );
  }

  // =====================================================
  // GET ALL
  // =====================================================

  static async getAll(req, res) {
    const brands = await BrandServices.getAll(
      req.query,
      req,
    );

    return res
      .status(200)
      .json(
        ApiResponse.success(
          brands,
          'Brands fetched successfully',
        ),
      );
  }

  // =====================================================
  // DELETE
  // =====================================================

  static async delete(req, res) {
    await BrandServices.delete(
      req.params,
      req,
    );

    return res
      .status(200)
      .json(
        ApiResponse.success(
          null,
          'Brand deleted successfully',
        ),
      );
  }
}

export default BrandController;