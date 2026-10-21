import api from "@/lib/axios";

const stockMovementService = {
    // =====================================================
    // GET ALL
    // =====================================================

    getAll: async (params = {}) => {
        const response = await api.get("/stock-movements", {
            params,
        });

        return response.data;
    },

    // =====================================================
    // GET BY ID
    // =====================================================

    getById: async (id) => {
        const response = await api.get(`/stock-movements/${id}`);

        return response.data;
    },

    // =====================================================
    // CREATE
    // =====================================================

    create: async (payload) => {
        const response = await api.post(
            "/stock-movements",
            payload,
        );

        return response.data;
    },

    // =====================================================
    // DELETE
    // =====================================================

    delete: async (id) => {
        const response = await api.delete(
            `/stock-movements/${id}`,
        );

        return response.data;
    },
};

export default stockMovementService;