import api from "@/lib/axios";

const resourceApi = (endpoint) => ({
  getAll: async (params = {}) => {
    const response = await api.get(endpoint, { params });
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`${endpoint}/${id}`);
    return response.data;
  },
  create: async (payload) => {
    const response = await api.post(endpoint, payload);
    return response.data;
  },
  update: async ({ id, payload }) => {
    const response = await api.patch(`${endpoint}/${id}`, payload);
    return response.data;
  },
  remove: async (id) => {
    const response = await api.delete(`${endpoint}/${id}`);
    return response.data;
  },
});

export const salesApi = resourceApi("/sales");
export const purchasesApi = resourceApi("/purchases");
export const productsApi = resourceApi("/products");
export const paymentsApi = resourceApi("/payments");
export const salesReturnsApi = resourceApi("/sales-returns");
export const purchaseReturnsApi = resourceApi("/purchase-returns");
export const stockMovementsApi = resourceApi("/stock-movements");
export const warehouseStockApi = resourceApi("/warehouse-stocks");

export const reportsApi = {
  getSummary: async (params = {}) => {
    const response = await api.get("/payments/report", { params });
    return response.data;
  },
};
