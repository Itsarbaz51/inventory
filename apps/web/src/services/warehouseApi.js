import api from "@/lib/axios";

export const getWarehouses = async (params) => {
  const response = await api.get("/warehouses", {
    params,
  });

  return response.data;
};

export const createWarehouse = async (payload) => {
  const response = await api.post("/warehouses", payload);

  return response.data;
};

export const updateWarehouse = async (id, payload) => {
  const response = await api.patch(`/warehouses/${id}`, payload);

  return response.data;
};

export const deleteWarehouse = async (id) => {
  const response = await api.delete(`/warehouses/${id}`);

  return response.data;
};

export const getWarehouseById = async (id) => {
  const response = await api.get(`/warehouses/${id}`);

  return response.data;
};
