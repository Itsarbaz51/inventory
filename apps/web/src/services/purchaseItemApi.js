import api from "@/lib/axios";

const purchaseItemService = {
  getAll: async (params = {}) => {
    const response = await api.get("/purchase-items", { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/purchase-items/${id}`);
    return response.data;
  },

  create: async (payload) => {
    const response = await api.post("/purchase-items", payload);
    return response.data;
  },

  update: async (id, payload) => {
    const response = await api.patch(
      `/purchase-items/${id}`,
      payload,
    );
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(
      `/purchase-items/${id}`,
    );
    return response.data;
  },
};

export default purchaseItemService;