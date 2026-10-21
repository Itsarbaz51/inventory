import api from "@/lib/axios";

const purchaseReturnService = {
  getAll: async (params = {}) => {
    const response = await api.get("/purchase-returns", {
      params,
    });

    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(
      `/purchase-returns/${id}`,
    );

    return response.data;
  },

  create: async (payload) => {
    const response = await api.post(
      "/purchase-returns",
      payload,
    );

    return response.data;
  },

  update: async (id, payload) => {
    const response = await api.put(
      `/purchase-returns/${id}`,
      payload,
    );

    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(
      `/purchase-returns/${id}`,
    );

    return response.data;
  },
};

export default purchaseReturnService;