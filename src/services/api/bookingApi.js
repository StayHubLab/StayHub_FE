import apiClient from "./apiClient";

// Booking API endpoints
const bookingApi = {
  // Protected endpoints
  getAllBookings: async () => {
    const response = await apiClient.get("/bookings");
    return response.data;
  },

  getBookingById: async (id) => {
    const response = await apiClient.get(`/bookings/${id}`);
    return response.data;
  },

  createBooking: async (bookingData) => {
    const response = await apiClient.post("/bookings", bookingData);
    return response.data;
  },

  updateBooking: async (id, bookingData) => {
    const response = await apiClient.put(`/bookings/${id}`, bookingData);
    return response.data;
  },

  cancelBooking: async (id) => {
    const response = await apiClient.put(`/bookings/${id}/cancel`);
    return response.data;
  },

  getBookingsByUserId: async (userId) => {
    const response = await apiClient.get(`/bookings/user/${userId}`);
    return response.data;
  },

  getBookingsByRoomId: async (roomId) => {
    const response = await apiClient.get(`/bookings/room/${roomId}`);
    return response.data;
  },
};

export default bookingApi;
