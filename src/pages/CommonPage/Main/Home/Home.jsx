import React, { useState, useEffect } from "react";
import { message } from "antd";
import Welcome from "./Welcome/Welcome";
import Renting from "./Renting/Renting";
import Suggest from "./Suggest/Suggest";
import Saved from "./Saved/Saved";
import Activity from "./Activity/Activity";
import {
  roomApi,
  bookingApi,
  userApi,
  handleApiError,
} from "../../../../services/api";
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
    const fetchHomeData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchSuggestedRooms(),
          isAuthenticated && fetchUserData(),
        ]);
      } catch (error) {
        const errorInfo = handleApiError(error);
        message.error(`Có lỗi khi tải dữ liệu: ${errorInfo.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, [isAuthenticated]);

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

  // Fetch user-specific data (bookings, saved rooms, activities)
  const fetchUserData = async () => {
    if (!isAuthenticated) return;

    try {
      // Fetch user bookings
      const bookingsResponse = await bookingApi.getAllBookings();
      if (bookingsResponse.success && bookingsResponse.data) {
        setUserBookings(bookingsResponse.data);
        generateActivitiesFromBookings(bookingsResponse.data);
      }

      // Fetch user's saved rooms (assuming there's an endpoint for this)
      // For now, we'll use a subset of suggested rooms as saved rooms
      // In a real app, this would be a separate API call
      const savedRoomsIds = user?.savedRooms || [];
      const userSavedRooms = suggestedRooms.filter((room) =>
        savedRoomsIds.includes(room.id)
      );
      setSavedRooms(userSavedRooms);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Generate activities from bookings data
  const generateActivitiesFromBookings = (bookings) => {
    const generatedActivities = bookings
      .map((booking, index) => {
        const activityTypes = [
          {
            type: "payment_due",
            icon: "bell",
            iconColor: "#FAC227",
            title: `Phòng ${booking.room?.name || booking.roomId}:`,
            message: " Sắp đến kỳ thanh toán.",
            actionText: "Thanh toán",
            isHighlighted: true,
          },
          {
            type: "booking_confirmed",
            icon: "check-circle",
            iconColor: "#52C41A",
            title: "Đặt phòng",
            message: " đã được xác nhận.",
            actionText: "Xem chi tiết",
            isHighlighted: false,
          },
          {
            type: "message",
            icon: "message",
            iconColor: "#4739F0",
            title: "Chủ trọ",
            message: " đã phản hồi yêu cầu của bạn.",
            actionText: "Xem tin nhắn",
            isHighlighted: false,
          },
        ];

        const activityType = activityTypes[index % activityTypes.length];
        return {
          id: booking.id || index + 1,
          ...activityType,
          time: formatTimeAgo(booking.updatedAt || booking.createdAt),
          bookingId: booking.id,
        };
      })
      .slice(0, 5); // Limit to 5 activities

    setActivities(generatedActivities);
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
