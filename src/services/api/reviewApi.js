import apiClient from "./apiClient";

const reviewApi = {
  getRoomReviews: async (roomId, options = {}) => {
    const { page = 1, limit = 10 } = options;
    const response = await apiClient.get(
      `/api/reviews/room/${roomId}?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  getLandlordReviews: async (landlordId, options = {}) => {
    const { page = 1, limit = 10 } = options;
    const response = await apiClient.get(
      `/api/reviews/landlord/${landlordId}?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  getRenterReviews: async (renterId) => {
    const response = await apiClient.get(`/api/reviews/renter/${renterId}`);
    return response.data;
  },

  createReview: async (reviewData) => {
    const response = await apiClient.post("/api/reviews", reviewData);
    return response.data;
  },
};

export default reviewApi;
