/**
 * @fileoverview Review API - API calls for reviews and testimonials
 * @created 2025-09-25
 * @file reviewApi.js
 */

import apiClient from "./apiClient";

const reviewApi = {
  /**
   * Get all public testimonials/reviews
   * @param {Object} options - Query options
   * @param {number} options.page - Page number
   * @param {number} options.limit - Items per page
   * @param {number} options.minRating - Minimum rating filter
   * @returns {Promise<Object>} API response with testimonials
   */
  getTestimonials: async (options = {}) => {
    try {
      const { page = 1, limit = 10, minRating = 4 } = options;
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        minRating: minRating.toString(),
        isPublic: "true",
      });

      const response = await apiClient.get(
        `/api/reviews/testimonials?${params}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      throw error;
    }
  },

  /**
   * Get reviews for a specific room
   * @param {string} roomId - Room ID
   * @param {Object} options - Query options
   * @returns {Promise<Object>} API response with reviews
   */
  getRoomReviews: async (roomId, options = {}) => {
    try {
      const { page = 1, limit = 10 } = options;
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      const response = await apiClient.get(
        `/api/reviews/room/${roomId}?${params}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching room reviews:", error);
      throw error;
    }
  },

  /**
   * Create a new review
   * @param {Object} reviewData - Review data
   * @param {string} reviewData.roomId - Room ID
   * @param {number} reviewData.rating - Rating (1-5)
   * @param {string} reviewData.comment - Review comment
   * @param {boolean} reviewData.allowPublic - Allow public display
   * @returns {Promise<Object>} API response
   */
  createReview: async (reviewData) => {
    try {
      const response = await apiClient.post("/api/reviews", reviewData);
      return response.data;
    } catch (error) {
      console.error("Error creating review:", error);
      throw error;
    }
  },

  /**
   * Get review statistics
   * @returns {Promise<Object>} API response with stats
   */
  getReviewStats: async () => {
    try {
      const response = await apiClient.get("/api/reviews/stats");
      return response.data;
    } catch (error) {
      console.error("Error fetching review stats:", error);
      throw error;
    }
  },
};

export default reviewApi;
