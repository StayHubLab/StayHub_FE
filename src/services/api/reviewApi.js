import apiClient from "./apiClient";

const reviewApi = {
  /**
   * Get reviews for a specific room
   * @param {string} roomId - Room ID
   * @param {object} options - Query options (page, limit, sort)
   */
  getRoomReviews: async (roomId, options = {}) => {
    const { page = 1, limit = 10, sort = '-createdAt' } = options;
    const response = await apiClient.get(
      `/reviews/room/${roomId}?page=${page}&limit=${limit}&sort=${sort}`
    );
    return response.data;
  },

  /**
   * Get reviews for a specific landlord
   * @param {string} landlordId - Landlord ID
   * @param {object} options - Query options (page, limit, sort)
   */
  getLandlordReviews: async (landlordId, options = {}) => {
    const { page = 1, limit = 10, sort = '-createdAt' } = options;
    const response = await apiClient.get(
      `/reviews/landlord/${landlordId}?page=${page}&limit=${limit}&sort=${sort}`
    );
    return response.data;
  },

  /**
   * Get landlord statistics
   * @param {string} landlordId - Landlord ID
   */
  getLandlordStats: async (landlordId) => {
    const response = await apiClient.get(`/reviews/landlord/${landlordId}/stats`);
    return response.data;
  },

  /**
   * Get reviews created by a specific renter
   * @param {string} renterId - Renter ID
   */
  getRenterReviews: async (renterId) => {
    const response = await apiClient.get(`/reviews/renter/${renterId}`);
    return response.data;
  },

  /**
   * Create a new review (Room or Landlord)
   * @param {object} reviewData - Review data
   * @param {string} reviewData.targetType - 'room' or 'landlord'
   * @param {string} reviewData.roomId - Room ID (if targetType is 'room')
   * @param {string} reviewData.landlordId - Landlord ID (if targetType is 'landlord')
   * @param {number} reviewData.rating - Rating (1-5)
   * @param {string} reviewData.comment - Review comment (min 10, max 500 chars)
   * @param {string} reviewData.contractId - Contract ID (optional)
   */
  createReview: async (reviewData) => {
    const response = await apiClient.post("/reviews", reviewData);
    return response.data;
  },

  /**
   * Update an existing review
   * @param {string} reviewId - Review ID
   * @param {object} updateData - Updated review data
   * @param {number} updateData.rating - New rating (1-5)
   * @param {string} updateData.comment - New comment
   */
  updateReview: async (reviewId, updateData) => {
    const response = await apiClient.put(`/reviews/${reviewId}`, updateData);
    return response.data;
  },

  /**
   * Delete a review
   * @param {string} reviewId - Review ID
   */
  deleteReview: async (reviewId) => {
    const response = await apiClient.delete(`/reviews/${reviewId}`);
    return response.data;
  },

  /**
   * Check if user has already reviewed a target
   * @param {string} userId - User ID
   * @param {string} targetId - Room or Landlord ID
   * @param {string} targetType - 'room' or 'landlord'
   */
  checkExistingReview: async (userId, targetId, targetType) => {
    const response = await reviewApi.getRenterReviews(userId);
    const reviews = response.data?.reviews || [];
    
    if (targetType === 'room') {
      return reviews.find(r => r.roomId?._id === targetId || r.roomId === targetId);
    } else if (targetType === 'landlord') {
      return reviews.find(r => r.landlordId?._id === targetId || r.landlordId === targetId);
    }
    
    return null;
  },
};

export default reviewApi;
