/**
 * @fileoverview Tenant API - API calls for tenant management
 * @created 2025-09-25
 * @file tenantApi.js
 */

import apiClient from "./apiClient";

const tenantApi = {
  /**
   * Get all tenants for the current landlord
   * @param {Object} options - Query options
   * @param {number} options.page - Page number
   * @param {number} options.limit - Items per page
   * @param {string} options.search - Search term
   * @param {string} options.status - Filter by payment status
   * @param {string} options.roomId - Filter by room
   * @param {string} options.sortBy - Sort by field
   * @returns {Promise<Object>} API response with tenants
   */
  getTenants: async (options = {}) => {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        status,
        roomId,
        sortBy = "name",
        landlordId,
      } = options;

      // If backend tenants endpoint is unavailable, derive tenants from contracts by host
      if (landlordId) {
        const contractsResp = await apiClient.get(
          `/contracts/host/${landlordId}`
        );
        const contracts = Array.isArray(contractsResp.data?.data)
          ? contractsResp.data.data
          : Array.isArray(contractsResp.data)
          ? contractsResp.data
          : [];

        // Transform contracts into tenants list shape
        let tenants = contracts.map((c) => ({
          _id: c._id,
          user: c.renterId || {},
          room: c.roomId || {},
          contract: {
            _id: c._id,
            startDate: c.startDate,
            endDate: c.endDate,
            rentAmount: c?.terms?.rentAmount || 0,
            termMonths:
              c.startDate && c.endDate
                ? Math.max(
                    1,
                    Math.round(
                      (new Date(c.endDate) - new Date(c.startDate)) /
                        (1000 * 60 * 60 * 24 * 30)
                    )
                  )
                : 12,
          },
          paymentStatus: c.status === "pending" ? "pending" : "paid",
          lastPaymentDate: null,
          nextPaymentDate: null,
          totalUnpaid: 0,
          createdAt: c.createdAt,
          updatedAt: c.updatedAt,
        }));

        // Apply basic client-side filters
        if (search) {
          const s = search.toLowerCase();
          tenants = tenants.filter(
            (t) =>
              (t.user?.name || "").toLowerCase().includes(s) ||
              (t.user?.phone || "").includes(search) ||
              (t.room?.name || t.room?.code || t.room?.roomCode || "")
                .toLowerCase()
                .includes(s)
          );
        }
        if (status) {
          tenants = tenants.filter((t) => t.paymentStatus === status);
        }
        if (roomId) {
          tenants = tenants.filter(
            (t) => String(t.room?._id) === String(roomId)
          );
        }

        // Sorting
        tenants.sort((a, b) => {
          switch (sortBy) {
            case "name":
              return (a.user?.name || "").localeCompare(b.user?.name || "");
            case "room":
              return (
                a.room?.name ||
                a.room?.code ||
                a.room?.roomCode ||
                ""
              ).localeCompare(
                b.room?.name || b.room?.code || b.room?.roomCode || ""
              );
            case "rent":
              return (
                (b.contract?.rentAmount || 0) - (a.contract?.rentAmount || 0)
              );
            case "status":
              return (a.paymentStatus || "").localeCompare(
                b.paymentStatus || ""
              );
            case "contractEnd":
              return (
                new Date(a.contract?.endDate || 0) -
                new Date(b.contract?.endDate || 0)
              );
            default:
              return 0;
          }
        });

        // Pagination (client-side)
        const start = (page - 1) * limit;
        const paged = tenants.slice(start, start + limit);

        // Map to ManageTenants expected shape
        const transformed = paged.map((t) => ({
          id: t._id,
          tenant: {
            name: t.user?.name || "Không xác định",
            phone: t.user?.phone || "Chưa có",
            email: t.user?.email,
            avatar: t.user?.avatar,
            idCard: t.user?.idCard,
            occupation: t.user?.occupation,
          },
          roomNumber:
            t.room?.code ||
            t.room?.roomCode ||
            t.room?.name ||
            t.room?.title ||
            "N/A",
          roomId: t.room?._id,
          rentAmount: t.contract?.rentAmount || t.room?.price?.rent || 0,
          term: t.contract?.termMonths || 12,
          paymentStatus: t.paymentStatus,
          contract: {
            startDate: t.contract?.startDate,
            endDate: t.contract?.endDate,
            contractId: t.contract?._id || t._id,
          },
          lastPaymentDate: t.lastPaymentDate,
          nextPaymentDate: t.nextPaymentDate,
          totalUnpaid: t.totalUnpaid || 0,
          createdAt: t.createdAt,
          updatedAt: t.updatedAt,
        }));

        return {
          success: true,
          data: {
            tenants: transformed,
            pagination: {
              total: tenants.length,
              page,
              limit,
              pages: Math.max(1, Math.ceil(tenants.length / limit)),
            },
          },
        };
      }

      // Default path if /api/tenants exists
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        ...(search && { search }),
        ...(status && { status }),
        ...(roomId && { roomId }),
      });
      const response = await apiClient.get(`/api/tenants?${params}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get tenant by ID
   * @param {string} tenantId - Tenant ID
   * @returns {Promise<Object>} API response with tenant data
   */
  getTenantById: async (tenantId) => {
    try {
      const response = await apiClient.get(`/api/tenants/${tenantId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Create a new tenant
   * @param {Object} tenantData - Tenant data
   * @returns {Promise<Object>} API response
   */
  createTenant: async (tenantData) => {
    try {
      const response = await apiClient.post("/api/tenants", tenantData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update tenant information
   * @param {string} tenantId - Tenant ID
   * @param {Object} tenantData - Updated tenant data
   * @returns {Promise<Object>} API response
   */
  updateTenant: async (tenantId, tenantData) => {
    try {
      const response = await apiClient.put(
        `/api/tenants/${tenantId}`,
        tenantData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete tenant
   * @param {string} tenantId - Tenant ID
   * @returns {Promise<Object>} API response
   */
  deleteTenant: async (tenantId) => {
    try {
      const response = await apiClient.delete(`/api/tenants/${tenantId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get tenant contracts for a tenant
   * @param {string} tenantId - Tenant ID
   * @returns {Promise<Object>} API response with contracts
   */
  getTenantContracts: async (tenantId) => {
    try {
      const response = await apiClient.get(
        `/api/tenants/${tenantId}/contracts`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get tenant payment history
   * @param {string} tenantId - Tenant ID
   * @param {Object} options - Query options
   * @returns {Promise<Object>} API response with payment history
   */
  getTenantPayments: async (tenantId, options = {}) => {
    try {
      const { page = 1, limit = 10 } = options;
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      const response = await apiClient.get(
        `/api/tenants/${tenantId}/payments?${params}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get tenant statistics for landlord dashboard
   * @returns {Promise<Object>} API response with tenant stats
   */
  getTenantStats: async () => {
    try {
      const response = await apiClient.get("/api/tenants/stats");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Send notification to tenant
   * @param {string} tenantId - Tenant ID
   * @param {Object} notificationData - Notification data
   * @returns {Promise<Object>} API response
   */
  sendNotification: async (tenantId, notificationData) => {
    try {
      const response = await apiClient.post(
        `/api/tenants/${tenantId}/notify`,
        notificationData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default tenantApi;
