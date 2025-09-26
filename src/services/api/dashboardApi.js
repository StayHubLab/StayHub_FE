import apiClient from "./apiClient";

const dashboardApi = {
  // Get business overview statistics for landlord dashboard
  getBusinessOverview: async () => {
    try {
      const response = await apiClient.get("/dashboard/business-overview");
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Get business overview error:", error);
      return {
        success: false,
        message:
          error.response?.data?.message || "Không thể tải dữ liệu tổng quan",
        error,
      };
    }
  },

  // Get room statistics
  getRoomStatistics: async () => {
    try {
      const response = await apiClient.get("/dashboard/room-statistics");
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Get room statistics error:", error);
      return {
        success: false,
        message:
          error.response?.data?.message || "Không thể tải thống kê phòng",
        error,
      };
    }
  },

  // Get revenue statistics
  getRevenueStatistics: async (params = {}) => {
    try {
      const response = await apiClient.get("/dashboard/revenue-statistics", {
        params,
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Get revenue statistics error:", error);
      return {
        success: false,
        message:
          error.response?.data?.message || "Không thể tải thống kê doanh thu",
        error,
      };
    }
  },

  // Get tenant statistics
  getTenantStatistics: async () => {
    try {
      const response = await apiClient.get("/dashboard/tenant-statistics");
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Get tenant statistics error:", error);
      return {
        success: false,
        message:
          error.response?.data?.message || "Không thể tải thống kê khách thuê",
        error,
      };
    }
  },

  // Get booking statistics
  getBookingStatistics: async (params = {}) => {
    try {
      const response = await apiClient.get("/dashboard/booking-statistics", {
        params,
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Get booking statistics error:", error);
      return {
        success: false,
        message:
          error.response?.data?.message || "Không thể tải thống kê đặt phòng",
        error,
      };
    }
  },

  // Get recent activities
  getRecentActivities: async (params = {}) => {
    try {
      const { limit = 10, page = 1 } = params;
      const response = await apiClient.get("/dashboard/recent-activities", {
        params: { limit, page },
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Get recent activities error:", error);
      return {
        success: false,
        message:
          error.response?.data?.message || "Không thể tải hoạt động gần đây",
        error,
      };
    }
  },
};

export default dashboardApi;
