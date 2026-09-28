import api from "@/lib/axios";

const tenantService = {
    getAll: async ({
        page = 1,
        limit = 10,
        search = "",
        status,
    } = {}) => {
        const response = await api.get("/tenants", {
            params: {
                page,
                limit,

                ...(search?.trim() && {
                    search: search.trim(),
                }),

                ...(status && {
                    status,
                }),
            },
        });

        return response.data;
    },

    create: async (payload) => {
        const response = await api.post("/tenants", payload);
        return response.data;
    },

    update: async (id, payload) => {
        const response = await api.patch(`/tenants/${id}`, payload);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/tenants/${id}`);
        return response.data;
    },
};

export default tenantService;
