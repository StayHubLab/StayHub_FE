import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  SearchOutlined,
  TableOutlined,
  EnvironmentOutlined,
  StarFilled,
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
  CheckOutlined,
} from "@ant-design/icons";
import { Pagination, Spin, Empty, App } from "antd";
import roomApi from "../../../../services/api/roomApi";
import savedRoomApi from "../../../../services/api/savedRoomApi";
import { useAuth } from "../../../../contexts/AuthContext";
import "./FindRoom.css";

const FindRoom = () => {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useState({
    location: "",
    priceFrom: "",
    priceTo: "",
    roomType: "all",
    area: "",
    amenities: "",
    rentalPeriod: "",
    verified: false,
    sortBy: "newest",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [favorites, setFavorites] = useState(new Set()); // Track favorited room IDs
  const [savingRooms, setSavingRooms] = useState(new Set()); // Track rooms being saved/unsaved

  // API related states
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRooms, setTotalRooms] = useState(0);
  const [error, setError] = useState(null);

  // Load saved rooms (backend when authenticated, else localStorage)
  const loadSavedRooms = useCallback(async () => {
    if (!isAuthenticated || !user || !(user._id || user.id)) {
      const savedFavorites = localStorage.getItem("favoriteRooms");
      if (savedFavorites) {
        const favoriteIds = JSON.parse(savedFavorites);
        setFavorites(new Set(favoriteIds));
      }
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
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
      // fallback to localStorage
      const savedFavorites = localStorage.getItem("favoriteRooms");
      if (savedFavorites) {
        const favoriteIds = JSON.parse(savedFavorites);
        setFavorites(new Set(favoriteIds));
      }
    }
  }, [isAuthenticated, user]);

  // Fetch rooms from API
  const fetchRooms = useCallback(
    async (searchFilters = {}) => {
      try {
        setLoading(true);
        setError(null);

        // Map UI filters to backend params
        const mapSortBy = (sb) => {
          switch (sb) {
            case "priceAsc":
              return "price";
            case "priceDesc":
              return "price";
            case "rating":
              return "rating";
            case "newest":
            default:
              return "createdAt";
          }
        };

        const sortBy = mapSortBy(searchParams.sortBy);

        const params = {
          page: currentPage,
          limit: pageSize,
          sortBy: sortBy,
          status: "available", // Add status filter back
          minPrice: searchParams.priceFrom || undefined,
          maxPrice: searchParams.priceTo || undefined,
          minArea: searchParams.area || undefined,
          type:
            searchParams.roomType && searchParams.roomType !== "all"
              ? searchParams.roomType
              : undefined,
          amenities: searchParams.amenities || undefined,
          verified: searchParams.verified || undefined,
          ...searchFilters,
        };

        // Remove empty parameters
        Object.keys(params).forEach((key) => {
          if (params[key] === "" || params[key] === undefined) {
            delete params[key];
          }
        });

        const hasSearchKeyword =
          searchFilters.location || searchParams.location;
        let response;

        // Add location search if present
        if (hasSearchKeyword) {
          params.search = hasSearchKeyword;
        }

        if (hasSearchKeyword) {
          const sp = {
            ...params,
            keyword: searchFilters.location || searchParams.location,
          };
          response = await roomApi.searchRooms(sp);
        } else {
          response = await roomApi.getAllRooms(params);
        }

        let roomsData = [];
        let totalCount = 0;

        console.log("API Response:", response);
        console.log("Has search keyword:", hasSearchKeyword);

        if (response?.success) {
          // Handle different response structures
          if (hasSearchKeyword) {
            // Search response structure: {data: {rooms: [...], pagination: {...}}}
            roomsData = Array.isArray(response.data?.rooms)
              ? response.data.rooms
              : Array.isArray(response.data)
              ? response.data
              : Array.isArray(response?.rooms)
              ? response.rooms
              : [];
            totalCount =
              response.data?.pagination?.total ||
              response.total ||
              roomsData.length ||
              0;
            console.log("Search rooms data:", roomsData);
            console.log("Search total count:", totalCount);
          } else {
            // GetAllRooms returns {rooms: [...], pagination: {...}}
            roomsData = Array.isArray(response.data?.rooms)
              ? response.data.rooms
              : Array.isArray(response?.rooms)
              ? response.rooms
              : [];
            totalCount = response.data?.pagination?.total || 0;
          }
        } else {
          setError("Không thể tải danh sách phòng");
          message.error("Không thể tải danh sách phòng");
          setRooms([]); // Ensure rooms is always an array
        }

        // If no rooms found, try fallback queries
        if (roomsData.length === 0 && !hasSearchKeyword) {
          try {
            const fallbackParams = [
              {
                limit: pageSize,
                status: "available",
                sortBy: "rating",
              },
              {
                limit: pageSize,
                status: "available",
                sortBy: "createdAt",
              },
              { limit: pageSize, status: "available" },
              // Try without status filter
              { limit: pageSize, sortBy: "rating" },
              { limit: pageSize, sortBy: "createdAt" },
              { limit: pageSize },
            ];

            for (const fallbackParam of fallbackParams) {
              const fallbackResponse = await roomApi.getAllRooms({
                ...fallbackParam,
              });
              if (fallbackResponse?.success) {
                const fallbackRooms = Array.isArray(
                  fallbackResponse.data?.rooms
                )
                  ? fallbackResponse.data.rooms
                  : Array.isArray(fallbackResponse?.rooms)
                  ? fallbackResponse.rooms
                  : [];
                if (fallbackRooms.length > 0) {
                  roomsData = fallbackRooms;
                  totalCount =
                    fallbackResponse.data?.pagination?.total ||
                    fallbackRooms.length;
                  break;
                }
              }
            }
          } catch (fallbackError) {
            console.error("Fallback queries failed:", fallbackError);
          }
        }

        setRooms(roomsData);
        setTotalRooms(totalCount);
      } catch (error) {
        console.error("Error fetching rooms:", error);
        setError("Đã xảy ra lỗi khi tải dữ liệu");
        message.error("Đã xảy ra lỗi khi tải dữ liệu");
        setRooms([]);
      } finally {
        setLoading(false);
      }
    },
    [currentPage, pageSize, searchParams, message]
  );

  // Handle search query from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchQuery = urlParams.get("search");

    if (searchQuery) {
      setSearchParams((prev) => ({
        ...prev,
        location: searchQuery,
      }));
    }
  }, [location.search]);

  // Load favorites and initial rooms
  useEffect(() => {
    const init = async () => {
      await loadSavedRooms();
      await fetchRooms();
    };
    init();
  }, [loadSavedRooms, fetchRooms]);

  // Fetch rooms when search params change
  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  // Refresh data when page or pageSize changes
  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const handleInputChange = (field, value) => {
    setSearchParams((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    console.log("Search params:", searchParams);
    // Create search filters from searchParams
    const searchFilters = {};

    if (searchParams.location) searchFilters.location = searchParams.location;
    if (searchParams.priceFrom)
      searchFilters.priceFrom = searchParams.priceFrom;
    if (searchParams.priceTo) searchFilters.priceTo = searchParams.priceTo;
    if (searchParams.roomType && searchParams.roomType !== "all")
      searchFilters.roomType = searchParams.roomType;
    if (searchParams.area) searchFilters.area = searchParams.area;
    if (searchParams.amenities)
      searchFilters.amenities = searchParams.amenities;
    if (searchParams.rentalPeriod)
      searchFilters.rentalPeriod = searchParams.rentalPeriod;
    if (searchParams.verified) searchFilters.verified = searchParams.verified;
    if (searchParams.sortBy) searchFilters.sortBy = searchParams.sortBy;

    // Reset to first page when searching
    setCurrentPage(1);
    fetchRooms(searchFilters);
  };

  const handleVerifiedToggle = () => {
    handleInputChange("verified", !searchParams.verified);
  };

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
    console.log("Page changed:", page, "Size:", size);
    // Note: fetchRooms will be called automatically by useEffect when currentPage/pageSize changes
  };

  const handleHeartClick = async (roomId) => {
    if (savingRooms.has(roomId)) return;

    const isFavorited = favorites.has(roomId);
    try {
      setSavingRooms((prev) => new Set([...prev, roomId]));

      const token = localStorage.getItem("token");
      if (isAuthenticated && user && (user._id || user.id) && token) {
        if (isFavorited) {
          await savedRoomApi.unsaveRoom(roomId);
          message.success("Đã bỏ lưu phòng");
        } else {
          await savedRoomApi.saveRoom(roomId);
          message.success("Đã lưu phòng vào danh sách yêu thích");
        }
      } else {
        const savedFavorites = localStorage.getItem("favoriteRooms");
        const currentFavorites = savedFavorites
          ? JSON.parse(savedFavorites)
          : [];
        const updated = isFavorited
          ? currentFavorites.filter((id) => id !== roomId)
          : [...currentFavorites, roomId];
        localStorage.setItem("favoriteRooms", JSON.stringify(updated));
        message.success(
          isFavorited
            ? "Đã bỏ lưu phòng"
            : "Đã lưu phòng vào danh sách yêu thích"
        );
      }

      setFavorites((prev) => {
        const next = new Set(prev);
        if (isFavorited) next.delete(roomId);
        else next.add(roomId);
        return next;
      });
    } catch (error) {
      message.error("Không thể thực hiện thao tác. Vui lòng thử lại!");
    } finally {
      setSavingRooms((prev) => {
        const next = new Set(prev);
        next.delete(roomId);
        return next;
      });
    }
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
      <div className="search-room-utilities">
        {displayUtilities.map((utility, index) => (
          <div key={index} className="search-room-utility-item">
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
                    onChange={(e) =>
                      handleInputChange("location", e.target.value)
                    }
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
                    onChange={(e) =>
                      handleInputChange("priceFrom", e.target.value)
                    }
                  />
                </div>
                <div className="search-room-price-input-container">
                  <input
                    className="search-room-price-input"
                    placeholder="Đến"
                    value={searchParams.priceTo}
                    onChange={(e) =>
                      handleInputChange("priceTo", e.target.value)
                    }
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
                    <path
                      d="M1 1L8 8L15 1"
                      stroke="black"
                      strokeWidth="2"
                      fill="none"
                    />
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
              <div className="search-room-secondary-filter-text">
                Diện tích (m²)
              </div>
              <div className="search-room-secondary-dropdown-arrow">
                <svg width="13.02" height="7.82" viewBox="0 0 14 8">
                  <path
                    d="M1 1L7 7L13 1"
                    stroke="black"
                    strokeWidth="2"
                    fill="none"
                  />
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
                  <path
                    d="M1 1L7 7L13 1"
                    stroke="black"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Rental Period Filter */}
          <div className="search-room-secondary-filter search-room-period-filter">
            <div className="search-room-secondary-filter-wrapper">
              <div className="search-room-secondary-filter-text">
                Thời hạn thuê
              </div>
              <div className="search-room-secondary-dropdown-arrow">
                <svg width="13.02" height="7.82" viewBox="0 0 14 8">
                  <path
                    d="M1 1L7 7L13 1"
                    stroke="black"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Verified Filter */}
          <div
            className={`search-room-verified-filter ${
              searchParams.verified ? "active" : ""
            }`}
            onClick={handleVerifiedToggle}
          >
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
                  <path
                    d="M1 1L6 6L11 1"
                    stroke="black"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Room Cards Grid */}
        <div className="search-room-cards-grid">
          {loading ? (
            <div className="search-room-loading">
              <Spin size="large" />
            </div>
          ) : error ? (
            <div className="search-room-error">
              <Empty description={error} image={Empty.PRESENTED_IMAGE_SIMPLE} />
            </div>
          ) : !Array.isArray(rooms) || rooms.length === 0 ? (
            <div className="search-room-empty">
              <Empty description="Không tìm thấy phòng nào phù hợp" />
            </div>
          ) : (
            rooms.map((room, index) => (
              <div
                key={room.id || room._id}
                className={`search-room-card search-room-card-${index + 1}`}
              >
                {/* Room Image */}
                <div className="search-room-image-container">
                  <img
                    src={getRandomRoomImageUrl(room)}
                    alt={room.title || room.name}
                    className="search-room-image"
                    onError={(e) => {
                      e.target.src = "https://placehold.co/369x180";
                    }}
                  />
                  {/* Heart Icon */}
                  <div
                    className="search-room-heart-icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleHeartClick(room.id || room._id);
                    }}
                  >
                    {favorites.has(room.id || room._id) ? (
                      <HeartFilled className="search-room-heart-filled" />
                    ) : (
                      <HeartOutlined className="search-room-heart-outlined" />
                    )}
                  </div>
                  {/* Verified Badge */}
                  {(room.status === "available" ||
                    room.isVerified ||
                    room.verified) && (
                    <div className="search-room-verified-badge">
                      <div className="search-room-verified-badge-icon">
                        <CheckOutlined />
                      </div>
                      <div className="search-room-verified-badge-text">
                        {room.status === "available" ? "Có sẵn" : "Đã xác thực"}
                      </div>
                    </div>
                  )}
                </div>

                {/* Room Content */}
                <div className="search-room-card-content">
                  {(room.isAIRecommended || room.aiRecommended) && (
                    <div className="search-room-ai-badge">
                      <div className="search-room-ai-badge-text">
                      </div>
                    </div>
                  )}

                  <div className="search-room-card-title">
                    {room.title || room.name}
                  </div>

                  <div className="search-room-price-section">
                    <div className="search-room-card-price">
                      {typeof room.price === "number"
                        ? room.price.toLocaleString("vi-VN") + " VNĐ"
                        : room.price?.rent
                        ? room.price.rent.toLocaleString("vi-VN") + " VNĐ"
                        : "0 VNĐ"}
                    </div>
                    <div className="search-room-price-period">/tháng</div>
                  </div>

                  <div className="search-room-card-location">
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
                    ) : room.address || room.location ? (
                      <>
                        <div>{room.address || room.location}</div>
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

                  {/* <div className="search-room-rating-section">
                    <div className="search-room-stars">
                      {[...Array(5)].map((_, starIndex) => (
                        <div key={starIndex} className="search-room-star">
                          <StarFilled
                            style={{
                              color:
                                starIndex < (room.rating || 0)
                                  ? "#ffd700"
                                  : "#d9d9d9",
                            }}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="search-room-review-count">
                      ({room.rating || 5} ⭐ - {room.viewCount || room.reviews || room.reviewCount || 0} lượt xem)
                    </div>
                  </div> */}

                  <div
                    className="search-room-view-details"
                    onClick={() =>
                      navigate(`/main/room-detail/${room.id || room._id}`)
                    }
                  >
                    <div className="search-room-view-details-text">
                      Xem chi tiết
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        <div className="search-room-pagination-container">
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={totalRooms}
            onChange={handlePageChange}
            onShowSizeChange={handlePageChange}
            showTotal={(total, range) =>
              `${range[0]}-${range[1]} của ${total} phòng`
            }
            className="search-room-pagination"
            showSizeChanger
            pageSizeOptions={["6", "12", "24", "48"]}
          />
        </div>
      </div>
    </div>
  );
};

export default FindRoom;
