import api from "@/lib/axios";

// =====================================================
// GET ALL UNITS
// =====================================================

export const getUnitsApi = async (params = {}) => {
    const response = await api.get("/units", {
        params,
    });

    return response.data;
};

// =====================================================
// GET UNIT BY ID
// =====================================================

export const getUnitByIdApi = async (id) => {
    const response = await api.get(`/units/${id}`);

    return response.data;
};

// =====================================================
// CREATE UNIT
// =====================================================

export const createUnitApi = async (payload) => {
    const response = await api.post("/units", payload);

    return response.data;
};

// =====================================================
// UPDATE UNIT
// =====================================================

export const updateUnitApi = async ({ id, payload }) => {
    const response = await api.patch(`/units/${id}`, payload);

    return response.data;
};

// =====================================================
// DELETE UNIT
// =====================================================

export const deleteUnitApi = async (id) => {
    const response = await api.delete(`/units/${id}`);

    return response.data;
};
