import { CustomerServices } from '../services/index.js';
import { ApiResponse } from '../utils/ApiResponse.js';

class CustomerController {
    // CREATE
    static async create(req, res) {
        const result = await CustomerServices.create(
            req.body,
            req
        );

        return res
            .status(201)
            .json(
                ApiResponse.success(
                    result,
                    'Customer created successfully'
                )
            );
    }

    // UPDATE
    static async update(req, res) {
        const result = await CustomerServices.update(
            req.params,
            req
        );

        return res.json(
            ApiResponse.success(
                result,
                'Customer updated successfully'
            )
        );
    }

    // GET BY ID
    static async getById(req, res) {
        const result = await CustomerServices.getById(
            req.params,
            req
        );

        return res.json(
            ApiResponse.success(
                result,
                'Customer fetched successfully'
            )
        );
    }

    // GET ALL
    static async getAll(req, res) {
        const result = await CustomerServices.getAll(req);

        return res.json(
            ApiResponse.success(
                result,
                'Customers fetched successfully'
            )
        );
    }

    // DELETE
    static async delete(req, res) {
        await CustomerServices.delete(
            req.params,
            req
        );

        return res.json(
            ApiResponse.success(
                null,
                'Customer deleted successfully'
            )
        );
    }
}

export default CustomerController;