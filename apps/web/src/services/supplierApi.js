import api from "@/lib/axios";

const supplierService = {
  // =====================================================
  // GET ALL
  // =====================================================

  getAll: async (params = {}) => {
    const response = await api.get("/suppliers", {
      params,
    });

    return response.data;
  },

  // =====================================================
  // GET BY ID
  // =====================================================

  getById: async (id) => {
    const response = await api.get(`/suppliers/${id}`);

    return response.data;
  },

  // =====================================================
  // CREATE
  // =====================================================

  create: async (payload) => {
    const response = await api.post("/suppliers", payload);

    return response.data;
  },

  // =====================================================
  // UPDATE
  // =====================================================

  update: async ({ id, payload }) => {
    const response = await api.patch(`/suppliers/${id}`, payload);

    return response.data;
  },

  // =====================================================
  // DELETE
  // =====================================================

  delete: async (id) => {
    const response = await api.delete(`/suppliers/${id}`);

    return response.data;
  },
};

export default supplierService;
