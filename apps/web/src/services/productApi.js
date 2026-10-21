import api from "@/lib/axios";

const productService = {
    // =====================================================
    // GET ALL PRODUCTS
    // =====================================================
    getAll: async (params = {}) => {
        const response = await api.get("/products", {
            params,
        });

        return response.data;
    },

    // =====================================================
    // GET PRODUCT BY ID
    // =====================================================
    getById: async (id) => {
        const response = await api.get(`/products/${id}`);

        return response.data;
    },

    // =====================================================
    // CREATE PRODUCT
    // =====================================================
    create: async (payload) => {
        const response = await api.post("/products", payload);

        return response.data;
    },

    // =====================================================
    // UPDATE PRODUCT
    // =====================================================
    update: async ({ id, payload }) => {
        const response = await api.patch(`/products/${id}`, payload);

        return response.data;
    },

    // =====================================================
    // DELETE PRODUCT
    // =====================================================
    delete: async (id) => {
        const response = await api.delete(`/products/${id}`);

        return response.data;
    },
};

export default productService;