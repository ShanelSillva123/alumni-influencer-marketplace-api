import apiClient from "./apiClient";

export const getAllProfiles = async () => {
    const response = await apiClient.get("/profiles");
    return response.data;
};