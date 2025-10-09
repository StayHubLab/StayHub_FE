import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./RoomInfo.css";
import {
  StarFilled,
  EnvironmentOutlined,
  CheckCircleOutlined,
  WifiOutlined,
  CarOutlined,
  HomeOutlined,
  SafetyOutlined,
  ClockCircleOutlined,
  SettingOutlined,
  SafetyCertificateOutlined,
  CleaningServicesOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import { Spin } from "antd";
import reviewApi from "../../../../../services/api/reviewApi";

const RoomInfo = ({ roomData, onViewAllReviews, onViewOnMap }) => {
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState({
    averageRating: 0,
    totalReviews: 0,
  });
  const [loadingReviews, setLoadingReviews] = useState(false);

  // Fetch reviews when component mounts or roomData changes
  useEffect(() => {
    const fetchReviews = async () => {
      if (!roomData?._id && !roomData?.id) return;
      
      try {
        setLoadingReviews(true);
        const roomId = roomData._id || roomData.id;
        
        const response = await reviewApi.getRoomReviews(roomId, {
          page: 1,
          limit: 10,
          sort: '-createdAt'
        });
        
        // API returns: { success, data: { reviews, pagination, statistics } }
        const fetchedReviews = response.data?.reviews || [];
        const statistics = response.data?.statistics || {};
        
        setReviews(fetchedReviews);
        setReviewStats({
          averageRating: statistics.averageRating || 0,
          totalReviews: statistics.totalReviews || 0,
        });
      } catch (error) {
        setReviews([]);
        setReviewStats({ averageRating: 0, totalReviews: 0 });
      } finally {
        setLoadingReviews(false);
      }
    };

    fetchReviews();
  }, [roomData]);

  // Safety check for roomData
  if (!roomData) {
    return <div>Loading room information...</div>;
  }

  // Format price display
  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN");
  };

  // Render star rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<StarFilled key={i} className="star-filled" />);
    }

    if (hasHalfStar) {
      stars.push(<StarFilled key="half" className="star-half" />);
    }

    while (stars.length < 5) {
      stars.push(<StarFilled key={stars.length} className="star-empty" />);
    }

    return stars;
  };

  // Get amenity icon
  const getAmenityIcon = (iconType) => {
    const iconMap = {
      aircon: "❄️",
      wifi: <WifiOutlined />,
      water: "🚿",
      parking: <CarOutlined />,
      kitchen: "🍳",
      flexible: <ClockCircleOutlined />,
      furniture: <HomeOutlined />,
      security: <SafetyCertificateOutlined />,
      cleaning: "🧹",
    };
    return iconMap[iconType] || <CheckCircleOutlined />;
  };

  // Handle view all reviews
  const handleViewAllReviews = () => {
    if (onViewAllReviews) {
      onViewAllReviews();
    }
  };

  // Handle view on map
  const handleViewOnMap = () => {
    if (onViewOnMap) {
      onViewOnMap();
    }
  };

  return (
    <div className="room-info-container">
      {/* Header Section */}
      <div className="room-header-section">
        <h1 className="room-title">{roomData.title}</h1>

        <div className="room-price-rating">
          <div className="price-section">
            <span className="room-price">
              {formatPrice(roomData.price)} VND{" "}
            </span>
            <span className="price-period">/tháng</span>
          </div>

          <div className="rating-section">
            <div className="stars-rating">
              {renderStars(reviewStats.averageRating || roomData.rating || 0)}
              <span className="rating-number">{(reviewStats.averageRating || roomData.rating || 0).toFixed(1)}</span>
            </div>
            <span className="review-users-count">
              ({reviewStats.totalReviews || roomData.reviewCount || 0} đánh giá)
            </span>
          </div>
        </div>

        {/* <button className="view-all-reviews-btn" onClick={handleViewAllReviews}>
          Xem tất cả đánh giá
        </button> */}

        <div className="location-section">
          <div className="address-row">
            <EnvironmentOutlined className="location-icon" />
            <span className="address-text">{roomData.address}</span>
          </div>
          <button className="view-map-btn" onClick={handleViewOnMap}>
            <EnvironmentOutlined className="map-icon" />
            <span className="address-text" style={{ color: "#4739F0" }}>
              Xem trên bản đồ
            </span>
          </button>
        </div>
      </div>

      {/* Description Section */}
      <div className="description-section">
        <h2 className="section-title">Mô tả</h2>
        <div className="description-content">
          {roomData.description.map((paragraph, index) => (
            <p key={index} className="description-paragraph">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      {/* Room Features Section */}
      <div className="amenities-section">
        <h2 className="section-title">Tính năng phòng</h2>
        <div className="amenities-grid">
          {roomData.features &&
            Object.entries(roomData.features).map(([key, value]) => {
              if (value === true) {
                const featureLabels = {
                  hasBalcony: "Ban công",
                  hasWindow: "Cửa sổ",
                  hasAircon: "Điều hòa",
                  hasWaterHeater: "Nóng lạnh",
                  hasKitchen: "Bếp",
                  hasWardrobe: "Tủ quần áo",
                  hasDesk: "Bàn học/làm việc",
                  hasTv: "TV",
                  hasInternet: "Internet",
                  hasElevator: "Thang máy",
                };

                const featureIcons = {
                  hasBalcony: "🏠",
                  hasWindow: "🪟",
                  hasAircon: "❄️",
                  hasWaterHeater: "🚿",
                  hasKitchen: "🍳",
                  hasWardrobe: "👔",
                  hasDesk: "📚",
                  hasTv: "📺",
                  hasInternet: "📶",
                  hasElevator: "🛗",
                };

                return (
                  <div key={key} className="amenity-item">
                    <CheckOutlined />
                    <span className="amenity-name">
                      {featureLabels[key] || key}
                    </span>
                  </div>
                );
              }
              return null;
            })}
        </div>
      </div>

      {/* Utilities Section */}
      {roomData.utilities && roomData.utilities.length > 0 && (
        <div className="amenities-section">
          <h2 className="section-title">Tiện ích</h2>
          <div className="amenities-grid">
            {roomData.utilities.map((utility, index) => (
              <div key={index} className="amenity-item">
                <div className="amenity-icon">
                  <CheckOutlined />
                </div>
                <span className="amenity-name">{utility.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rules Section */}
      <div className="rules-section">
        <h2 className="section-title">Quy định của chỗ trọ</h2>
        <div className="rules-list">
          {roomData.rules.map((rule, index) => (
            <div key={index} className="rule-item">
              <span className="rule-bullet">•</span>
              <span className="rule-text">{rule}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Room Details Section */}
      <div className="details-section">
        <h2 className="section-title">Chi tiết phòng</h2>
        <div className="details-grid">
          <div className="detail-row">
            <div className="detail-item">
              <span className="detail-label">Diện tích:</span>
              <span className="detail-value">{roomData.details.area}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Số người tối đa:</span>
              <span className="detail-value">
                {roomData.details.maxOccupancy}
              </span>
            </div>
          </div>
          <div className="detail-row">
            <div className="detail-item">
              <span className="detail-label">Số phòng ngủ:</span>
              <span className="detail-value">{roomData.details.bedrooms}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Số phòng tắm:</span>
              <span className="detail-value">{roomData.details.bathrooms}</span>
            </div>
          </div>
          <div className="detail-row">
            <div className="detail-item">
              <span className="detail-label">Tình trạng:</span>
              <span className="detail-value status-available">
                {roomData.details.status}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Có thể dọn vào:</span>
              <span className="detail-value">
                {roomData.details.availability}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="reviews-users-section">
        <div className="reviews-users-header">
          <h2 className="section-title">Đánh giá từ người thuê</h2>
          <button
            className="view-all-reviews-users-link"
            onClick={handleViewAllReviews}
          >
            Xem tất cả đánh giá
          </button>
        </div>

        {/* Rating Summary */}
        <div className="rating-summary">
          <div className="overall-rating">
            <div className="stars-rating">
              {renderStars(reviewStats.averageRating || roomData.rating || 0)}
              <span className="rating-number">{(reviewStats.averageRating || roomData.rating || 0).toFixed(1)}</span>
            </div>
            <span className="review-users-count">
              ({reviewStats.totalReviews || roomData.reviewCount || 0} đánh giá)
            </span>
          </div>
        </div>

        {/* Rating Breakdown */}
        {/* <div className="rating-breakdown">
          <div className="rating-category">
            <span className="category-label">Vị trí</span>
            <div className="rating-bar">
              <div
                className="rating-fill"
                style={{
                  width: `${(roomData.ratingBreakdown.location / 5) * 100}%`,
                }}
              />
            </div>
            <span className="category-score">
              {roomData.ratingBreakdown.location}
            </span>
          </div>
          <div className="rating-category">
            <span className="category-label">Sạch sẽ</span>
            <div className="rating-bar">
              <div
                className="rating-fill"
                style={{
                  width: `${(roomData.ratingBreakdown.cleanliness / 5) * 100}%`,
                }}
              />
            </div>
            <span className="category-score">
              {roomData.ratingBreakdown.cleanliness}
            </span>
          </div>
          <div className="rating-category">
            <span className="category-label">Tiện nghi</span>
            <div className="rating-bar">
              <div
                className="rating-fill"
                style={{
                  width: `${(roomData.ratingBreakdown.amenities / 5) * 100}%`,
                }}
              />
            </div>
            <span className="category-score">
              {roomData.ratingBreakdown.amenities}
            </span>
          </div>
          <div className="rating-category">
            <span className="category-label">Chủ nhà</span>
            <div className="rating-bar">
              <div
                className="rating-fill"
                style={{
                  width: `${(roomData.ratingBreakdown.landlord / 5) * 100}%`,
                }}
              />
            </div>
            <span className="category-score">
              {roomData.ratingBreakdown.landlord}
            </span>
          </div>
        </div> */}

        {/* Individual Reviews */}
        <div className="reviews-users-list">
          {loadingReviews ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <Spin size="large" tip="Đang tải đánh giá..." />
            </div>
          ) : reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review._id || review.id} className="review-users-item">
                <div className="review-users-header">
                  <img
                    src={review.createdBy?.avatar || review.renterId?.avatar || 'https://ui-avatars.com/api/?name=' + (review.createdBy?.name || review.renterId?.name || 'User')}
                    alt={review.createdBy?.name || review.renterId?.name || 'User'}
                    className="reviewer-users-avatar"
                    onError={(e) => {
                      e.target.src = 'https://ui-avatars.com/api/?name=User&background=4739F0&color=fff';
                    }}
                  />
                  <div className="reviewer-users-info">
                    <div className="reviewer-users-name">
                      {review.createdBy?.name || review.renterId?.name || 'Người dùng'}
                    </div>
                    <div className="review-users-date">
                      {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                    </div>
                  </div>
                </div>
                <div className="review-users-rating">
                  {renderStars(review.rating)}
                </div>
                <p className="review-users-comment">{review.comment}</p>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
              Chưa có đánh giá nào
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

RoomInfo.propTypes = {
  roomData: PropTypes.shape({
    title: PropTypes.string,
    price: PropTypes.number,
    rating: PropTypes.number,
    reviewCount: PropTypes.number,
    address: PropTypes.string,
    description: PropTypes.arrayOf(PropTypes.string),
    amenities: PropTypes.arrayOf(
      PropTypes.shape({
        icon: PropTypes.string,
        name: PropTypes.string,
      })
    ),
    rules: PropTypes.arrayOf(PropTypes.string),
    details: PropTypes.object,
    ratingBreakdown: PropTypes.object,
    reviews: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  onViewAllReviews: PropTypes.func,
  onViewOnMap: PropTypes.func,
};

export default RoomInfo;
