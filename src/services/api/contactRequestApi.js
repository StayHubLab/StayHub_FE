import apiClient from "./apiClient";

const contactRequestApi = {
  getAll: async (params = {}) => {
    const response = await apiClient.get("/contact-requests", { params });
    return response.data;
  },
  create: async (payload) => {
    const response = await apiClient.post(`/contact-requests`, payload);
    return response.data;
  },
  approve: async (id) => {
    // Set status=true
    const response = await apiClient.put(`/contact-requests/${id}/approve`);
    return response.data;
  },
  signAsTenant: async (id, signature) => {
    const response = await apiClient.put(`/contact-requests/${id}/sign`, {
      signature,
    });
    return response.data;
  },
};

export default contactRequestApi;
