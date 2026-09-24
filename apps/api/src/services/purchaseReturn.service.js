import { ApiError } from '../utils/ApiError.js';
import Prisma from '../database/db.js';

class PurchaseReturnServices {
    // =====================================================
    // CREATE
    // =====================================================

    static async create(payload, req) {
        const tenantId = req.user?.tenantId;
        const userId = req.user?.id;

        if (!tenantId) {
            throw new ApiError(401, 'Tenant not found');
        }

        if (!userId) {
            throw new ApiError(401, 'User not found');
        }

        const {
            supplierId,
            purchaseId,
            returnNumber,
            returnDate,
            totalAmount = 0,
            status = 'DRAFT',
            reason,
            items,
        } = payload;

        // Check supplier belongs to tenant
        const supplier = await Prisma.supplier.findFirst({
            where: {
                id: supplierId,
                tenantId,
            },
        });

        if (!supplier) {
            throw new ApiError(404, 'Supplier not found');
        }

        // Check purchase if provided
        if (purchaseId) {
            const purchase = await Prisma.purchase.findFirst({
                where: {
                    id: purchaseId,
                    tenantId,
                    supplierId,
                },
            });

            if (!purchase) {
                throw new ApiError(
                    404,
                    'Purchase not found for this supplier',
                );
            }
        }

        // Duplicate return number
        const existingReturn =
            await Prisma.purchaseReturn.findFirst({
                where: {
                    tenantId,
                    returnNumber: returnNumber.trim(),
                },
            });

        if (existingReturn) {
            throw new ApiError(
                409,
                `Purchase return "${returnNumber}" already exists`,
            );
        }

        // Validate products
        for (const item of items) {
            const product = await Prisma.product.findFirst({
                where: {
                    id: item.productId,
                    tenantId,
                },
            });

            if (!product) {
                throw new ApiError(
                    404,
                    `Product ${item.productId} not found`,
                );
            }
        }

        const purchaseReturn =
            await Prisma.purchaseReturn.create({
                data: {
                    tenantId,
                    supplierId,
                    purchaseId: purchaseId || null,
                    createdById: userId,

                    returnNumber: returnNumber.trim(),
                    returnDate,

                    totalAmount,
                    status,

                    reason: reason?.trim() || null,

                    items: {
                        create: items.map((item) => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            rate: item.rate,
                            total:
                                item.total ??
                                Number(item.quantity) * Number(item.rate),
                        })),
                    },
                },

                include: {
                    supplier: true,
                    purchase: true,
                    createdBy: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                    items: {
                        include: {
                            product: true,
                        },
                    },
                },
            });

        return purchaseReturn;
    }

    // =====================================================
    // UPDATE
    // =====================================================

    static async update(payload, req) {
        const tenantId = req.user?.tenantId;

        if (!tenantId) {
            throw new ApiError(401, 'Tenant not found');
        }

        const { id } = payload;

        if (!id) {
            throw new ApiError(
                400,
                'Purchase return id is required',
            );
        }

        const existingReturn =
            await Prisma.purchaseReturn.findFirst({
                where: {
                    id,
                    tenantId,
                },
                include: {
                    items: true,
                },
            });

        if (!existingReturn) {
            throw new ApiError(
                404,
                'Purchase return not found',
            );
        }

        const {
            supplierId,
            purchaseId,
            returnNumber,
            returnDate,
            totalAmount,
            status,
            reason,
            items,
        } = req.body;

        // Supplier validation
        if (supplierId) {
            const supplier = await Prisma.supplier.findFirst({
                where: {
                    id: supplierId,
                    tenantId,
                },
            });

            if (!supplier) {
                throw new ApiError(404, 'Supplier not found');
            }
        }

        // Purchase validation
        if (purchaseId) {
            const finalSupplierId =
                supplierId || existingReturn.supplierId;

            const purchase = await Prisma.purchase.findFirst({
                where: {
                    id: purchaseId,
                    tenantId,
                    supplierId: finalSupplierId,
                },
            });

            if (!purchase) {
                throw new ApiError(
                    404,
                    'Purchase not found for this supplier',
                );
            }
        }

        // Duplicate return number
        if (returnNumber !== undefined) {
            const duplicate =
                await Prisma.purchaseReturn.findFirst({
                    where: {
                        tenantId,
                        returnNumber: returnNumber.trim(),
                        NOT: {
                            id,
                        },
                    },
                });

            if (duplicate) {
                throw new ApiError(
                    409,
                    `Purchase return "${returnNumber}" already exists`,
                );
            }
        }

        // Update items
        if (items !== undefined) {
            for (const item of items) {
                const product = await Prisma.product.findFirst({
                    where: {
                        id: item.productId,
                        tenantId,
                    },
                });

                if (!product) {
                    throw new ApiError(
                        404,
                        `Product ${item.productId} not found`,
                    );
                }
            }
        }

        const updatedReturn =
            await Prisma.$transaction(async (tx) => {
                if (items !== undefined) {
                    await tx.purchaseReturnItem.deleteMany({
                        where: {
                            purchaseReturnId: id,
                        },
                    });
                }

                return tx.purchaseReturn.update({
                    where: {
                        id,
                    },

                    data: {
                        ...(supplierId !== undefined && {
                            supplierId,
                        }),

                        ...(purchaseId !== undefined && {
                            purchaseId,
                        }),

                        ...(returnNumber !== undefined && {
                            returnNumber: returnNumber.trim(),
                        }),

                        ...(returnDate !== undefined && {
                            returnDate,
                        }),

                        ...(totalAmount !== undefined && {
                            totalAmount,
                        }),

                        ...(status !== undefined && {
                            status,
                        }),

                        ...(reason !== undefined && {
                            reason: reason?.trim() || null,
                        }),

                        ...(items !== undefined && {
                            items: {
                                create: items.map((item) => ({
                                    productId: item.productId,
                                    quantity: item.quantity,
                                    rate: item.rate,
                                    total:
                                        item.total ??
                                        Number(item.quantity) *
                                        Number(item.rate),
                                })),
                            },
                        }),
                    },

                    include: {
                        supplier: true,
                        purchase: true,
                        createdBy: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                        items: {
                            include: {
                                product: true,
                            },
                        },
                    },
                });
            });

        return updatedReturn;
    }

    // =====================================================
    // GET BY ID
    // =====================================================

    static async getById(payload, req) {
        const tenantId = req.user?.tenantId;

        if (!tenantId) {
            throw new ApiError(401, 'Tenant not found');
        }

        const { id } = payload;

        const purchaseReturn =
            await Prisma.purchaseReturn.findFirst({
                where: {
                    id,
                    tenantId,
                },

                include: {
                    supplier: true,

                    purchase: {
                        select: {
                            id: true,
                            purchaseNumber: true,
                            purchaseDate: true,
                            grandTotal: true,
                        },
                    },

                    createdBy: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },

                    items: {
                        include: {
                            product: {
                                select: {
                                    id: true,
                                    name: true,
                                    sku: true,
                                    barcode: true,
                                },
                            },
                        },
                    },
                },
            });

        if (!purchaseReturn) {
            throw new ApiError(
                404,
                'Purchase return not found',
            );
        }

        return purchaseReturn;
    }

    // =====================================================
    // GET ALL
    // =====================================================

    static async getAll(payload, req) {
        const tenantId = req.user?.tenantId;

        if (!tenantId) {
            throw new ApiError(401, 'Tenant not found');
        }

        const {
            page = 1,
            limit = 10,
            search,
            status,
            supplierId,
            purchaseId,
        } = payload;

        const skip = (page - 1) * limit;

        const where = {
            tenantId,

            ...(status && {
                status,
            }),

            ...(supplierId && {
                supplierId,
            }),

            ...(purchaseId && {
                purchaseId,
            }),

            ...(search && {
                OR: [
                    {
                        returnNumber: {
                            contains: search,
                        },
                    },
                    {
                        reason: {
                            contains: search,
                        },
                    },
                ],
            }),
        };

        const [returns, total] =
            await Prisma.$transaction([
                Prisma.purchaseReturn.findMany({
                    where,

                    skip,
                    take: limit,

                    orderBy: {
                        createdAt: 'desc',
                    },

                    include: {
                        supplier: {
                            select: {
                                id: true,
                                name: true,
                                companyName: true,
                                phone: true,
                            },
                        },

                        purchase: {
                            select: {
                                id: true,
                                purchaseNumber: true,
                            },
                        },

                        createdBy: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },

                        _count: {
                            select: {
                                items: true,
                            },
                        },
                    },
                }),

                Prisma.purchaseReturn.count({
                    where,
                }),
            ]);

        return {
            data: returns,

            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    // =====================================================
    // DELETE
    // =====================================================

    static async delete(payload, req) {
        const tenantId = req.user?.tenantId;

        if (!tenantId) {
            throw new ApiError(401, 'Tenant not found');
        }

        const { id } = payload;

        const purchaseReturn =
            await Prisma.purchaseReturn.findFirst({
                where: {
                    id,
                    tenantId,
                },
            });

        if (!purchaseReturn) {
            throw new ApiError(
                404,
                'Purchase return not found',
            );
        }

        if (purchaseReturn.status === 'COMPLETED') {
            throw new ApiError(
                400,
                'Completed purchase return cannot be deleted',
            );
        }

        await Prisma.purchaseReturn.delete({
            where: {
                id,
            },
        });

        return null;
    }
}

export default PurchaseReturnServices;