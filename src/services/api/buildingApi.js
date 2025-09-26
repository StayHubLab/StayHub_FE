import apiClient from "./apiClient";

// Building API endpoints
const buildingApi = {
  // Public endpoints
  getAllBuildings: async (params = {}) => {
    const response = await apiClient.get("/buildings", { params });
    return response.data;
  },

  getBuildingById: async (id) => {
    const response = await apiClient.get(`/buildings/${id}`);
    return response.data;
  },

  getRoomsByBuildingId: async (id) => {
    const response = await apiClient.get(`/buildings/${id}/rooms`);
    return response.data;
  },

  // Protected endpoints (landlord/admin only)
  createBuilding: async (buildingData) => {
    const response = await apiClient.post("/buildings", buildingData);
    return response.data;
  },

  updateBuilding: async (id, buildingData) => {
    const response = await apiClient.put(`/buildings/${id}`, buildingData);
    return response.data;
  },

  deleteBuilding: async (id) => {
    const response = await apiClient.delete(`/buildings/${id}`);
    return response.data;
  },
};

export default buildingApi;
