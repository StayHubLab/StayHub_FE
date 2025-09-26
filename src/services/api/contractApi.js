import apiClient from "./apiClient";

const contractApi = {
  create: async (payload) => {
    const response = await apiClient.post("/contracts", payload);
    return response.data;
  },
  getByUser: async (userId, params = {}) => {
    const response = await apiClient.get(`/contracts/user/${userId}`, {
      params,
    });
    return response.data;
  },
  getByHost: async (hostId, params = {}) => {
    const response = await apiClient.get(`/contracts/host/${hostId}`, {
      params,
    });
    return response.data;
  },
  updateSignatures: async (id, payload) => {
    const response = await apiClient.put(
      `/contracts/${id}/signatures`,
      payload
    );
    return response.data;
  },
};

export default contractApi;
