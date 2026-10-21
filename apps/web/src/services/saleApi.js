import api from "@/lib/axios";

const saleService = {
  getAll: async (params = {}) => {
    const response = await api.get("/sales", {
      params,
    });

    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/sales/${id}`);

    return response.data;
  },

  create: async (payload) => {
    const response = await api.post(
      "/sales",
      payload,
    );

    return response.data;
  },

  update: async (id, payload) => {
    const response = await api.patch(
      `/sales/${id}`,
      payload,
    );

    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(
      `/sales/${id}`,
    );

    return response.data;
  },
};

export default saleService;