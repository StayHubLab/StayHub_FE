import React, { useState, useEffect, useCallback } from "react";
import { SearchOutlined, StarFilled, HeartFilled } from "@ant-design/icons";
import { Pagination, message, Spin } from "antd";
import { useAuth } from "../../../../contexts/AuthContext";
import savedRoomApi from "../../../../services/api/savedRoomApi";
import "./SavedRoom.css";

const SavedRoom = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [savedRooms, setSavedRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    // Mock room data (same as SearchRoom for consistency)
    const allRooms = [
      {
        id: 1,
        image: "https://placehold.co/369x180",
        title: "Phòng Trọ Cao Cấp 305",
        price: "3.200.000 VNĐ",
        location: "Quận Thanh Khê, Đà Nẵng",
        isAIRecommended: true,
        isVerified: true,
      },
      {
        id: 2,
        image: "https://placehold.co/369x180",
        title: "Phòng Ban Công View Đẹp",
        price: "2.900.000 VNĐ",
        location: "Quận Sơn Trà, Đà Nẵng",
        isAIRecommended: true,
        isVerified: true,
      },
      {
        id: 3,
        image: "https://placehold.co/369x180",
        title: "Phòng Ban Công View Đẹp",
        price: "2.900.000 VNĐ",
        location: "Quận Sơn Trà, Đà Nẵng",
        isAIRecommended: true,
        isVerified: true,
      },
      {
        id: 4,
        image: "https://placehold.co/369x180",
        title: "Phòng Trọ Cao Cấp 305",
        price: "3.200.000 VNĐ",
        location: "Quận Thanh Khê, Đà Nẵng",
        isAIRecommended: true,
        isVerified: true,
      },
      {
        id: 5,
        image: "https://placehold.co/369x180",
        title: "Phòng Ban Công View Đẹp",
        price: "2.900.000 VNĐ",
        location: "Quận Sơn Trà, Đà Nẵng",
        isAIRecommended: true,
        isVerified: true,
      },
      {
        id: 6,
        image: "https://placehold.co/369x180",
        title: "Phòng Ban Công View Đẹp",
        price: "2.900.000 VNĐ",
        location: "Quận Sơn Trà, Đà Nẵng",
        isAIRecommended: true,
        isVerified: true,
      },
    ];
    const initializeSavedRooms = async () => {
      if (user) {
        try {
          setLoading(true);
          const response = await savedRoomApi.getSavedRooms();

          if (response.success && response.data?.savedRooms) {
            // Transform API data to match component structure
            const transformedRooms = response.data.savedRooms.map(
              (savedRoom) => ({
                id: savedRoom.room._id,
                image:
                  savedRoom.room.images?.[0] || "https://placehold.co/369x180",
                title: savedRoom.room.title || savedRoom.room.name,
                price: `${
                  savedRoom.room.price?.rent?.toLocaleString() || 0
                } VNĐ`,
                location:
                  savedRoom.room.address ||
                  formatAddress(savedRoom.room.buildingId?.address),
                isAIRecommended: savedRoom.room.isAiRecommended || false,
                isVerified: savedRoom.room.isVerified || true,
                savedAt: savedRoom.savedAt,
              })
            );
            setSavedRooms(transformedRooms);
          } else {
            message.error("Không thể tải danh sách phòng đã lưu");
          }
        } catch (error) {
          console.error("Error fetching saved rooms:", error);
          message.error("Có lỗi xảy ra khi tải danh sách phòng đã lưu");
          // Fallback to localStorage
          loadFromLocalStorage();
        } finally {
          setLoading(false);
        }
      } else {
        // If no user, try localStorage for backward compatibility
        loadFromLocalStorage();
      }
    };

    const loadFromLocalStorage = () => {
      // Load favorites from localStorage (fallback for guest users)
      const savedFavorites = localStorage.getItem("favoriteRooms");
      if (savedFavorites) {
        const favoriteIds = JSON.parse(savedFavorites);
        // Filter rooms that are favorited
        const favoritedRooms = allRooms.filter((room) =>
          favoriteIds.includes(room.id)
        );
        setSavedRooms(favoritedRooms);
      }
      setLoading(false);
    };

    initializeSavedRooms();
  }, [user]);

  // Helper function to format address
  const formatAddress = (address) => {
    if (!address || typeof address !== "object")
      return "Địa chỉ không xác định";

    const parts = [
      address.street,
      address.ward,
      address.district,
      address.city,
    ].filter((part) => part && part.trim());

    return parts.length > 0 ? parts.join(", ") : "Địa chỉ không xác định";
  };

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
    console.log("Page changed:", page, "Size:", size);
  };

  const handleHeartClick = async (roomId) => {
    if (user) {
      // Use API for authenticated users
      try {
        // Check current status
        const statusResponse = await savedRoomApi.checkSavedStatus(roomId);

        if (statusResponse.success && statusResponse.data.isSaved) {
          // Remove from saved
          await savedRoomApi.unsaveRoom(roomId);
          setSavedRooms((current) =>
            current.filter((room) => room.id !== roomId)
          );
          message.success("Đã bỏ lưu phòng");
        } else {
          // Add to saved - this shouldn't happen in saved rooms page, but handle anyway
          await savedRoomApi.saveRoom(roomId);
          message.success("Đã lưu phòng");
        }

        // Refresh the list by calling API again
        window.location.reload(); // Simple refresh for now
      } catch (error) {
        console.error("Error updating saved room:", error);
        message.error("Có lỗi xảy ra khi cập nhật");
      }
    } else {
      // Fallback to localStorage for guest users
      const savedFavorites = localStorage.getItem("favoriteRooms");
      const currentFavorites = savedFavorites ? JSON.parse(savedFavorites) : [];

      if (currentFavorites.includes(roomId)) {
        // Remove from favorites
        const newFavorites = currentFavorites.filter((id) => id !== roomId);
        localStorage.setItem("favoriteRooms", JSON.stringify(newFavorites));
        setSavedRooms((current) =>
          current.filter((room) => room.id !== roomId)
        );
        message.success("Đã bỏ lưu phòng");
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

        {/* Loading State */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "50px 0" }}>
            <Spin size="large" />
            <div style={{ marginTop: 16 }}>
              Đang tải danh sách phòng đã lưu...
            </div>
          </div>
        ) : /* Room Cards Grid or Empty State */
        savedRooms.length > 0 ? (
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

                    <div className="saved-details-button">
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
