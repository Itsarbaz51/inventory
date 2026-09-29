import api from "@/lib/axios";

export const getCategoriesApi = async (params = {}) => {
  const response = await api.get("/categories", {
    params,
  });

  return response.data;
};

export const getCategoryByIdApi = async (id) => {
  const response = await api.get(`/categories/${id}`);

  return response.data;
};

export const createCategoryApi = async (payload) => {
  const response = await api.post("/categories", payload);

  return response.data;
};

export const updateCategoryApi = async ({ id, payload }) => {
  const response = await api.put(`/categories/${id}`, payload);

  return response.data;
};

export const deleteCategoryApi = async (id) => {
  const response = await api.delete(`/categories/${id}`);

  return response.data;
};
