import React, { useState, useEffect } from 'react';
import { SearchOutlined, TableOutlined, EnvironmentOutlined, StarFilled, HeartOutlined, HeartFilled } from '@ant-design/icons';
import { Pagination } from 'antd';
import './FindRoom.css';

const FindRoom = () => {
  const [searchParams, setSearchParams] = useState({
    location: '',
    priceFrom: '',
    priceTo: '',
    roomType: 'all',
    area: '',
    amenities: '',
    rentalPeriod: '',
    verified: false,
    sortBy: 'newest'
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [favorites, setFavorites] = useState(new Set()); // Track favorited room IDs

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favoriteRooms');
    if (savedFavorites) {
      const favoriteIds = JSON.parse(savedFavorites);
      setFavorites(new Set(favoriteIds));
    }
  }, []);

  const handleInputChange = (field, value) => {
    setSearchParams(prev => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    console.log('Search params:', searchParams);
  };

  const handleVerifiedToggle = () => {
    handleInputChange('verified', !searchParams.verified);
  };

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
    console.log('Page changed:', page, 'Size:', size);
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

  // Mock room data
  const mockRooms = [
    {
      id: 1,
      image: 'https://placehold.co/369x180',
      title: 'Phòng Trọ Cao Cấp 305',
      price: '3.200.000 VNĐ',
      location: 'Quận Thanh Khê, Đà Nẵng',
      rating: 5,
      reviews: 28,
      isAIRecommended: true,
      isVerified: true
    },
    {
      id: 2,
      image: 'https://placehold.co/369x180',
      title: 'Phòng Ban Công View Đẹp',
      price: '2.900.000 VNĐ',
      location: 'Quận Sơn Trà, Đà Nẵng',
      rating: 5,
      reviews: 16,
      isAIRecommended: true,
      isVerified: true
    },
    {
      id: 3,
      image: 'https://placehold.co/369x180',
      title: 'Phòng Ban Công View Đẹp',
      price: '2.900.000 VNĐ',
      location: 'Quận Sơn Trà, Đà Nẵng',
      rating: 5,
      reviews: 16,
      isAIRecommended: true,
      isVerified: true
    },
    {
      id: 4,
      image: 'https://placehold.co/369x180',
      title: 'Phòng Trọ Cao Cấp 305',
      price: '3.200.000 VNĐ',
      location: 'Quận Thanh Khê, Đà Nẵng',
      rating: 5,
      reviews: 28,
      isAIRecommended: true,
      isVerified: true
    },
    {
      id: 5,
      image: 'https://placehold.co/369x180',
      title: 'Phòng Ban Công View Đẹp',
      price: '2.900.000 VNĐ',
      location: 'Quận Sơn Trà, Đà Nẵng',
      rating: 5,
      reviews: 16,
      isAIRecommended: true,
      isVerified: true
    },
    {
      id: 6,
      image: 'https://placehold.co/369x180',
      title: 'Phòng Ban Công View Đẹp',
      price: '2.900.000 VNĐ',
      location: 'Quận Sơn Trà, Đà Nẵng',
      rating: 5,
      reviews: 16,
      isAIRecommended: true,
      isVerified: true
    }
  ];

  return (
    <div className="search-room-page">
      <div className="search-room-container">
        {/* Main Search Bar */}
        <div className="search-room-bar-main">
          <div className="search-room-bar-content">
            {/* Location Field */}
            <div className="search-room-location-field">
              <div className="search-room-field-label">Địa điểm</div>
              <div className="search-room-location-input-wrapper">
                <div className="search-room-location-input-container">
                  <input 
                    className="search-room-location-input"
                    placeholder="Quận, phường..."
                    value={searchParams.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                  />
                </div>
                <div className="search-room-location-icon">
                  <EnvironmentOutlined />
                </div>
              </div>
            </div>

            {/* Price Range Field */}
            <div className="search-room-price-field">
              <div className="search-room-field-label">Khoảng giá</div>
              <div className="search-room-price-inputs-wrapper">
                <div className="search-room-price-input-container">
                  <input 
                    className="search-room-price-input"
                    placeholder="Từ"
                    value={searchParams.priceFrom}
                    onChange={(e) => handleInputChange('priceFrom', e.target.value)}
                  />
                </div>
                <div className="search-room-price-input-container">
                  <input 
                    className="search-room-price-input"
                    placeholder="Đến"
                    value={searchParams.priceTo}
                    onChange={(e) => handleInputChange('priceTo', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Room Type Field */}
            <div className="search-room-type-field">
              <div className="search-room-field-label">Loại phòng</div>
              <div className="search-room-type-select-wrapper">
                <div className="search-room-type-text">Tất cả loại phòng</div>
                <div className="search-room-dropdown-arrow">
                  <svg width="15.52" height="9.32" viewBox="0 0 16 10">
                    <path d="M1 1L8 8L15 1" stroke="black" strokeWidth="2" fill="none"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Search Buttons */}
            <div className="search-room-buttons">
              <div className="search-room-button" onClick={handleSearch}>
                <div className="search-room-icon">
                  <SearchOutlined />
                </div>
                <div className="search-room-text">Tìm kiếm</div>
              </div>
              <div className="search-room-filter-button">
                <div className="search-room-filter-icon">
                  <TableOutlined />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Filters */}
        <div className="search-room-secondary-filters">
          {/* Area Filter */}
          <div className="search-room-secondary-filter search-room-area-filter">
            <div className="search-room-secondary-filter-wrapper">
              <div className="search-room-secondary-filter-text">Diện tích (m²)</div>
              <div className="search-room-secondary-dropdown-arrow">
                <svg width="13.02" height="7.82" viewBox="0 0 14 8">
                  <path d="M1 1L7 7L13 1" stroke="black" strokeWidth="2" fill="none"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Amenities Filter */}
          <div className="search-room-secondary-filter search-room-amenities-filter">
            <div className="search-room-secondary-filter-wrapper">
              <div className="search-room-secondary-filter-text">Tiện ích</div>
              <div className="search-room-secondary-dropdown-arrow">
                <svg width="13.02" height="7.82" viewBox="0 0 14 8">
                  <path d="M1 1L7 7L13 1" stroke="black" strokeWidth="2" fill="none"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Rental Period Filter */}
          <div className="search-room-secondary-filter search-room-period-filter">
            <div className="search-room-secondary-filter-wrapper">
              <div className="search-room-secondary-filter-text">Thời hạn thuê</div>
              <div className="search-room-secondary-dropdown-arrow">
                <svg width="13.02" height="7.82" viewBox="0 0 14 8">
                  <path d="M1 1L7 7L13 1" stroke="black" strokeWidth="2" fill="none"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Verified Filter */}
          <div className={`search-room-verified-filter ${searchParams.verified ? 'active' : ''}`} onClick={handleVerifiedToggle}>
            <div className="search-room-verified-icon">
              <StarFilled />
            </div>
            <div className="search-room-verified-text">Đã xác minh</div>
          </div>
        </div>

        {/* Header Section with Title and Sort */}
        <div className="search-room-header">
          <div className="search-room-suggestions-title">
            <div className="search-room-title-text">Gợi ý dành cho bạn</div>
          </div>
          <div className="search-room-sort-section">
            <div className="search-room-sort-label">Sắp xếp theo:</div>
            <div className="search-room-sort-dropdown">
              <div className="search-room-sort-text">Mới nhất</div>
              <div className="search-room-sort-arrow">
                <svg width="11.02" height="6.62" viewBox="0 0 12 7">
                  <path d="M1 1L6 6L11 1" stroke="black" strokeWidth="2" fill="none"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Room Cards Grid */}
        <div className="search-room-cards-grid">
          {mockRooms.map((room, index) => (
            <div key={room.id} className={`search-room-card search-room-card-${index + 1}`}>
              {/* Room Image */}
              <div className="search-room-image-container">
                <img 
                  src={room.image} 
                  alt={room.title}
                  className="search-room-image"
                />
                {/* Heart Icon */}
                <div 
                  className="search-room-heart-icon" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleHeartClick(room.id);
                  }}
                >
                  {favorites.has(room.id) ? (
                    <HeartFilled className="search-room-heart-filled" />
                  ) : (
                    <HeartOutlined className="search-room-heart-outlined" />
                  )}
                </div>
                {/* Verified Badge */}
                {room.isVerified && (
                  <div className="search-room-verified-badge">
                    <div className="search-room-verified-badge-icon">
                      <StarFilled />
                    </div>
                    <div className="search-room-verified-badge-text">Đã xác thực</div>
                  </div>
                )}
              </div>

              {/* Room Content */}
              <div className="search-room-card-content">
                {room.isAIRecommended && (
                  <div className="search-room-ai-badge">
                    <div className="search-room-ai-badge-text">AI đề xuất</div>
                  </div>
                )}
                
                <div className="search-room-card-title">{room.title}</div>
                
                <div className="search-room-price-section">
                  <div className="search-room-card-price">{room.price}</div>
                  <div className="search-room-price-period">/tháng</div>
                </div>
                
                <div className="search-room-card-location">{room.location}</div>
                
                <div className="search-room-rating-section">
                  <div className="search-room-stars">
                    {[...Array(5)].map((_, starIndex) => (
                      <div key={starIndex} className="search-room-star">
                        <StarFilled />
                      </div>
                    ))}
                  </div>
                  <div className="search-room-review-count">({room.reviews} đánh giá)</div>
                </div>
                
                <div className="search-room-view-details">
                  <div className="search-room-view-details-text">Xem chi tiết</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Pagination */}
        <div className="search-room-pagination-container">
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={50} // Mock total - replace with actual total from API
            onChange={handlePageChange}
            onShowSizeChange={handlePageChange}
            showTotal={(total, range) => 
              `${range[0]}-${range[1]} của ${total} phòng`
            }
            className="search-room-pagination"
          />
        </div>
      </div>
    </div>
  );
};

export default FindRoom;