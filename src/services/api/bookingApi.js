import apiClient from "./apiClient";

// Booking API endpoints
const bookingApi = {
  // Protected endpoints
  getAllBookings: async () => {
    const response = await apiClient.get("/booking");
    return response.data;
  },

  getBookingById: async (id) => {
    const response = await apiClient.get(`/booking/${id}`);
    return response.data;
  },

  createBooking: async (bookingData) => {
    const response = await apiClient.post("/booking", bookingData);
    return response.data;
  },

  updateBooking: async (id, bookingData) => {
    const response = await apiClient.put(`/booking/${id}`, bookingData);
    return response.data;
  },

  cancelBooking: async (id) => {
    const response = await apiClient.put(`/booking/${id}/cancel`);
    return response.data;
  },

  getBookingsByUserId: async (userId) => {
    const response = await apiClient.get(`/booking/user/${userId}`);
    return response.data;
  },

  getBookingsByRoomId: async (roomId) => {
    const response = await apiClient.get(`/booking/room/${roomId}`);
    return response.data;
  },
};

export default bookingApi;
