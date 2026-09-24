import { SaleServices } from '../services/index.js';
import { ApiResponse } from '../utils/ApiResponse.js';

class SaleController {
  // CREATE
  static async create(req, res) {
    const result = await SaleServices.create(req.body, req);

    return res
      .status(201)
      .json(ApiResponse.success(result, 'Sale created successfully'));
  }

  // UPDATE
  static async update(req, res) {
    const result = await SaleServices.update(req.params, req);

    return res.json(ApiResponse.success(result, 'Sale updated successfully'));
  }

  // GET BY ID
  static async getById(req, res) {
    const result = await SaleServices.getById(req.params, req);

    return res.json(ApiResponse.success(result, 'Sale fetched successfully'));
  }

  // GET ALL
  static async getAll(req, res) {
    const result = await SaleServices.getAll(req);

    return res.json(ApiResponse.success(result, 'Sales fetched successfully'));
  }

  // DELETE
  static async delete(req, res) {
    await SaleServices.delete(req.params, req);

    return res.json(ApiResponse.success(null, 'Sale deleted successfully'));
  }
}

export default SaleController;
