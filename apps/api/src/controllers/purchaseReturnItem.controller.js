import { PurchaseReturnItemServices } from '../services/index.js';
import { ApiResponse } from '../utils/ApiResponse.js';

class PurchaseReturnItemController {
    // CREATE
    static async create(req, res) {
        const result =
            await PurchaseReturnItemServices.create(
                req.body,
                req,
            );

        return res
            .status(201)
            .json(
                ApiResponse.success(
                    result,
                    'Purchase return item created successfully',
                ),
            );
    }

    // UPDATE
    static async update(req, res) {
        const result =
            await PurchaseReturnItemServices.update(
                req.params,
                req,
            );

        return res.json(
            ApiResponse.success(
                result,
                'Purchase return item updated successfully',
            ),
        );
    }

    // GET BY ID
    static async getById(req, res) {
        const result =
            await PurchaseReturnItemServices.getById(
                req.params,
                req,
            );

        return res.json(
            ApiResponse.success(
                result,
                'Purchase return item fetched successfully',
            ),
        );
    }

    // GET ALL
    static async getAll(req, res) {
        const result =
            await PurchaseReturnItemServices.getAll(
                req.query,
                req,
            );

        return res.json(
            ApiResponse.success(
                result,
                'Purchase return items fetched successfully',
            ),
        );
    }

    // DELETE
    static async delete(req, res) {
        await PurchaseReturnItemServices.delete(
            req.params,
            req,
        );

        return res.json(
            ApiResponse.success(
                null,
                'Purchase return item deleted successfully',
            ),
        );
    }
}

export default PurchaseReturnItemController;