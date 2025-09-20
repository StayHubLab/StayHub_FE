import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './RoomImages.css';
import { CheckOutlined, PictureOutlined } from '@ant-design/icons';

const RoomImages = ({ 
  images = [
    "https://placehold.co/829x532",
    "https://placehold.co/411x206", 
    "https://placehold.co/201x314",
    "https://placehold.co/202x312",
    "https://placehold.co/300x200",
    "https://placehold.co/300x200",
    "https://placehold.co/300x200",
    "https://placehold.co/300x200",
    "https://placehold.co/300x200",
    "https://placehold.co/300x200",
    "https://placehold.co/300x200",
    "https://placehold.co/300x200",
    "https://placehold.co/300x200",
    "https://placehold.co/300x200",
    "https://placehold.co/300x200"
  ],
  isVerified = true,
  onViewAllImages,
  onImageClick
}) => {
  const [selectedImage, setSelectedImage] = useState(0);

  const handleImageClick = (index) => {
    setSelectedImage(index);
    if (onImageClick) {
      onImageClick(index);
    }
  };

  const handleViewAllClick = () => {
    if (onViewAllImages) {
      onViewAllImages();
    }
  };

  const remainingImagesCount = Math.max(0, images.length - 4);

  return (
    <div className="room-images-container">
      <div className="room-images-layout">
        {/* Main Large Image */}
        <div className="main-image-section">
          <img 
            className="main-image" 
            src={images[0]} 
            alt="Room main view"
            onClick={() => handleImageClick(0)}
          />
          {isVerified && (
            <div className="verification-badge">
              <div className="verification-icon">
                <CheckOutlined />
              </div>
              <div className="verification-text">
                Ảnh xác thực bởi StayHub
              </div>
            </div>
          )}
        </div>

        {/* Side Images Grid */}
        <div className="side-images-section">
          {/* Top Right Image */}
          <div className="side-image-container top-image">
            <img 
              className="side-image" 
              src={images[1] || images[0]} 
              alt="Room view 2"
              onClick={() => handleImageClick(1)}
            />
          </div>

          {/* Bottom Images Grid */}
          <div className="bottom-images-grid">
            {/* Bottom Left Image */}
            <div className="side-image-container bottom-left">
              <img 
                className="side-image" 
                src={images[2] || images[0]} 
                alt="Room view 3"
                onClick={() => handleImageClick(2)}
              />
            </div>

            {/* Bottom Right Image with Overlay */}
            <div className="side-image-container bottom-right">
              <img 
                className="side-image" 
                src={images[3] || images[0]} 
                alt="Room view 4"
                onClick={() => handleImageClick(3)}
              />
              {remainingImagesCount > 0 && (
                <div className="image-overlay">
                  <div className="overlay-text">
                    +{remainingImagesCount} ảnh
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* View All Button */}
        <div className="view-all-button" onClick={handleViewAllClick}>
          <div className="view-all-icon">
            <PictureOutlined />
          </div>
          <div className="view-all-text">
            Xem tất cả ảnh
          </div>
        </div>
      </div>
    </div>
  );
};

RoomImages.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string),
  isVerified: PropTypes.bool,
  onViewAllImages: PropTypes.func,
  onImageClick: PropTypes.func
};

export default RoomImages;
