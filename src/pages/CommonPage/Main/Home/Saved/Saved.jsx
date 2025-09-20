import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './Saved.css';
import { HeartFilled, StarFilled, LeftOutlined, RightOutlined } from '@ant-design/icons';

const Saved = ({ 
  savedRooms = [
    {
      id: 1,
      title: "Căn Hộ Mini Trung Tâm",
      price: 3500000,
      location: "Quận Hải Châu, Đà Nẵng",
      rating: 5,
      reviews: 42,
      image: "https://placehold.co/369x180",
      isSaved: true
    },
    {
      id: 2,
      title: "Phòng View Biển Mỹ Khê",
      price: 4200000,
      location: "Quận Sơn Trà, Đà Nẵng",
      rating: 5,
      reviews: 23,
      image: "https://placehold.co/369x180",
      isSaved: true
    },
    {
      id: 3,
      title: "Phòng Studio Tiện Nghi",
      price: 3100000,
      location: "Quận Ngũ Hành Sơn, Đà Nẵng",
      rating: 5,
      reviews: 19,
      image: "https://placehold.co/369x180",
      isSaved: true
    },
    {
      id: 4,
      title: "Căn Hộ Duplex Cao Cấp",
      price: 5200000,
      location: "Quận Thanh Khê, Đà Nẵng",
      rating: 5,
      reviews: 31,
      image: "https://placehold.co/369x180",
      isSaved: true
    }
  ]
}) => {
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const roomsPerView = 3;
  const maxIndex = Math.max(0, savedRooms.length - roomsPerView);
  
  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN');
  };

  const handleViewAll = () => {
    console.log('View all saved rooms clicked');
  };

  const handleViewDetails = (roomId) => {
    console.log('View details clicked for room:', roomId);
  };

  const handleToggleSave = (roomId) => {
    console.log('Toggle save clicked for room:', roomId);
  };

  const handlePrevious = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(maxIndex, prev + 1));
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => (
      <StarFilled 
        key={index} 
        className="saved-star"
        style={{ color: '#FAC227' }}
      />
    ));
  };

  const renderRoomCard = (room) => (
    <div key={room.id} className="saved-room-card">
      {/* Room Image */}
      <div className="saved-room-image-container">
        <img 
          src={room.image} 
          alt={room.title}
          className="saved-room-image"
        />
        
        {/* Heart/Save Button */}
        <div 
          className="saved-heart-button"
          onClick={() => handleToggleSave(room.id)}
        >
          <HeartFilled className="saved-heart-icon" />
        </div>
      </div>

      {/* Room Details */}
      <div className="saved-room-details">
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
          <div className="saved-stars">
            {renderStars()}
          </div>
          <div className="saved-reviews">({room.reviews} đánh giá)</div>
        </div>

        {/* View Details Button */}
        <div className="saved-details-button" onClick={() => handleViewDetails(room.id)}>
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
          <div className="saved-subtitle">Danh sách các phòng bạn đang quan tâm.</div>
        </div>
        {/* <div className="saved-view-all" onClick={handleViewAll}>
          Xem tất cả
        </div> */}
      </div>

      {/* Carousel Container */}
      <div className="saved-carousel-container">
        {/* Navigation Buttons */}
        {savedRooms.length > roomsPerView && (
          <>
            <button 
              className={`saved-nav-button saved-nav-prev ${currentIndex === 0 ? 'disabled' : ''}`}
              onClick={handlePrevious}
              disabled={currentIndex === 0}
            >
              <LeftOutlined />
            </button>
            <button 
              className={`saved-nav-button saved-nav-next ${currentIndex === maxIndex ? 'disabled' : ''}`}
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
              transition: 'transform 0.3s ease-in-out'
            }}
          >
            {savedRooms.map(room => renderRoomCard(room))}
          </div>
        </div>
      </div>
    </div>
  );
};

Saved.propTypes = {
  savedRooms: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      location: PropTypes.string.isRequired,
      rating: PropTypes.number.isRequired,
      reviews: PropTypes.number.isRequired,
      image: PropTypes.string.isRequired,
      isSaved: PropTypes.bool
    })
  )
};

export default Saved;
