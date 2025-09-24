import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './Review.css';
import { StarOutlined, StarFilled } from '@ant-design/icons';

const Review = ({ 
  roomData = {
    id: 1,
    name: "Phòng Trọ Hiện Đại Tầng 3",
    address: "K20/28 Nguyễn Hữu Thọ, Đà Nẵng",
    image: "https://placehold.co/64x64"
  },
  landlordData = {
    id: 1,
    name: "Anh Minh Tuấn",
    role: "Chủ trọ",
    avatar: "https://placehold.co/48x48"
  }
}) => {
  
  const [roomRating, setRoomRating] = useState(0);
  const [landlordRating, setLandlordRating] = useState(0);
  const [roomReview, setRoomReview] = useState('');
  const [landlordReview, setLandlordReview] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  const handleRoomRating = (rating) => {
    setRoomRating(rating);
  };

  const handleLandlordRating = (rating) => {
    setLandlordRating(rating);
  };

  const handleSubmitReview = () => {
    const reviewData = {
      roomId: roomData.id,
      landlordId: landlordData.id,
      roomRating,
      landlordRating,
      roomReview,
      landlordReview,
      isAnonymous
    };
    console.log('Submitting review:', reviewData);
    // Handle review submission logic here
  };

  const handleLater = () => {
    console.log('Review later clicked');
    // Handle review later logic here
  };

  const renderStars = (rating, onStarClick) => {
    return Array.from({ length: 5 }, (_, index) => {
      const starNumber = index + 1;
      return (
        <div 
          key={index} 
          className="star-container"
          onClick={() => onStarClick(starNumber)}
        >
          {starNumber <= rating ? (
            <StarFilled className="star-icon filled" />
          ) : (
            <StarOutlined className="star-icon empty" />
          )}
        </div>
      );
    });
  };

  return (
    <div className="review-container">
      {/* Header Section */}
      <div className="review-header">
        <div className="review-title">Đánh giá trải nghiệm của bạn</div>
        <div className="review-subtitle">
          Phản hồi của bạn giúp cộng đồng StayHub ngày càng tốt hơn!
        </div>
      </div>

      {/* Room Review Section */}
      <div className="review-section">
        <div className="section-title">Đánh giá phòng trọ</div>
        
        {/* Room Info */}
        <div className="room-info-card">
          <div className="room-info-content">
            <img 
              src={roomData.image} 
              alt={roomData.name}
              className="room-image"
            />
            <div className="room-details">
              <div className="room-name">{roomData.name}</div>
              <div className="room-address">{roomData.address}</div>
            </div>
          </div>
        </div>

        {/* Room Rating */}
        <div className="rating-section">
          <div className="stars-container">
            {renderStars(roomRating, handleRoomRating)}
          </div>
          <div className="rating-label">Chọn số sao để đánh giá</div>
        </div>

        {/* Room Review Text */}
        <div className="review-input-container">
          <textarea
            className="review-textarea"
            placeholder="Chia sẻ thêm về trải nghiệm của bạn với căn phòng (tiện nghi, vệ sinh, an ninh...)"
            value={roomReview}
            onChange={(e) => setRoomReview(e.target.value)}
          />
        </div>
      </div>

      {/* Landlord Review Section */}
      <div className="review-section">
        <div className="section-title">Đánh giá chủ trọ</div>
        
        {/* Landlord Info */}
        <div className="landlord-info-card">
          <div className="landlord-info-content">
            <img 
              src={landlordData.avatar} 
              alt={landlordData.name}
              className="landlord-avatar"
            />
            <div className="landlord-details">
              <div className="landlord-name">{landlordData.name}</div>
              <div className="landlord-role">{landlordData.role}</div>
            </div>
          </div>
        </div>

        {/* Landlord Rating */}
        <div className="rating-section">
          <div className="stars-container">
            {renderStars(landlordRating, handleLandlordRating)}
          </div>
          <div className="rating-label">Chọn số sao để đánh giá</div>
        </div>

        {/* Landlord Review Text */}
        <div className="review-input-container">
          <textarea
            className="review-textarea"
            placeholder="Chia sẻ về thái độ, sự hỗ trợ và cách quản lý của chủ trọ..."
            value={landlordReview}
            onChange={(e) => setLandlordReview(e.target.value)}
          />
        </div>
      </div>

      {/* Anonymous Checkbox */}
      <div className="checkbox-section">
        <div className="checkbox-container">
          <input
            type="checkbox"
            id="anonymous"
            className="checkbox-input"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
          />
          <label htmlFor="anonymous" className="checkbox-label">
            Tôi muốn giữ đánh giá ẩn danh
          </label>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="action-section">
        <button className="submit-button" onClick={handleSubmitReview}>
          Gửi đánh giá
        </button>
        <div className="later-link" onClick={handleLater}>
          Tôi sẽ đánh giá sau
        </div>
      </div>
    </div>
  );
};

Review.propTypes = {
  roomData: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired
  }),
  landlordData: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired
  })
};

export default Review;
