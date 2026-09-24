import { z } from 'zod';

const CustomerValidationSchemas = {
    create: {
        body: z.object({
            name: z
                .string()
                .trim()
                .min(2, 'Customer name is required')
                .max(150),

            phone: z
                .string()
                .trim()
                .max(20)
                .optional()
                .nullable(),

            email: z
                .string()
                .trim()
                .email('Invalid email')
                .max(150)
                .optional()
                .nullable(),

            gstNumber: z
                .string()
                .trim()
                .max(30)
                .optional()
                .nullable(),

            panNumber: z
                .string()
                .trim()
                .max(20)
                .optional()
                .nullable(),

            billingAddress: z
                .string()
                .trim()
                .optional()
                .nullable(),

            shippingAddress: z
                .string()
                .trim()
                .optional()
                .nullable(),

            city: z
                .string()
                .trim()
                .max(100)
                .optional()
                .nullable(),

            state: z
                .string()
                .trim()
                .max(100)
                .optional()
                .nullable(),

            pincode: z
                .string()
                .trim()
                .max(20)
                .optional()
                .nullable(),

            openingBalance: z
                .coerce
                .number()
                .min(0)
                .default(0),

            creditLimit: z
                .coerce
                .number()
                .min(0)
                .optional()
                .nullable(),

            paymentTerms: z
                .coerce
                .number()
                .int()
                .min(0)
                .optional()
                .nullable(),

            isWalkIn: z
                .boolean()
                .default(false),

            isActive: z
                .boolean()
                .default(true),
        }),
    },

    update: {
        params: z.object({
            id: z.string().uuid('Invalid customer id'),
        }),

        body: z
            .object({
                name: z
                    .string()
                    .trim()
                    .min(2)
                    .max(150)
                    .optional(),

                phone: z
                    .string()
                    .trim()
                    .max(20)
                    .optional()
                    .nullable(),

                email: z
                    .string()
                    .trim()
                    .email('Invalid email')
                    .max(150)
                    .optional()
                    .nullable(),

                gstNumber: z
                    .string()
                    .trim()
                    .max(30)
                    .optional()
                    .nullable(),

                panNumber: z
                    .string()
                    .trim()
                    .max(20)
                    .optional()
                    .nullable(),

                billingAddress: z
                    .string()
                    .trim()
                    .optional()
                    .nullable(),

                shippingAddress: z
                    .string()
                    .trim()
                    .optional()
                    .nullable(),

                city: z
                    .string()
                    .trim()
                    .max(100)
                    .optional()
                    .nullable(),

                state: z
                    .string()
                    .trim()
                    .max(100)
                    .optional()
                    .nullable(),

                pincode: z
                    .string()
                    .trim()
                    .max(20)
                    .optional()
                    .nullable(),

                openingBalance: z
                    .coerce
                    .number()
                    .min(0)
                    .optional(),

                creditLimit: z
                    .coerce
                    .number()
                    .min(0)
                    .optional()
                    .nullable(),

                paymentTerms: z
                    .coerce
                    .number()
                    .int()
                    .min(0)
                    .optional()
                    .nullable(),

                isWalkIn: z
                    .boolean()
                    .optional(),

                isActive: z
                    .boolean()
                    .optional(),
            })
            .refine(
                (data) => Object.keys(data).length > 0,
                {
                    message: 'At least one field is required',
                }
            ),
    },

    getById: {
        params: z.object({
            id: z.string().uuid('Invalid customer id'),
        }),
    },

    delete: {
        params: z.object({
            id: z.string().uuid('Invalid customer id'),
        }),
    },
};

export default CustomerValidationSchemas;