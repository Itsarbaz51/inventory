import api from "@/lib/axios";

const purchaseService = {
    getAll: async (params = {}) => {
        const response = await api.get("/purchases", { params });
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/purchases/${id}`);
        return response.data;
    },

    create: async (payload) => {
        const response = await api.post("/purchases", payload);
        return response.data;
    },

    update: async (id, payload) => {
        const response = await api.patch(`/purchases/${id}`, payload);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/purchases/${id}`);
        return response.data;
    },
};

export default purchaseService;