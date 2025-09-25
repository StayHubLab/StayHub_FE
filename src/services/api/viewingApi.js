/**
 * @fileoverview Viewing API Service - Handles viewing appointment API calls
 * @created 2025-09-25
 * @file viewingApi.js
 * @description Service for making viewing appointment API requests to the backend
 */

import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error.response?.data || error);
  }
);

/**
 * Viewing API Service
 */
class ViewingApi {
  /**
   * Create a new viewing appointment
   * @param {Object} viewingData - Viewing appointment data
   * @returns {Promise<Object>} API response
   */
  static async createViewing(viewingData) {
    try {
      const response = await apiClient.post('/viewings', viewingData);
      return response;
    } catch (error) {
      console.error('Error creating viewing appointment:', error);
      throw error;
    }
  }

  /**
   * Get viewing appointments with pagination and filters
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} API response
   */
  static async getViewings(params = {}) {
    try {
      const response = await apiClient.get('/viewings', { params });
      return response;
    } catch (error) {
      console.error('Error getting viewing appointments:', error);
      throw error;
    }
  }

  /**
   * Get a specific viewing appointment by ID
   * @param {string} viewingId - Viewing appointment ID
   * @returns {Promise<Object>} API response
   */
  static async getViewingById(viewingId) {
    try {
      const response = await apiClient.get(`/viewings/${viewingId}`);
      return response;
    } catch (error) {
      console.error('Error getting viewing appointment:', error);
      throw error;
    }
  }

  /**
   * Update viewing appointment status
   * @param {string} viewingId - Viewing appointment ID
   * @param {string} status - New status
   * @param {string} message - Optional message
   * @returns {Promise<Object>} API response
   */
  static async updateViewingStatus(viewingId, status, message = null) {
    try {
      const response = await apiClient.put(`/viewings/${viewingId}/status`, {
        status,
        message,
      });
      return response;
    } catch (error) {
      console.error('Error updating viewing appointment status:', error);
      throw error;
    }
  }

  /**
   * Get viewing appointments for a specific user
   * @param {string} userId - User ID
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} API response
   */
  static async getViewingsByUser(userId, params = {}) {
    try {
      const response = await apiClient.get(`/viewings/user/${userId}`, { params });
      return response;
    } catch (error) {
      console.error('Error getting user viewing appointments:', error);
      throw error;
    }
  }

  /**
   * Get viewing appointments for a specific landlord
   * @param {string} landlordId - Landlord ID
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} API response
   */
  static async getViewingsByLandlord(landlordId, params = {}) {
    try {
      const response = await apiClient.get(`/viewings/landlord/${landlordId}`, { params });
      return response;
    } catch (error) {
      console.error('Error getting landlord viewing appointments:', error);
      throw error;
    }
  }

  /**
   * Get viewing appointments for the authenticated user
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} API response
   */
  static async getMyViewings(params = {}) {
    try {
      const response = await apiClient.get('/viewings/me', { params });
      return response;
    } catch (error) {
      console.error('Error getting my viewing appointments:', error);
      throw error;
    }
  }

  /**
   * Confirm a viewing appointment (landlord only)
   * @param {string} viewingId - Viewing appointment ID
   * @param {string} message - Confirmation message
   * @returns {Promise<Object>} API response
   */
  static async confirmViewing(viewingId, message = null) {
    try {
      const response = await apiClient.post(`/viewings/${viewingId}/confirm`, {
        message,
      });
      return response;
    } catch (error) {
      console.error('Error confirming viewing appointment:', error);
      throw error;
    }
  }

  /**
   * Cancel a viewing appointment
   * @param {string} viewingId - Viewing appointment ID
   * @param {string} reason - Cancellation reason
   * @returns {Promise<Object>} API response
   */
  static async cancelViewing(viewingId, reason = null) {
    try {
      const response = await apiClient.post(`/viewings/${viewingId}/cancel`, {
        reason,
      });
      return response;
    } catch (error) {
      console.error('Error cancelling viewing appointment:', error);
      throw error;
    }
  }

  /**
   * Mark a viewing appointment as completed
   * @param {string} viewingId - Viewing appointment ID
   * @returns {Promise<Object>} API response
   */
  static async completeViewing(viewingId) {
    try {
      const response = await apiClient.post(`/viewings/${viewingId}/complete`);
      return response;
    } catch (error) {
      console.error('Error completing viewing appointment:', error);
      throw error;
    }
  }

  /**
   * Delete a viewing appointment
   * @param {string} viewingId - Viewing appointment ID
   * @returns {Promise<Object>} API response
   */
  static async deleteViewing(viewingId) {
    try {
      const response = await apiClient.delete(`/viewings/${viewingId}`);
      return response;
    } catch (error) {
      console.error('Error deleting viewing appointment:', error);
      throw error;
    }
  }

  /**
   * Check available time slots for a specific date and room
   * @param {string} roomId - Room ID
   * @param {string} date - Date in YYYY-MM-DD format
   * @returns {Promise<Object>} Available time slots
   */
  static async getAvailableTimeSlots(roomId, date) {
    try {
      const response = await apiClient.get('/viewings', {
        params: {
          roomId,
          viewingDate: date,
          status: 'confirmed,pending',
        },
      });

      // Extract booked time slots
      const bookedSlots = response.data?.map(viewing => viewing.viewingTime) || [];

      // All available time slots
      const allTimeSlots = [
        '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
        '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM'
      ];

      // Filter out booked slots
      const availableSlots = allTimeSlots.filter(slot => !bookedSlots.includes(slot));

      return {
        success: true,
        data: availableSlots,
        booked: bookedSlots,
      };
    } catch (error) {
      console.error('Error getting available time slots:', error);
      throw error;
    }
  }
}

export default ViewingApi;