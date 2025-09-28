import React, { useState, useEffect } from "react";
import { message } from "antd";
import Welcome from "./Welcome/Welcome";
import Renting from "./Renting/Renting";
import Suggest from "./Suggest/Suggest";
import Saved from "./Saved/Saved";
import Activity from "./Activity/Activity";
import { roomApi, bookingApi, handleApiError } from "../../../../services/api";
import { useAuth } from "../../../../contexts/AuthContext";
import "./Home.css";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [suggestedRooms, setSuggestedRooms] = useState([]);
  const [savedRooms, setSavedRooms] = useState([]);
  const [userBookings, setUserBookings] = useState([]);
  const [activities, setActivities] = useState([]);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const generateActivitiesFromBookings = (bookings) => {
      const generatedActivities = bookings
        .map((booking, index) => ({
          id: `booking-${booking.id || index}`,
          type: "booking",
          title: `Đặt phòng tại ${
            booking.roomTitle || booking.roomId?.title || "N/A"
          }`,
          description: `Trạng thái: ${booking.status || "N/A"}`,
          time: booking.createdAt || new Date().toISOString(),
        }))
        .slice(0, 10); // Limit to 10 activities

      setActivities(generatedActivities);
    };

    const fetchUserData = async () => {
      if (!isAuthenticated || !user || !user._id) return;

      // Check if token exists
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      try {
        // Fetch user bookings
        const bookingsResponse = await bookingApi.getAllBookings();
        if (bookingsResponse.success && bookingsResponse.data) {
          setUserBookings(bookingsResponse.data);
          generateActivitiesFromBookings(bookingsResponse.data);
        }
      } catch (error) {
        // If authentication error (401) or forbidden (403), just ignore and continue
        if (
          error.response?.status === 401 ||
          error.response?.status === 403 ||
          error.status === 401 ||
          error.status === 403 ||
          error.message?.includes("Authentication required") ||
          error.message?.includes("Forbidden")
        ) {
          return;
        }
      }
    };

    const fetchHomeData = async () => {
      setLoading(true);
      try {
        await fetchSuggestedRooms();
        if (isAuthenticated) {
          await fetchUserData();
        }
      } catch (error) {
        const errorInfo = handleApiError(error);
        message.error(`Có lỗi khi tải dữ liệu: ${errorInfo.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, [isAuthenticated, user]);

  // Fetch suggested rooms for all users
  const fetchSuggestedRooms = async () => {
    try {
      const response = await roomApi.getAllRooms({
        limit: 10,
        sort: "rating",
        order: "desc",
      });

      if (response.success && response.data) {
        // Handle the correct API response structure: {rooms: [...], pagination: {...}}
        const roomsData = Array.isArray(response.data.rooms)
          ? response.data.rooms
          : [];
        setSuggestedRooms(roomsData);
      }
    } catch (error) {
      console.error("Error fetching suggested rooms:", error);
      // Use fallback data if API fails
      setSuggestedRooms([]);
    }
  };

  // Helper function to format time ago
  const formatTimeAgo = (dateString) => {
    if (!dateString) return "Vừa xong";

    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Vừa xong";
    if (diffInHours < 24) return `${diffInHours} giờ trước`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} ngày trước`;
  };

  // Handle room interactions
  const handleRoomLike = async (roomId, isLiked) => {
    if (!isAuthenticated) {
      message.warning("Vui lòng đăng nhập để lưu phòng");
      return;
    }

    try {
      // API call to save/unsave room would go here
      // For now, we'll just update local state
      if (isLiked) {
        setSavedRooms((prev) => prev.filter((room) => room.id !== roomId));
      } else {
        const roomToSave = suggestedRooms.find((room) => room.id === roomId);
        if (roomToSave) {
          setSavedRooms((prev) => [...prev, roomToSave]);
        }
      }

      message.success(isLiked ? "Đã bỏ lưu phòng" : "Đã lưu phòng");
    } catch (error) {
      const errorInfo = handleApiError(error);
      message.error(`Có lỗi: ${errorInfo.message}`);
    }
  };

  return (
    <div className="home-container">
      <Welcome user={user} />
      <Renting bookings={userBookings} loading={loading} />
      <Suggest
        onRoomLike={handleRoomLike}
        savedRoomIds={savedRooms.map((room) => room.id)}
      />
      <Saved
        savedRooms={savedRooms}
        loading={loading}
        onRoomLike={handleRoomLike}
      />
      <Activity activities={activities} loading={loading} />
    </div>
  );
};

export default Home;
