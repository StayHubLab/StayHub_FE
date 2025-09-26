// Export all API modules
export { default as apiClient } from "./apiClient";
export { default as authApi } from "./authApi";
export { default as userApi } from "./userApi";
export { default as roomApi } from "./roomApi";
export { default as bookingApi } from "./bookingApi";
export { default as buildingApi } from "./buildingApi";
export { default as savedRoomApi } from "./savedRoomApi";
export { default as viewingApi } from "./viewingApi";
export { default as notificationApi } from "./notificationApi";
export { default as reviewApi } from "./reviewApi";
export { default as tenantApi } from "./tenantApi";
export { default as dashboardApi } from "./dashboardApi";
export { default as vietnamProvinceApi } from "./vietnamProvinceApi";

// Helper functions for API error handling
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    return {
      status: error.response.status,
      message:
        error.response.data?.error ||
        error.response.data?.message ||
        "An error occurred",
      data: error.response.data,
    };
  } else if (error.request) {
    // Request was made but no response received
    return {
      status: 0,
      message: "Network error - unable to connect to server",
      data: null,
    };
  } else {
    // Something happened in setting up the request
    return {
      status: -1,
      message: error.message || "An unexpected error occurred",
      data: null,
    };
  }
};
