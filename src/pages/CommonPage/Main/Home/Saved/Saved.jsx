import React, { useState, useEffect } from "react";
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

const Saved = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [savedRooms, setSavedRooms] = useState([]);
  const roomsPerView = 3;
  const navigate = useNavigate();

  // All available rooms (same as in Suggest component for consistency)
  const allRooms = [
    {
      id: 1,
      title: "Phòng Trọ Cao Cấp 305",
      price: 3200000,
      location: "Quận Thanh Khê, Đà Nẵng",
      rating: 5,
      reviews: 28,
      image: "https://placehold.co/369x180",
      isVerified: true,
      isAiRecommended: true,
    },
    {
      id: 2,
      title: "Phòng Ban Công View Đẹp",
      price: 2900000,
      location: "Quận Sơn Trà, Đà Nẵng",
      rating: 5,
      reviews: 16,
      image: "https://placehold.co/369x180",
      isVerified: true,
      isAiRecommended: true,
    },
    {
      id: 3,
      title: "Phòng Trọ Sinh Viên",
      price: 2500000,
      location: "Quận Liên Chiểu, Đà Nẵng",
      rating: 5,
      reviews: 34,
      image: "https://placehold.co/369x180",
      isVerified: true,
      isAiRecommended: true,
    },
    {
      id: 4,
      title: "Căn Hộ Mini Tiện Nghi",
      price: 3300000,
      location: "Quận Cẩm Lệ, Đà Nẵng",
      rating: 5,
      reviews: 22,
      image: "https://placehold.co/369x180",
      isVerified: true,
      isAiRecommended: true,
    },
    {
      id: 5,
      title: "Căn Hộ Mini Trung Tâm",
      price: 3500000,
      location: "Quận Hải Châu, Đà Nẵng",
      rating: 5,
      reviews: 42,
      image: "https://placehold.co/369x180",
      isVerified: true,
      isAiRecommended: false,
    },
    {
      id: 6,
      title: "Phòng View Biển Mỹ Khê",
      price: 4200000,
      location: "Quận Sơn Trà, Đà Nẵng",
      rating: 5,
      reviews: 23,
      image: "https://placehold.co/369x180",
      isVerified: true,
      isAiRecommended: false,
    },
  ];

  const maxIndex = Math.max(0, savedRooms.length - roomsPerView);

  // Load favorites from localStorage and filter saved rooms
  useEffect(() => {
    const savedFavorites = localStorage.getItem("favoriteRooms");
    if (savedFavorites) {
      const favoriteIds = JSON.parse(savedFavorites);

      // Filter rooms that are favorited
      const favoritedRooms = allRooms.filter((room) =>
        favoriteIds.includes(room.id)
      );
      setSavedRooms(favoritedRooms);
    }
  }, []);

  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN");
  };

  const handleViewDetails = (roomId) => {
    navigate("/main/room-detail/" + roomId);
    console.log("View details clicked for room:", roomId);
  };

  const handleHeartClick = (roomId) => {
    // Get current favorites from localStorage
    const savedFavorites = localStorage.getItem("favoriteRooms");
    const currentFavorites = savedFavorites ? JSON.parse(savedFavorites) : [];

    if (currentFavorites.includes(roomId)) {
      // Remove from favorites
      const newFavorites = currentFavorites.filter((id) => id !== roomId);
      localStorage.setItem("favoriteRooms", JSON.stringify(newFavorites));
      // Remove from saved rooms display
      setSavedRooms((current) => current.filter((room) => room.id !== roomId));
    } else {
      // Add to favorites
      const newFavorites = [...currentFavorites, roomId];
      localStorage.setItem("favoriteRooms", JSON.stringify(newFavorites));
      // Add to saved rooms display
      const roomToAdd = allRooms.find((room) => room.id === roomId);
      if (roomToAdd) {
        setSavedRooms((current) => [...current, roomToAdd]);
      }
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

  const renderRoomCard = (room) => (
    <div key={room.id} className="saved-room-card">
      {/* Room Image */}
      <div className="saved-room-image-container">
        <img src={room.image} alt={room.title} className="saved-room-image" />

        {/* Heart Icon - Always filled since these are saved rooms */}
        <div
          className="saved-heart-icon"
          onClick={(e) => {
            e.stopPropagation();
            handleHeartClick(room.id);
          }}
        >
          <HeartFilled className="saved-heart-filled" />
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
        <div className="saved-location">{room.location}</div>

        {/* Rating Section */}
        <div className="saved-rating-section">
          <div className="saved-stars">{renderStars()}</div>
          <div className="saved-reviews">({room.reviews} đánh giá)</div>
        </div>

        {/* View Details Button */}
        <div
          className="saved-details-button"
          onClick={() => handleViewDetails(room.id)}
        >
          <span className="saved-details-text">Xem chi tiết</span>
        </div>
      </div>
    </div>
  );

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
                className={`saved-nav-button saved-nav-prev ${currentIndex === 0 ? "disabled" : ""}`}
                onClick={handlePrevious}
                disabled={currentIndex === 0}
              >
                <LeftOutlined />
              </button>
              <button
                className={`saved-nav-button saved-nav-next ${currentIndex === maxIndex ? "disabled" : ""}`}
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
