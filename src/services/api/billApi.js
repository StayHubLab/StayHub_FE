import apiClient from "./apiClient";

const billApi = {
  create: async (payload) => {
    const response = await apiClient.post("/bills", payload);
    return response.data;
  },
  pay: async (id, payload = {}) => {
    const response = await apiClient.put(`/bills/${id}/pay`, payload);
    return response.data;
  },
  listByRenter: async (renterId, params = {}) => {
    const response = await apiClient.get(`/bills/renter/${renterId}`, {
      params,
    });
    return response.data;
  },
  getVnpayUrl: async (billId) => {
    const response = await apiClient.get(`/payments/vnpay/create`, {
      params: { billId },
    });
    return response.data;
  },
  // Get bills for landlord (all bills from landlord's properties)
  listByHost: async (hostId, params = {}) => {
    const response = await apiClient.get(`/bills/host/${hostId}`, {
      params,
    });
    return response.data;
  },
};

export default billApi;
