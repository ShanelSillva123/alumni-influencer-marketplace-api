import apiClient from "./apiClient";

export const loginUser = async (payload) => {
    const response = await apiClient.post("/auth/login", payload);
    return response.data;
};

export const registerUser = async (payload) => {
    const response = await apiClient.post("/auth/register", payload);
    return response.data;
};

export const forgotPassword = async (payload) => {
    const response = await apiClient.post("/auth/forgot-password", payload);
    return response.data;
};

export const resetPassword = async (payload) => {
    const response = await apiClient.post("/auth/reset-password", payload);
    return response.data;
};

export const getCurrentUser = async () => {
    const response = await apiClient.get("/auth/me");
    return response.data;
};

export const logoutUser = async () => {
    const response = await apiClient.post("/auth/logout");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return response.data;
};