import api from "@/lib/axios";

const categoryService = {
  getAll: async () => {
    const response = await api.get("/categories");
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  create: async (payload) => {
    const response = await api.post("/categories", payload);
    return response.data;
  },

  update: async (id, payload) => {
    const response = await api.put(`/categories/${id}`, payload);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
};

export default categoryService;
