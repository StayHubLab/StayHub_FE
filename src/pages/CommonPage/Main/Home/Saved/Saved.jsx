import React, { useState, useEffect, useCallback } from "react";
import "./Saved.css";
import {
  HeartFilled,
  StarFilled,
  LeftOutlined,
  RightOutlined,
  CheckOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../../contexts/AuthContext";
import { message } from "antd";
import roomApi from "../../../../../services/api/roomApi";
import savedRoomApi from "../../../../../services/api/savedRoomApi";

const Saved = ({ savedRooms: propSavedRooms = [], onRoomLike }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [savedRooms, setSavedRooms] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const [savingRooms, setSavingRooms] = useState(new Set());
  const roomsPerView = 3;
  const navigate = useNavigate();

  // Get auth context
  const { user, isAuthenticated } = useAuth();

  const maxIndex = Math.max(0, savedRooms.length - roomsPerView);

  // Load saved rooms from backend or localStorage
  const loadSavedRooms = useCallback(async () => {
    // Check if user is authenticated and has necessary data
    const token = localStorage.getItem("token");
    if (isAuthenticated && user && (user._id || user.id) && token) {
      try {
        // For authenticated users, get saved rooms from backend
        const response = await savedRoomApi.getSavedRooms();

        if (response.success && response.data?.savedRooms) {
          const savedRoomsData = response.data.savedRooms.filter(
            (savedRoom) => savedRoom.room
          );

          // Extract full room data from the response
          const roomsWithFullData = savedRoomsData.map((savedRoom) => {
            const room = savedRoom.room; // Backend returns room data under 'room' property
            // Ensure we have all necessary room properties
            return {
              ...room,
              id: room._id || room.id, // Ensure id property exists
              _id: room._id || room.id, // Ensure _id property exists
              savedAt: savedRoom.savedAt, // Include when it was saved
            };
          });

          setSavedRooms(roomsWithFullData);

          const savedRoomIds = roomsWithFullData.map(
            (room) => room._id || room.id
          );
          setFavorites(new Set(savedRoomIds));
        }
      } catch (error) {
        console.error("Error loading saved rooms:", error);
        // Fallback to localStorage
        await loadSavedRoomsFromStorage();
      }
    } else {
      // For guests, load from localStorage and match with all rooms
      await loadSavedRoomsFromStorage();
    }
  }, [isAuthenticated, user]);

  const loadSavedRoomsFromStorage = async () => {
    try {
      const savedFavorites = localStorage.getItem("favoriteRooms");
      if (savedFavorites) {
        const favoriteIds = JSON.parse(savedFavorites);
        setFavorites(new Set(favoriteIds));

        // Fetch all rooms to filter saved ones
        const response = await roomApi.getAllRooms({ limit: 50 });
        if (response.success && response.data?.rooms) {
          const allRooms = response.data.rooms;
          const favoritedRooms = allRooms.filter((room) =>
            favoriteIds.includes(room._id || room.id)
          );
          setSavedRooms(favoritedRooms);
        }
      }
    } catch (error) {
      console.error("Error loading saved rooms from storage:", error);
    }
  };

  // Load saved rooms on component mount
  useEffect(() => {
    loadSavedRooms();
  }, [loadSavedRooms]);

  const formatPrice = (price) => {
    if (!price) return "0";

    // Nếu price là object (từ API), lấy giá rent
    if (typeof price === "object" && price.rent !== undefined) {
      return price.rent.toLocaleString("vi-VN");
    }

    // Nếu price là số (fallback)
    if (typeof price === "number") {
      return price.toLocaleString("vi-VN");
    }

    return "0";
  };

  const formatAddress = (address) => {
    if (!address) return "Địa chỉ không có sẵn";

    // If address is a string, return it directly
    if (typeof address === "string") {
      return address;
    }

    // If address is an object, format it
    if (typeof address === "object") {
      const parts = [];
      if (address.street) parts.push(address.street);
      if (address.ward) parts.push(address.ward);
      if (address.district) parts.push(address.district);
      if (address.city) parts.push(address.city);

      return parts.length > 0 ? parts.join(", ") : "Địa chỉ không có sẵn";
    }

    return "Địa chỉ không có sẵn";
  };

  const handleViewDetails = (roomId) => {
    navigate("/main/room-detail/" + roomId);
  };

  const handleHeartClick = async (roomId) => {
    // Prevent multiple clicks on same room
    if (savingRooms.has(roomId)) {
      return;
    }

    const isFavorited = favorites.has(roomId);

    try {
      // Add room to saving state
      setSavingRooms((prev) => new Set([...prev, roomId]));

      // Check if user is properly authenticated before using API
      const token = localStorage.getItem("token");
      if (isAuthenticated && user && (user._id || user.id) && token) {
        // For authenticated users with valid token, use backend API
        if (isFavorited) {
          // Remove from saved rooms
          await savedRoomApi.unsaveRoom(roomId);
          message.success("Đã bỏ lưu phòng");
        } else {
          // Add to saved rooms
          await savedRoomApi.saveRoom(roomId);
          message.success("Đã lưu phòng vào danh sách yêu thích");
        }
      } else {
        // For guests, use localStorage
        const savedFavorites = localStorage.getItem("favoriteRooms");
        const currentFavorites = savedFavorites
          ? JSON.parse(savedFavorites)
          : [];

        let newFavorites;
        if (isFavorited) {
          newFavorites = currentFavorites.filter((id) => id !== roomId);
          message.success("Đã bỏ lưu phòng");
        } else {
          newFavorites = [...currentFavorites, roomId];
          message.success("Đã lưu phòng vào danh sách yêu thích");
        }

        localStorage.setItem("favoriteRooms", JSON.stringify(newFavorites));
      }

      // Update local state
      setFavorites((prev) => {
        const newFavorites = new Set(prev);
        if (isFavorited) {
          newFavorites.delete(roomId);
        } else {
          newFavorites.add(roomId);
        }
        return newFavorites;
      });

      // Remove/add room from saved rooms display
      if (isFavorited) {
        setSavedRooms((current) =>
          current.filter((room) => (room._id || room.id) !== roomId)
        );
      }

      // Call parent callback if provided
      if (onRoomLike) {
        onRoomLike(roomId, !isFavorited);
      }
    } catch (error) {
      console.error("Error saving room:", error);

      // If authentication error, fallback to localStorage
      if (
        error.response?.status === 401 ||
        error.status === 401 ||
        error.message?.includes("Authentication required")
      ) {
        // Handle with localStorage as fallback
        const savedFavorites = localStorage.getItem("favoriteRooms");
        const currentFavorites = savedFavorites
          ? JSON.parse(savedFavorites)
          : [];

        let newFavorites;
        if (isFavorited) {
          newFavorites = currentFavorites.filter((id) => id !== roomId);
          message.success("Đã bỏ lưu phòng");
          setSavedRooms((current) =>
            current.filter((room) => (room._id || room.id) !== roomId)
          );
        } else {
          newFavorites = [...currentFavorites, roomId];
          message.success("Đã lưu phòng vào danh sách yêu thích");
        }

        localStorage.setItem("favoriteRooms", JSON.stringify(newFavorites));

        // Update favorites state
        setFavorites((prev) => {
          const newFavorites = new Set(prev);
          if (isFavorited) {
            newFavorites.delete(roomId);
          } else {
            newFavorites.add(roomId);
          }
          return newFavorites;
        });

        if (onRoomLike) {
          onRoomLike(roomId, !isFavorited);
        }
      } else {
        message.error("Không thể thực hiện thao tác. Vui lòng thử lại!");
      }
    } finally {
      // Remove room from saving state
      setSavingRooms((prev) => {
        const newSaving = new Set(prev);
        newSaving.delete(roomId);
        return newSaving;
      });
    }
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => (
      <StarFilled
        key={index}
        className="saved-star"
        style={{ color: "#FAC227" }}
      />
    ));
  };

  const renderRoomCard = (room) => {
    const roomId = room._id || room.id;
    return (
      <div key={roomId} className="saved-room-card">
        {/* Room Image */}
        <div className="saved-room-image-container">
          <img
            src={room.images?.[0] || room.image || "/default-room.jpg"}
            alt={room.title}
            className="saved-room-image"
          />

          {/* Heart Icon - Always filled since these are saved rooms */}
          <div
            className="saved-heart-icon"
            onClick={(e) => {
              e.stopPropagation();
              handleHeartClick(roomId);
            }}
          >
            <HeartFilled
              className={`saved-heart-filled ${
                savingRooms.has(roomId) ? "saving" : ""
              }`}
            />
          </div>

          {/* Verified Badge */}
          {room.isVerified && (
            <div className="saved-verified-badge">
              <CheckOutlined className="saved-verified-icon" />
              <span className="saved-verified-text">Đã xác thực</span>
            </div>
          )}
        </div>

        {/* Room Details */}
        <div className="saved-room-details">
          {/* AI Recommendation Badge */}
          {room.isAiRecommended && (
            <div className="saved-ai-badge">
              <span className="saved-ai-text">AI đề xuất</span>
            </div>
          )}

          {/* Room Title */}
          <div className="saved-room-title">{room.title}</div>

          {/* Price Section */}
          <div className="saved-price-section">
            <div className="saved-price">{formatPrice(room.price)} VNĐ</div>
            <div className="saved-price-unit">/tháng</div>
          </div>

          {/* Location */}
          <div className="saved-location">
            {formatAddress(room.address || room.location)}
          </div>

          {/* View Details Button */}
          <div
            className="saved-details-button"
            onClick={() => handleViewDetails(roomId)}
          >
            <span className="saved-details-text">Xem chi tiết</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="saved-container">
      {/* Header Section */}
      <div className="saved-header">
        <div className="saved-header-content">
          <div className="saved-title">Phòng bạn đã lưu</div>
          <div className="saved-subtitle">
            Danh sách các phòng bạn đang quan tâm.
          </div>
        </div>
        {/* <div className="saved-view-all" onClick={handleViewAll}>
          Xem tất cả
        </div> */}
      </div>

      {/* Carousel Container or Empty State */}
      {savedRooms.length > 0 ? (
        <div className="saved-carousel-container">
          {/* Navigation Buttons */}
          {savedRooms.length > roomsPerView && (
            <>
              <button
                className={`saved-nav-button saved-nav-prev ${
                  currentIndex === 0 ? "disabled" : ""
                }`}
                onClick={handlePrevious}
                disabled={currentIndex === 0}
              >
                <LeftOutlined />
              </button>
              <button
                className={`saved-nav-button saved-nav-next ${
                  currentIndex === maxIndex ? "disabled" : ""
                }`}
                onClick={handleNext}
                disabled={currentIndex === maxIndex}
              >
                <RightOutlined />
              </button>
            </>
          )}

          {/* Rooms Grid */}
          <div className="saved-rooms-grid">
            <div
              className="saved-rooms-track"
              style={{
                transform: `translateX(-${currentIndex * (369.33 + 24)}px)`,
                transition: "transform 0.3s ease-in-out",
              }}
            >
              {savedRooms.map((room) => renderRoomCard(room))}
            </div>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="saved-empty-state">
          <div className="saved-empty-icon">
            <HeartOutlined />
          </div>
          <div className="saved-empty-title">Chưa có phòng nào được lưu</div>
          <div className="saved-empty-subtitle">
            Hãy khám phá và lưu những phòng trọ yêu thích của bạn
          </div>
        </div>
      )}
    </div>
  );
};

export default Saved;
