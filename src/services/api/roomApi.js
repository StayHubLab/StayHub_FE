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
};

export default roomApi;
