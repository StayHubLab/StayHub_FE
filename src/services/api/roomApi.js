import apiClient from "./apiClient";

// Room API endpoints
const roomApi = {
  // Public endpoints
  getAllRooms: async (params = {}) => {
    const response = await apiClient.get("/rooms", { params });
    return response.data;
  },

  getRoomById: async (id) => {
    const response = await apiClient.get(`/rooms/${id}`);
    return response.data;
  },

  searchRooms: async (searchParams) => {
    const response = await apiClient.get("/rooms/search", {
      params: searchParams,
    });
    return response.data;
  },

  filterRooms: async (filterParams) => {
    const response = await apiClient.get("/rooms/filter", {
      params: filterParams,
    });
    return response.data;
  },

  // Get rooms with query parameters (for landlord dashboard)
  getRooms: async (params = {}) => {
    // Add populate parameter to get building data
    const queryParams = {
      ...params,
      populate: "buildingId", // This will populate the building information
    };
    const response = await apiClient.get("/rooms", { params: queryParams });
    return response.data;
  },

  // Protected endpoints (landlord only)
  createRoom: async (roomData) => {
    const response = await apiClient.post("/rooms", roomData);
    return response.data;
  },

  updateRoom: async (id, roomData) => {
    const response = await apiClient.put(`/rooms/${id}`, roomData);
    return response.data;
  },

  deleteRoom: async (id) => {
    const response = await apiClient.delete(`/rooms/${id}`);
    return response.data;
  },

  // Get contract information for a room
  getRoomContractInfo: async (id) => {
    const response = await apiClient.get(`/rooms/${id}/contract`);
    return response.data;
  },
};

export default roomApi;
