import api from "@/lib/axios";

const permissionService = {
  getAll: async () => {
    const response = await api.get("/permissions");
    return response.data;
  },

  getRolePermissions: async (roleId) => {
    const response = await api.get(`/permissions/role/${roleId}`);
    return response.data;
  },

  updateRolePermissions: async (roleId, permissionIds) => {
    const response = await api.put(`/permissions/role/${roleId}`, {
      permissionIds,
    });

    return response.data;
  },
};

export default permissionService;
