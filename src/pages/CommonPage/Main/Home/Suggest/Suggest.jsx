import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './Suggest.css';
import { CheckOutlined, StarFilled, LeftOutlined, RightOutlined, HeartOutlined, HeartFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const Suggest = ({ 
  suggestedRooms = [
    {
      id: 1,
      title: "Phòng Trọ Cao Cấp 305",
      price: 3200000,
      location: "Quận Thanh Khê, Đà Nẵng",
      rating: 5,
      reviews: 28,
      image: "https://placehold.co/369x180",
      isVerified: true,
      isAiRecommended: true
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
      isAiRecommended: true
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
      isAiRecommended: true
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
        isAiRecommended: true
    }
  ]
}) => {
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [favorites, setFavorites] = useState(new Set()); // Track favorited room IDs
  const roomsPerView = 3;
  const maxIndex = Math.max(0, suggestedRooms.length - roomsPerView);
  const navigate = useNavigate();
  
  // Load favorites from localStorage on component mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favoriteRooms');
    if (savedFavorites) {
      const favoriteIds = JSON.parse(savedFavorites);
      setFavorites(new Set(favoriteIds));
    }
  }, []);
  
  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN');
  };

  const handleViewAll = () => {
    console.log('View all suggested rooms clicked');
  };

  const handleViewDetails = (roomId) => {
    navigate('/main/room-detail/' + roomId);

    console.log('View details clicked for room:', roomId);
  };

  const handlePrevious = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(maxIndex, prev + 1));
  };

  const handleHeartClick = (roomId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(roomId)) {
        newFavorites.delete(roomId);
      } else {
        newFavorites.add(roomId);
      }
      // Store in localStorage for persistence
      localStorage.setItem('favoriteRooms', JSON.stringify([...newFavorites]));
      return newFavorites;
    });
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => (
      <StarFilled 
        key={index} 
        className="suggest-star"
        style={{ color: '#FAC227' }}
      />
    ));
  };

  const renderRoomCard = (room) => (
    <div key={room.id} className="suggest-room-card">
      {/* Room Image */}
      <div className="suggest-room-image-container">
        <img 
          src={room.image} 
          alt={room.title}
          className="suggest-room-image"
        />
        
        {/* Heart Icon */}
        <div 
          className="suggest-heart-icon" 
          onClick={(e) => {
            e.stopPropagation();
            handleHeartClick(room.id);
          }}
        >
          {favorites.has(room.id) ? (
            <HeartFilled className="suggest-heart-filled" />
          ) : (
            <HeartOutlined className="suggest-heart-outlined" />
          )}
        </div>
        
        {/* Verified Badge */}
        {room.isVerified && (
          <div className="suggest-verified-badge">
            <CheckOutlined className="suggest-verified-icon" />
            <span className="suggest-verified-text">Đã xác thực</span>
          </div>
        )}
      </div>

      {/* Room Details */}
      <div className="suggest-room-details">
        {/* AI Recommendation Badge */}
        {room.isAiRecommended && (
          <div className="suggest-ai-badge">
            <span className="suggest-ai-text">AI đề xuất</span>
          </div>
        )}

        {/* Room Title */}
        <div className="suggest-room-title">{room.title}</div>

        {/* Price Section */}
        <div className="suggest-price-section">
          <div className="suggest-price">{formatPrice(room.price)} VNĐ</div>
          <div className="suggest-price-unit">/tháng</div>
        </div>

        {/* Location */}
        <div className="suggest-location">{room.location}</div>

        {/* Rating Section */}
        <div className="suggest-rating-section">
          <div className="suggest-stars">
            {renderStars()}
          </div>
          <div className="suggest-reviews">({room.reviews} đánh giá)</div>
        </div>

        {/* View Details Button */}
        <div className="suggest-details-button" onClick={() => handleViewDetails(room.id)}>
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
          <div className="suggest-subtitle">Dựa trên sở thích và nhu cầu tìm kiếm của bạn.</div>
        </div>
        {/* <div className="suggest-view-all" onClick={handleViewAll}>
          Xem tất cả
        </div> */}
      </div>

      {/* Carousel Container */}
      <div className="suggest-carousel-container">
        {/* Navigation Buttons */}
        {suggestedRooms.length > roomsPerView && (
          <>
            <button 
              className={`suggest-nav-button suggest-nav-prev ${currentIndex === 0 ? 'disabled' : ''}`}
              onClick={handlePrevious}
              disabled={currentIndex === 0}
            >
              <LeftOutlined />
            </button>
            <button 
              className={`suggest-nav-button suggest-nav-next ${currentIndex === maxIndex ? 'disabled' : ''}`}
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
              transition: 'transform 0.3s ease-in-out'
            }}
          >
            {suggestedRooms.map(room => renderRoomCard(room))}
          </div>
        </div>
      </div>
    </div>
  );
};

Suggest.propTypes = {
  suggestedRooms: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      location: PropTypes.string.isRequired,
      rating: PropTypes.number.isRequired,
      reviews: PropTypes.number.isRequired,
      image: PropTypes.string.isRequired,
      isVerified: PropTypes.bool,
      isAiRecommended: PropTypes.bool
    })
  )
};

export default Suggest;
