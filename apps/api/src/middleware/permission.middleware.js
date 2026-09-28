import Prisma from '../database/db.js';
import { ApiError } from '../utils/ApiError.js';

class PermissionMiddleware {
    static check(permission) {
        return async (req, res, next) => {
            try {
                if (!req.user) {
                    throw new ApiError(401, 'Authentication required');
                }

                const { id: userId, tenantId } = req.user;

                if (!userId) {
                    throw new ApiError(401, 'User not found');
                }

                if (!tenantId) {
                    throw new ApiError(401, 'Tenant not found');
                }

                const [module, action] = permission.split('.');

                if (!module || !action) {
                    throw new ApiError(
                        500,
                        `Invalid permission format: ${permission}`,
                    );
                }

                const user = await Prisma.user.findFirst({
                    where: {
                        id: userId,
                        tenantId,
                        status: 'ACTIVE',
                    },

                    select: {
                        id: true,
                        roleId: true,

                        role: {
                            select: {
                                id: true,
                                name: true,
                                isSystem: true,

                                rolePermissions: {
                                    where: {
                                        permission: {
                                            module,
                                            action,
                                        },
                                    },

                                    select: {
                                        permission: {
                                            select: {
                                                id: true,
                                                module: true,
                                                action: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                });

                if (!user) {
                    throw new ApiError(401, 'User not found or inactive');
                }

                if (!user.role) {
                    throw new ApiError(403, 'No role assigned to user');
                }

                // ==========================================
                // SUPER ADMIN
                // ==========================================

                if (user.role.name === 'SUPER_ADMIN') {
                    req.permission = permission;
                    return next();
                }

                // ==========================================
                // NORMAL ROLE PERMISSION CHECK
                // ==========================================

                const hasPermission =
                    user.role.rolePermissions.length > 0;

                if (!hasPermission) {
                    throw new ApiError(
                        403,
                        `Permission denied: ${permission}`,
                    );
                }

                req.permission = permission;

                next();
            } catch (error) {
                next(error);
            }
        };
    }
}

export default PermissionMiddleware;