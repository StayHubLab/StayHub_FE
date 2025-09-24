import React, { useState, useEffect } from "react";
import { SearchOutlined, StarFilled, HeartFilled } from "@ant-design/icons";
import { Pagination } from "antd";
import "./SavedRoom.css";

const SavedRoom = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [savedRooms, setSavedRooms] = useState([]);

  // Mock room data (same as SearchRoom for consistency)
  const allRooms = [
    {
      id: 1,
      image: "https://placehold.co/369x180",
      title: "Phòng Trọ Cao Cấp 305",
      price: "3.200.000 VNĐ",
      location: "Quận Thanh Khê, Đà Nẵng",
      rating: 5,
      reviews: 28,
      isAIRecommended: true,
      isVerified: true,
    },
    {
      id: 2,
      image: "https://placehold.co/369x180",
      title: "Phòng Ban Công View Đẹp",
      price: "2.900.000 VNĐ",
      location: "Quận Sơn Trà, Đà Nẵng",
      rating: 5,
      reviews: 16,
      isAIRecommended: true,
      isVerified: true,
    },
    {
      id: 3,
      image: "https://placehold.co/369x180",
      title: "Phòng Ban Công View Đẹp",
      price: "2.900.000 VNĐ",
      location: "Quận Sơn Trà, Đà Nẵng",
      rating: 5,
      reviews: 16,
      isAIRecommended: true,
      isVerified: true,
    },
    {
      id: 4,
      image: "https://placehold.co/369x180",
      title: "Phòng Trọ Cao Cấp 305",
      price: "3.200.000 VNĐ",
      location: "Quận Thanh Khê, Đà Nẵng",
      rating: 5,
      reviews: 28,
      isAIRecommended: true,
      isVerified: true,
    },
    {
      id: 5,
      image: "https://placehold.co/369x180",
      title: "Phòng Ban Công View Đẹp",
      price: "2.900.000 VNĐ",
      location: "Quận Sơn Trà, Đà Nẵng",
      rating: 5,
      reviews: 16,
      isAIRecommended: true,
      isVerified: true,
    },
    {
      id: 6,
      image: "https://placehold.co/369x180",
      title: "Phòng Ban Công View Đẹp",
      price: "2.900.000 VNĐ",
      location: "Quận Sơn Trà, Đà Nẵng",
      rating: 5,
      reviews: 16,
      isAIRecommended: true,
      isVerified: true,
    },
  ];

  useEffect(() => {
    // Load favorites from localStorage
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

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
    console.log("Page changed:", page, "Size:", size);
  };

  const handleHeartClick = (roomId) => {
    // Get current favorites from localStorage
    const savedFavorites = localStorage.getItem("favoriteRooms");
    const currentFavorites = savedFavorites ? JSON.parse(savedFavorites) : [];

    if (currentFavorites.includes(roomId)) {
      // Remove from favorites
      const newFavorites = currentFavorites.filter((id) => id !== roomId);
      localStorage.setItem("favoriteRooms", JSON.stringify(newFavorites));
      // Remove from saved rooms
      setSavedRooms((current) => current.filter((room) => room.id !== roomId));
    } else {
      // Add to favorites
      const newFavorites = [...currentFavorites, roomId];
      localStorage.setItem("favoriteRooms", JSON.stringify(newFavorites));
      // Add to saved rooms
      const roomToAdd = allRooms.find((room) => room.id === roomId);
      if (roomToAdd) {
        setSavedRooms((current) => [...current, roomToAdd]);
      }
    }
  };

  return (
    <div className="saved-room-page">
      <div className="saved-room-container">
        {/* Header Section */}
        <div className="saved-room-header">
          <div className="saved-room-title-section">
            <div className="saved-room-title-text">Phòng đã lưu</div>
            <div className="saved-room-subtitle-text">
              {savedRooms.length} phòng đã được lưu
            </div>
          </div>
        </div>

        {/* Room Cards Grid or Empty State */}
        {savedRooms.length > 0 ? (
          <>
            <div className="saved-room-cards-grid">
              {savedRooms.map((room, index) => (
                <div
                  key={room.id}
                  className={`saved-room-card saved-room-card-${index + 1}`}
                >
                  {/* Room Image */}
                  <div className="saved-room-image-container">
                    <img
                      src={room.image}
                      alt={room.title}
                      className="saved-room-image"
                    />
                    {/* Heart Icon - Always filled since these are saved rooms */}
                    <div
                      className="saved-room-heart-icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleHeartClick(room.id);
                      }}
                    >
                      <HeartFilled className="saved-room-heart-filled" />
                    </div>
                    {room.isVerified && (
                      <div className="saved-room-verified-badge">
                        <div className="saved-room-verified-badge-icon">
                          <StarFilled />
                        </div>
                        <div className="saved-room-verified-badge-text">
                          Đã xác thực
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Room Content */}
                  <div className="saved-room-card-content">
                    {room.isAIRecommended && (
                      <div className="saved-room-ai-badge">
                        <div className="saved-room-ai-badge-text">
                          AI đề xuất
                        </div>
                      </div>
                    )}

                    <div className="saved-room-card-title">{room.title}</div>

                    <div className="saved-room-price-section">
                      <div className="saved-room-card-price">{room.price}</div>
                      <div className="saved-room-price-period">/tháng</div>
                    </div>

                    <div className="saved-room-card-location">
                      {room.location}
                    </div>

                    <div className="saved-room-rating-section">
                      <div className="saved-room-stars">
                        {[...Array(5)].map((_, starIndex) => (
                          <div key={starIndex} className="saved-room-star">
                            <StarFilled />
                          </div>
                        ))}
                      </div>
                      <div className="saved-room-review-count">
                        ({room.reviews} đánh giá)
                      </div>
                    </div>

                    <div className="saved-room-view-details">
                      <div className="saved-room-view-details-text">
                        Xem chi tiết
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {savedRooms.length > pageSize && (
              <div className="saved-room-pagination-container">
                <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  total={savedRooms.length}
                  onChange={handlePageChange}
                  showTotal={(total, range) =>
                    `${range[0]}-${range[1]} của ${total} phòng đã lưu`
                  }
                  className="saved-room-pagination"
                />
              </div>
            )}
          </>
        ) : (
          /* Empty State */
          <div className="saved-room-empty-state">
            <div className="saved-room-empty-icon">
              <HeartFilled />
            </div>
            <div className="saved-room-empty-title">
              Chưa có phòng nào được lưu
            </div>
            <div className="saved-room-empty-subtitle">
              Hãy khám phá và lưu những phòng trọ yêu thích của bạn
            </div>
            <div className="saved-room-empty-action">
              <button className="saved-room-explore-btn">
                <SearchOutlined />
                Khám phá phòng trọ
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedRoom;
