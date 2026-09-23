import { z } from 'zod';

const PurchaseReturnItemValidationSchemas = {
    create: {
        body: z.object({
            purchaseReturnId: z.string().uuid(),

            productId: z.string().uuid(),

            quantity: z.coerce
                .number()
                .positive(),

            rate: z.coerce
                .number()
                .nonnegative(),

            total: z.coerce
                .number()
                .nonnegative()
                .optional(),
        }),
    },

    update: {
        params: z.object({
            id: z.string().uuid(),
        }),

        body: z
            .object({
                productId: z.string().uuid().optional(),

                quantity: z.coerce
                    .number()
                    .positive()
                    .optional(),

                rate: z.coerce
                    .number()
                    .nonnegative()
                    .optional(),

                total: z.coerce
                    .number()
                    .nonnegative()
                    .optional(),
            })
            .refine(
                (data) => Object.keys(data).length > 0,
                {
                    message: 'At least one field is required',
                },
            ),
    },

    getById: {
        params: z.object({
            id: z.string().uuid(),
        }),
    },

    getAll: {
        query: z.object({
            page: z.coerce
                .number()
                .int()
                .positive()
                .default(1),

            limit: z.coerce
                .number()
                .int()
                .positive()
                .max(100)
                .default(10),

            purchaseReturnId: z.string().uuid().optional(),

            productId: z.string().uuid().optional(),
        }),
    },

    delete: {
        params: z.object({
            id: z.string().uuid(),
        }),
    },
};

export default PurchaseReturnItemValidationSchemas;