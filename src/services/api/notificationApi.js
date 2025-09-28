/**
 * @fileoverview Notification API - API calls for notifications
 * @created 2025-09-25
 * @file notificationApi.js
 */

import apiClient from "./apiClient";

const notificationApi = {
  /**
   * Get all notifications for the current user
   * @param {Object} options - Query options
   * @param {number} options.page - Page number
   * @param {number} options.limit - Items per page
   * @param {boolean} options.unreadOnly - Get only unread notifications
   * @returns {Promise<Object>} API response with notifications
   */
  getNotifications: async (options = {}) => {
    try {
      const { page = 1, limit = 10, unreadOnly = false } = options;
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(unreadOnly && { unreadOnly: "true" }),
      });

      const response = await apiClient.get(`/api/notifications?${params}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  },

  /**
   * Mark notification as read
   * @param {string} notificationId - Notification ID
   * @returns {Promise<Object>} API response
   */
  markAsRead: async (notificationId) => {
    try {
      const response = await apiClient.put(
        `/api/notifications/${notificationId}/read`
      );
      return response.data;
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  },

  /**
   * Mark all notifications as read
   * @returns {Promise<Object>} API response
   */
  markAllAsRead: async () => {
    try {
      const response = await apiClient.put("/api/notifications/mark-all-read");
      return response.data;
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      throw error;
    }
  },

  /**
   * Get notification count
   * @param {boolean} unreadOnly - Count only unread notifications
   * @returns {Promise<Object>} API response with count
   */
  getNotificationCount: async (unreadOnly = true) => {
    try {
      const params = unreadOnly ? "?unreadOnly=true" : "";
      const response = await apiClient.get(`/api/notifications/count${params}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching notification count:", error);
      throw error;
    }
  },

  /**
   * Delete notification
   * @param {string} notificationId - Notification ID
   * @returns {Promise<Object>} API response
   */
  deleteNotification: async (notificationId) => {
    try {
      const response = await apiClient.delete(
        `/api/notifications/${notificationId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting notification:", error);
      throw error;
    }
  },
};

export default notificationApi;
