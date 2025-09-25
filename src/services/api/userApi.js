import apiClient from "./apiClient";

// User API endpoints for preferences and saved items
const userApi = {
  // Get user profile and preferences
  getProfile: async () => {
    const response = await apiClient.get("/user/profile");
    return response.data;
  },

  // Update user profile
  updateProfile: async (userData) => {
    const response = await apiClient.put("/user/profile", userData);
    return response.data;
  },

  // Saved rooms management
  getSavedRooms: async () => {
    const response = await apiClient.get("/user/saved-rooms");
    return response.data;
  },

  saveRoom: async (roomId) => {
    const response = await apiClient.post("/user/saved-rooms", { roomId });
    return response.data;
  },

  unsaveRoom: async (roomId) => {
    const response = await apiClient.delete(`/user/saved-rooms/${roomId}`);
    return response.data;
  },

  // User activity/notifications
  getActivities: async () => {
    const response = await apiClient.get("/user/activities");
    return response.data;
  },

  markActivityAsRead: async (activityId) => {
    const response = await apiClient.put(`/user/activities/${activityId}/read`);
    return response.data;
  },

  // Search history
  getSearchHistory: async () => {
    const response = await apiClient.get("/user/search-history");
    return response.data;
  },

  saveSearchQuery: async (query) => {
    const response = await apiClient.post("/user/search-history", { query });
    return response.data;
  },
};

export default userApi;
