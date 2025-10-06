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
  
  // ========== MANUAL PAYMENT VERIFICATION APIs ==========
  
  /**
   * Upload payment evidence (Renter)
   * @param {string} billId - Bill ID
   * @param {FormData} formData - Form data containing file
   */
  uploadPaymentEvidence: async (billId, formData) => {
    // Add billId to FormData if not already present
    if (!formData.has('billId')) {
      formData.append('billId', billId);
    }
    const response = await apiClient.post('/payments/upload-evidence', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Get renter's payment history
   * @param {string} status - Optional status filter
   */
  getMyPayments: async (status = null) => {
    const params = status ? { status } : {};
    const response = await apiClient.get('/payments/my-payments', { params });
    return response.data;
  },

  /**
   * Get payment details
   * @param {string} paymentId - Payment/Bill ID
   */
  getPaymentDetails: async (paymentId) => {
    const response = await apiClient.get(`/payments/${paymentId}`);
    return response.data;
  },

  /**
   * Get payments by status (Landlord)
   * @param {string} status - pending_approval | approved | rejected
   */
  getPaymentsByStatus: async (status) => {
    const response = await apiClient.get(`/payments/status/${status}`);
    return response.data;
  },

  /**
   * Approve payment (Landlord)
   * @param {string} paymentId - Payment/Bill ID
   * @param {string} notes - Optional notes
   */
  approvePayment: async (paymentId, notes = '') => {
    const response = await apiClient.put(`/payments/${paymentId}/approve`, { notes });
    return response.data;
  },

  /**
   * Reject payment (Landlord)
   * @param {string} paymentId - Payment/Bill ID
   * @param {string} reason - Rejection reason
   */
  rejectPayment: async (paymentId, reason) => {
    const response = await apiClient.put(`/payments/${paymentId}/reject`, { reason });
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
