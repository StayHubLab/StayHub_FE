import apiClient from "./apiClient";

// Auth API endpoints
const authApi = {
  // Public endpoints
  login: async (credentials) => {
    const response = await apiClient.post("/auth/login", credentials);
    return response.data;
  },

  register: async (userData) => {
    const response = await apiClient.post("/auth/register", userData);
    return response.data;
  },

  sendVerificationCode: async (email) => {
    const response = await apiClient.post("/auth/send-verification-code", {
      email,
    });
    return response.data;
  },

  verifyEmail: async (token) => {
    const response = await apiClient.get(`/auth/verify-email/${token}`);
    return response.data;
  },

  resendVerificationEmail: async (email) => {
    const response = await apiClient.post("/auth/resend-verification-email", {
      email,
    });
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await apiClient.post("/auth/forgot-password", { email });
    return response.data;
  },

  resetPassword: async (data) => {
    const response = await apiClient.post("/auth/reset-password", data);
    return response.data;
  },

  refreshToken: async (refreshToken) => {
    const response = await apiClient.post("/auth/refresh-token", {
      refreshToken,
    });
    return response.data;
  },

  // Protected endpoints
  sendVerificationEmail: async () => {
    const response = await apiClient.post("/auth/send-verification-email");
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post("/auth/logout");
    return response.data;
  },

  getProfile: async () => {
    const response = await apiClient.get("/auth/profile");
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await apiClient.put("/auth/profile", profileData);
    return response.data;
  },

  changePassword: async (passwordData) => {
    const response = await apiClient.post(
      "/auth/change-password",
      passwordData
    );
    return response.data;
  },

  revokeToken: async (tokenData) => {
    const response = await apiClient.post("/auth/revoke-token", tokenData);
    return response.data;
  },
};

export default authApi;
