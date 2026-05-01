import apiClient from "./apiClient";

export const getMyDashboardAnalytics = async () => {
    const response = await apiClient.get("/analytics/my-dashboard");
    return response.data;
};