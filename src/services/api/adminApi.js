/**
 * @fileoverview Admin API Service
 * @created 2025-11-06
 * @file adminApi.js
 * @description API service for admin operations
 */

import apiClient from "./apiClient";

/**
 * Get complete dashboard data
 */
export const getDashboardData = async () => {
  try {
    const response = await apiClient.get("/admin/dashboard");
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get dashboard statistics
 */
export const getDashboardStats = async () => {
  try {
    const response = await apiClient.get("/admin/dashboard/stats");
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get user statistics
 */
export const getUserStats = async () => {
  try {
    const response = await apiClient.get("/admin/dashboard/users");
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get engagement metrics
 */
export const getEngagementMetrics = async () => {
  try {
    const response = await apiClient.get("/admin/dashboard/engagement");
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get MAU trend
 */
export const getMAUTrend = async (months = 6) => {
  try {
    const response = await apiClient.get(
      `/admin/dashboard/mau-trend?months=${months}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get all users
 */
export const getAllUsers = async () => {
  try {
    const response = await apiClient.get("/admin/users");
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get user by ID
 */
export const getUserById = async (userId) => {
  try {
    const response = await apiClient.get(`/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update user
 */
export const updateUser = async (userId, userData) => {
  try {
    const response = await apiClient.put(`/admin/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete user
 */
export const deleteUser = async (userId) => {
  try {
    const response = await apiClient.delete(`/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default {
  getDashboardData,
  getDashboardStats,
  getUserStats,
  getEngagementMetrics,
  getMAUTrend,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
