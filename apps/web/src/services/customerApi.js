import api from "@/lib/axios";

const customerService = {
  // GET ALL
  getAll: async (params = {}) => {
    const response = await api.get("/customers", {
      params,
    });

    return response.data;
  },

  // GET BY ID
  getById: async (id) => {
    const response = await api.get(`/customers/${id}`);

    return response.data;
  },

  // CREATE
  create: async (payload) => {
    const response = await api.post("/customers", payload);

    return response.data;
  },

  // UPDATE
  update: async ({ id, payload }) => {
    const response = await api.patch(`/customers/${id}`, payload);

    return response.data;
  },

  // DELETE
  delete: async (id) => {
    const response = await api.delete(`/customers/${id}`);

    return response.data;
  },
};

export default customerService;
