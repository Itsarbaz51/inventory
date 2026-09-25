import api from "@/lib/axios";

const roleService = {
  getAll: async () => {
    const response = await api.get("/roles");
    return response.data;
  },

  create: async (payload) => {
    const response = await api.post("/roles", payload);
    return response.data;
  },

  update: async (id, payload) => {
    const response = await api.patch(`/roles/${id}`, payload);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/roles/${id}`);
    return response.data;
  },
};

export default roleService;
