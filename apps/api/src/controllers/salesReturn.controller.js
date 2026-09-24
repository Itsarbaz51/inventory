import salesReturnService from "../services/salesReturn.service.js";

class SalesReturnController {
  /**
   * CREATE
   */
  async create(req, res) {
    try {
      const tenantId = req.user.tenantId;
      const createdById = req.user.id;

      const salesReturn =
        await salesReturnService.create(
          tenantId,
          createdById,
          req.body
        );

      return res.status(201).json({
        success: true,
        message:
          "Sales return created successfully",
        data: salesReturn,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * GET ALL
   */
  async getAll(req, res) {
    try {
      const tenantId = req.user.tenantId;

      const result =
        await salesReturnService.getAll(
          tenantId,
          req.query
        );

      return res.status(200).json({
        success: true,
        message:
          "Sales returns fetched successfully",
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * GET BY ID
   */
  async getById(req, res) {
    try {
      const tenantId = req.user.tenantId;

      const salesReturn =
        await salesReturnService.getById(
          tenantId,
          req.params.id
        );

      return res.status(200).json({
        success: true,
        message:
          "Sales return fetched successfully",
        data: salesReturn,
      });
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * UPDATE
   */
  async update(req, res) {
    try {
      const tenantId = req.user.tenantId;

      const salesReturn =
        await salesReturnService.update(
          tenantId,
          req.params.id,
          req.body
        );

      return res.status(200).json({
        success: true,
        message:
          "Sales return updated successfully",
        data: salesReturn,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * DELETE
   */
  async delete(req, res) {
    try {
      const tenantId = req.user.tenantId;

      const result =
        await salesReturnService.delete(
          tenantId,
          req.params.id
        );

      return res.status(200).json({
        success: true,
        message: result.message,
        data: {
          id: result.id,
        },
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new SalesReturnController();