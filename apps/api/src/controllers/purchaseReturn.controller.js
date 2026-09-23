import { PurchaseReturnServices } from '../services/index.js';
import { ApiResponse } from '../utils/ApiResponse.js';

class PurchaseReturnController {
    // CREATE
    static async create(req, res) {
        const result =
            await PurchaseReturnServices.create(
                req.body,
                req,
            );

        return res
            .status(201)
            .json(
                ApiResponse.success(
                    result,
                    'Purchase return created successfully',
                ),
            );
    }

    // UPDATE
    static async update(req, res) {
        const result =
            await PurchaseReturnServices.update(
                req.params,
                req,
            );

        return res.json(
            ApiResponse.success(
                result,
                'Purchase return updated successfully',
            ),
        );
    }

    // GET BY ID
    static async getById(req, res) {
        const result =
            await PurchaseReturnServices.getById(
                req.params,
                req,
            );

        return res.json(
            ApiResponse.success(
                result,
                'Purchase return fetched successfully',
            ),
        );
    }

    // GET ALL
    static async getAll(req, res) {
        const result =
            await PurchaseReturnServices.getAll(
                req.query,
                req,
            );

        return res.json(
            ApiResponse.success(
                result,
                'Purchase returns fetched successfully',
            ),
        );
    }

    // DELETE
    static async delete(req, res) {
        await PurchaseReturnServices.delete(
            req.params,
            req,
        );

        return res.json(
            ApiResponse.success(
                null,
                'Purchase return deleted successfully',
            ),
        );
    }
}

export default PurchaseReturnController;