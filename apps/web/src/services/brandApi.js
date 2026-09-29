import api from "@/lib/axios";

// =====================================================
// GET ALL BRANDS
// =====================================================

export const getBrandsApi = async (params = {}) => {
    const response = await api.get("/brands", {
        params,
    });

    return response.data;
};

// =====================================================
// GET BRAND BY ID
// =====================================================

export const getBrandByIdApi = async (id) => {
    const response = await api.get(`/brands/${id}`);

    return response.data;
};

// =====================================================
// CREATE BRAND
// =====================================================

export const createBrandApi = async (payload) => {
    const response = await api.post("/brands", payload);

    return response.data;
};

// =====================================================
// UPDATE BRAND
// =====================================================

export const updateBrandApi = async ({ id, payload }) => {
    const response = await api.patch(
        `/brands/${id}`,
        payload,
    );

    return response.data;
};

// =====================================================
// DELETE BRAND
// =====================================================

export const deleteBrandApi = async (id) => {
    const response = await api.delete(
        `/brands/${id}`,
    );

    return response.data;
};