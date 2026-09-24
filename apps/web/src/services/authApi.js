import api from "@/lib/axios";

export const loginApi = async (payload) => {
    const response = await api.post("/auth/login", payload);

    return response.data;
};

export const getMeApi = async () => {
    const response = await api.get("/auth/");

    return response.data;
};

export const logoutApi = async () => {
    const response = await api.post("/auth/logout");

    return response.data;
};