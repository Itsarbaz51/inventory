import { z } from 'zod';

const PermissionValidationSchemas = {
    // ==========================================
    // GET ROLE PERMISSIONS
    // ==========================================

    getRolePermissions: {
        params: z.object({
            roleId: z.string().uuid('Invalid role id'),
        }),
    },

    // ==========================================
    // UPDATE ROLE PERMISSIONS
    // ==========================================

    updateRolePermissions: {
        params: z.object({
            roleId: z.string().uuid('Invalid role id'),
        }),

        body: z.object({
            permissions: z
                .array(
                    z.object({
                        permissionId: z.string().uuid('Invalid permission id'),
                    }),
                )
                .default([]),
        }),
    },
};

export default PermissionValidationSchemas;