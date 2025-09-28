/**
 * @fileoverview Saved Room API - Handles saved room operations
 * @created 2025-09-25
 * @file savedRoomApi.js
 * @description API service for managing saved/favorite rooms
 */

import apiClient from "./apiClient";

const savedRoomApi = {
  /**
   * Get all saved rooms for current user
   * @returns {Promise<Object>} API response with saved rooms
   */
  getSavedRooms: async () => {
    try {
      const response = await apiClient.get("/saved-rooms");
      return response.data; // Return the backend response directly
    } catch (error) {
      console.error("API Error:", error.response?.data || error);
      throw error.response?.data || error;
    }
  },

  /**
   * Add a room to saved rooms
   * @param {string} roomId - Room ID to save
   * @returns {Promise<Object>} API response
   */
  saveRoom: async (roomId) => {
    try {
      const response = await apiClient.post("/saved-rooms", { roomId });
      return response.data;
    } catch (error) {
      console.error("API Error:", error.response?.data || error);
      throw error.response?.data || error;
    }
  },

  /**
   * Remove a room from saved rooms
   * @param {string} roomId - Room ID to remove
   * @returns {Promise<Object>} API response
   */
  unsaveRoom: async (roomId) => {
    try {
      const response = await apiClient.delete(`/saved-rooms/${roomId}`);
      return response.data;
    } catch (error) {
      console.error("API Error:", error.response?.data || error);
      throw error.response?.data || error;
    }
  },

  /**
   * Check if a room is saved
   * @param {string} roomId - Room ID to check
   * @returns {Promise<Object>} API response with saved status
   */
  checkSavedStatus: async (roomId) => {
    try {
      const response = await apiClient.get(`/saved-rooms/${roomId}/status`);
      return response.data;
    } catch (error) {
      console.error("API Error:", error.response?.data || error);
      throw error.response?.data || error;
    }
  },
};

export default savedRoomApi;
