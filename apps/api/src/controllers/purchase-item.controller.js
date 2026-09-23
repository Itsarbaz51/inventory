import { PurchaseItemServices } from '../services/index.js';
import { ApiResponse } from '../utils/ApiResponse.js';

class PurchaseItemController {
    // =====================================================
    // CREATE
    // =====================================================

    static async create(req, res) {
        const result =
            await PurchaseItemServices.create(
                req.body,
                req,
            );

        return res
            .status(201)
            .json(
                ApiResponse.success(
                    result,
                    'Purchase item created successfully',
                ),
            );
    }

    // =====================================================
    // UPDATE
    // =====================================================

    static async update(req, res) {
        const result =
            await PurchaseItemServices.update(
                req.params,
                req,
            );

        return res.json(
            ApiResponse.success(
                result,
                'Purchase item updated successfully',
            ),
        );
    }

    // =====================================================
    // GET BY ID
    // =====================================================

    static async getById(req, res) {
        const result =
            await PurchaseItemServices.getById(
                req.params,
                req,
            );

        return res.json(
            ApiResponse.success(
                result,
                'Purchase item fetched successfully',
            ),
        );
    }

    // =====================================================
    // GET ALL
    // =====================================================

    static async getAll(req, res) {
        const result =
            await PurchaseItemServices.getAll(
                req.query,
                req,
            );

        return res.json(
            ApiResponse.success(
                result,
                'Purchase items fetched successfully',
            ),
        );
    }

    // =====================================================
    // DELETE
    // =====================================================

    static async delete(req, res) {
        await PurchaseItemServices.delete(
            req.params,
            req,
        );

        return res.json(
            ApiResponse.success(
                null,
                'Purchase item deleted successfully',
            ),
        );
    }
}

export default PurchaseItemController;