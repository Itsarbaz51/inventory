import api from "@/lib/axios";

const userService = {
  // GET ALL
  getAll: async (params = {}) => {
    const response = await api.get("/users", {
      params,
    });

    return response.data;
  },

  // GET BY ID
  getById: async (id) => {
    const response = await api.get(`/users/${id}`);

    return response.data;
  },

  // CREATE
  create: async (payload) => {
    const response = await api.post("/users", payload);

    return response.data;
  },

  // UPDATE
  update: async ({ id, payload }) => {
    const response = await api.patch(`/users/${id}`, payload);

    return response.data;
  },

  // DELETE
  delete: async (id) => {
    const response = await api.delete(`/users/${id}`);

    return response.data;
  },
};

export default userService;
