import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import "./Suggest.css";
import {
  CheckOutlined,
  StarFilled,
  LeftOutlined,
  RightOutlined,
  HeartOutlined,
  HeartFilled,
  WifiOutlined,
  CarOutlined,
  ThunderboltOutlined,
  FireOutlined,
  HomeOutlined,
  SafetyCertificateOutlined,
  CameraOutlined,
  ToolOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../../contexts/AuthContext";
import { message } from "antd";
import roomApi from "../../../../../services/api/roomApi";
import savedRoomApi from "../../../../../services/api/savedRoomApi";

const Suggest = ({
  loading: propLoading = false,
  onRoomLike,
  savedRoomIds = [],
}) => {
  // State để quản lý dữ liệu rooms
  const [suggestedRooms, setSuggestedRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [savingRooms, setSavingRooms] = useState(new Set()); // Track rooms being saved/unsaved

  const [currentIndex, setCurrentIndex] = useState(0);
  const [favorites, setFavorites] = useState(new Set()); // Track favorited room IDs
  const roomsPerView = 3;
  const safeRooms = Array.isArray(suggestedRooms) ? suggestedRooms : [];
  const maxIndex = Math.max(0, safeRooms.length - roomsPerView);
  const navigate = useNavigate();

  // Get auth context
  const { user, isAuthenticated } = useAuth();

  // Load saved rooms from backend for authenticated users
  const loadSavedRooms = useCallback(async () => {
    // Check if user is actually authenticated and has necessary data
    if (!isAuthenticated || !user || !(user._id || user.id)) {
      // For guests or incomplete auth, load from localStorage
      const savedFavorites = localStorage.getItem("favoriteRooms");
      if (savedFavorites) {
        const favoriteIds = JSON.parse(savedFavorites);
        setFavorites(new Set(favoriteIds));
      }
      return;
    }

    // Additional check for token
    const token = localStorage.getItem("token");
    if (!token) {
      // No token available, use localStorage
      const savedFavorites = localStorage.getItem("favoriteRooms");
      if (savedFavorites) {
        const favoriteIds = JSON.parse(savedFavorites);
        setFavorites(new Set(favoriteIds));
      }
      return;
    }

    try {
      const response = await savedRoomApi.getSavedRooms();
      if (response.success && response.data?.savedRooms) {
        const savedRoomIds = response.data.savedRooms.map(
          (savedRoom) => savedRoom.roomId?._id || savedRoom.roomId
        );
        setFavorites(new Set(savedRoomIds));
      }
    } catch (error) {
      console.error("Error loading saved rooms:", error);

      // If it's a 401 error, user is not authenticated, just use localStorage
      if (
        error.response?.status === 401 ||
        error.status === 401 ||
        error.message?.includes("Authentication required")
      ) {
        const savedFavorites = localStorage.getItem("favoriteRooms");
        if (savedFavorites) {
          const favoriteIds = JSON.parse(savedFavorites);
          setFavorites(new Set(favoriteIds));
        }
        return;
      }

      // For other errors, fallback to localStorage
      const savedFavorites = localStorage.getItem("favoriteRooms");
      if (savedFavorites) {
        const favoriteIds = JSON.parse(savedFavorites);
        setFavorites(new Set(favoriteIds));
      }
    }
  }, [isAuthenticated, user]);

  // Fetch suggested rooms từ API
  const fetchSuggestedRooms = async () => {
    try {
      setLoading(true);
      setError(null);

      const tryParams = [
        { limit: 10, sort: "rating", order: "desc", status: "available" },
        { limit: 10, sort: "createdAt", order: "desc", status: "available" },
        { limit: 10, status: "available" },
      ];

      let roomsArray = [];
      for (const qp of tryParams) {
        const response = await roomApi.getAllRooms({ ...qp });
        const payload = response?.data ?? response;
        const dataNode = payload?.data ?? payload;
        const candidate =
          (Array.isArray(payload?.rooms) && payload.rooms) ||
          (Array.isArray(dataNode?.rooms) && dataNode.rooms) ||
          (Array.isArray(dataNode) && dataNode) ||
          [];
        if (candidate.length > 0) {
          roomsArray = candidate;
          break;
        }
      }

      // As a final fallback, try the alternate helper which auto-populates building
      if (roomsArray.length === 0) {
        const resp2 = await roomApi.getRooms({
          limit: 10,
          status: "available",
        });
        const payload2 = resp2?.data ?? resp2;
        const dataNode2 = payload2?.data ?? payload2;
        const candidate2 =
          (Array.isArray(payload2?.rooms) && payload2.rooms) ||
          (Array.isArray(dataNode2?.rooms) && dataNode2.rooms) ||
          (Array.isArray(dataNode2) && dataNode2) ||
          [];
        roomsArray = candidate2;
      }

      setSuggestedRooms(roomsArray);
    } catch (error) {
      console.error("Error fetching suggested rooms:", error);
      setError("Không thể tải danh sách phòng gợi ý");
      setSuggestedRooms([]);
    } finally {
      setLoading(false);
    }
  };

  // Load favorites from localStorage/backend on component mount
  useEffect(() => {
    const loadData = async () => {
      await loadSavedRooms();
      await fetchSuggestedRooms();
    };

    loadData();
  }, [loadSavedRooms]); // Re-run when loadSavedRooms changes (when auth status changes)

  const formatPrice = (price) => {
    if (!price) return "0";

    // Nếu price là object (từ API), lấy giá rent
    if (typeof price === "object" && price.rent !== undefined) {
      return price.rent.toLocaleString();
    }

    // Nếu price là số (fallback)
    if (typeof price === "number") {
      return price.toLocaleString();
    }

    return "0";
  };

  // Function để map utilities với icon
  const getUtilityIcon = (utilityName) => {
    const iconMap = {
      wifi: <WifiOutlined />,
      internet: <WifiOutlined />,
      mạng: <WifiOutlined />,
      parking: <CarOutlined />,
      car: <CarOutlined />,
      xe: <CarOutlined />,
      electricity: <ThunderboltOutlined />,
      power: <ThunderboltOutlined />,
      điện: <ThunderboltOutlined />,
      gas: <FireOutlined />,
      kitchen: <HomeOutlined />,
      bếp: <HomeOutlined />,
      security: <SafetyCertificateOutlined />,
      "an ninh": <SafetyCertificateOutlined />,
      camera: <CameraOutlined />,
      maintenance: <ToolOutlined />,
      repair: <ToolOutlined />,
      "sửa chữa": <ToolOutlined />,
      "air conditioner": <ThunderboltOutlined />,
      "máy lạnh": <ThunderboltOutlined />,
      "water heater": <FireOutlined />,
      "nóng lạnh": <FireOutlined />,
      heater: <FireOutlined />,
    };

    // Tìm icon dựa trên tên utility (case insensitive)
    const lowerName = utilityName.toLowerCase();
    for (const [key, icon] of Object.entries(iconMap)) {
      if (lowerName.includes(key)) {
        return icon;
      }
    }

    // Default icon nếu không tìm thấy
    return <HomeOutlined />;
  };

  // Function để render utilities (tối đa 3 cái)
  const renderUtilities = (utilities) => {
    if (!utilities || !Array.isArray(utilities) || utilities.length === 0) {
      return null;
    }

    const displayUtilities = utilities.slice(0, 3);

    return (
      <div className="suggest-utilities">
        {displayUtilities.map((utility, index) => (
          <div key={index} className="suggest-utility-item">
            <span style={{ fontSize: "12px" }}>
              {getUtilityIcon(utility.name || utility)}
            </span>
            <span>{utility.name || utility}</span>
          </div>
        ))}
      </div>
    );
  };

  // Helper: pick a random image from room.images (supports object or string)
  const getRandomRoomImageUrl = (room) => {
    const images = room?.images;
    if (Array.isArray(images) && images.length > 0) {
      const index = Math.floor(Math.random() * images.length);
      const chosen = images[index];
      return chosen?.url || chosen;
    }
    return "https://placehold.co/369x180";
  };

  const handleViewDetails = (roomId) => {
    navigate(`/main/room-detail/${roomId}`);
    console.log("View details clicked for room:", roomId);
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
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
        console.log("Using backend API for room:", roomId);
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
        // For guests or incomplete auth, use localStorage
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

      // Call parent callback if provided
      if (onRoomLike) {
        onRoomLike(roomId, !isFavorited);
      }
    } catch (error) {
      console.error("Error saving room:", error);

      // If authentication error (401) or authentication required message
      if (
        error.response?.status === 401 ||
        error.status === 401 ||
        error.message?.includes("Authentication required") ||
        !isAuthenticated
      ) {
        // Fallback to localStorage
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

        // Call parent callback if provided
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

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => (
      <StarFilled
        key={index}
        className="suggest-star"
        style={{ color: "#FAC227" }}
      />
    ));
  };

  const renderRoomCard = (room) => (
    <div key={room._id || room.id} className="suggest-room-card">
      {/* Room Image */}
      <div className="suggest-room-image-container">
        <img
          src={getRandomRoomImageUrl(room)}
          alt={room.name || room.title}
          className="suggest-room-image"
        />

        {/* Heart Icon */}
        <div
          className="suggest-heart-icon"
          onClick={(e) => {
            e.stopPropagation();
            handleHeartClick(room._id || room.id);
          }}
        >
          {savingRooms.has(room._id || room.id) ? (
            <LoadingOutlined className="suggest-heart-loading" />
          ) : favorites.has(room._id || room.id) ? (
            <HeartFilled className="suggest-heart-filled" />
          ) : (
            <HeartOutlined className="suggest-heart-outlined" />
          )}
        </div>

        {/* Verified Badge - hiển thị nếu room có status available */}
        {room.status === "available" && (
          <div className="suggest-verified-badge">
            <CheckOutlined className="suggest-verified-icon" />
            <span className="suggest-verified-text">Có sẵn</span>
          </div>
        )}
      </div>

      {/* Room Details */}
      <div className="suggest-room-details">
        {/* AI Recommendation Badge - luôn hiển thị cho suggested rooms */}
        <div className="suggest-ai-badge">
          <span className="suggest-ai-text">AI đề xuất</span>
        </div>

        {/* Room Title */}
        <div className="suggest-room-title">
          {room.name || room.title || "Phòng trọ"}
        </div>

        {/* Price Section */}
        <div className="suggest-price-section">
          <div className="suggest-price">{formatPrice(room.price)} VNĐ</div>
          <div className="suggest-price-unit">/tháng</div>
        </div>

        {/* Location - hiển thị tên building và địa chỉ, kèm diện tích */}
        <div className="suggest-location">
          {room.buildingId && typeof room.buildingId === "object" ? (
            <>
              <div>
                {room.buildingId.name} -{" "}
                {room.buildingId.address?.street ||
                  room.buildingId.address?.ward ||
                  "Địa chỉ không xác định"}
              </div>
              <div style={{ marginTop: "5px" }}>
                {room.area}m² • {room.capacity} người
              </div>
            </>
          ) : room.address ? (
            <>
              <div>{room.address}</div>
              <div style={{ marginTop: "5px" }}>
                {room.area}m² • {room.capacity} người
              </div>
            </>
          ) : (
            <div>
              {room.area}m² • {room.capacity} người
            </div>
          )}
        </div>

        {/* Utilities Section */}
        {renderUtilities(room.utilities)}

        {/* Rating Section */}
        <div className="suggest-rating-section">
          <div className="suggest-stars">{renderStars()}</div>
          <div className="suggest-reviews">
            ({room.rating || 5} ⭐ - {room.viewCount || 0} lượt xem)
          </div>
        </div>

        {/* View Details Button */}
        <div
          className="suggest-details-button"
          onClick={() => handleViewDetails(room._id || room.id)}
        >
          <span className="suggest-details-text">Xem chi tiết</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="suggest-container">
      {/* Header Section */}
      <div className="suggest-header">
        <div className="suggest-header-content">
          <div className="suggest-title">Phòng gợi ý cho bạn</div>
          <div className="suggest-subtitle">
            Dựa trên sở thích và nhu cầu tìm kiếm của bạn.
          </div>
        </div>
        {/* <div className="suggest-view-all" onClick={handleViewAll}>
          Xem tất cả
        </div> */}
      </div>

      {/* Loading State */}
      {loading && (
        <div
          className="suggest-loading"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "200px",
            fontSize: "16px",
            color: "#666",
          }}
        >
          Đang tải phòng gợi ý...
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div
          className="suggest-error"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "200px",
            fontSize: "16px",
            color: "#ff4d4f",
          }}
        >
          {error}
        </div>
      )}

      {/* Content - chỉ hiển thị khi không loading và không có error */}
      {!loading && !error && safeRooms.length > 0 && (
        <div className="suggest-carousel-container">
          {/* Navigation Buttons */}
          {safeRooms.length > roomsPerView && (
            <>
              <button
                className={`suggest-nav-button suggest-nav-prev ${
                  currentIndex === 0 ? "disabled" : ""
                }`}
                onClick={handlePrevious}
                disabled={currentIndex === 0}
              >
                <LeftOutlined />
              </button>
              <button
                className={`suggest-nav-button suggest-nav-next ${
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
          <div className="suggest-rooms-grid">
            <div
              className="suggest-rooms-track"
              style={{
                transform: `translateX(-${currentIndex * (369.33 + 24)}px)`,
                transition: "transform 0.3s ease-in-out",
              }}
            >
              {safeRooms.length > 0
                ? safeRooms.map((room) => renderRoomCard(room))
                : null}
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && safeRooms.length === 0 && (
        <div
          className="suggest-empty"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "200px",
            fontSize: "16px",
            color: "#999",
          }}
        >
          Không có phòng gợi ý nào
        </div>
      )}
    </div>
  );
};

Suggest.propTypes = {
  loading: PropTypes.bool,
  onRoomLike: PropTypes.func,
  savedRoomIds: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  ),
};

export default Suggest;
