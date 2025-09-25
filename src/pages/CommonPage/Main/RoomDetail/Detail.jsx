import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Row, Col, Spin, Alert, App } from "antd";
import "./Detail.css";
import RoomImages from "./RoomImages/RoomImages";
import RoomInfo from "./LeftContainer/RoomInfo";
import Price from "./RightContainer/Price";
import ScheduleBookingModal from "../../../../components/ScheduleBookingModal/ScheduleBookingModal";
import roomApi from "../../../../services/api/roomApi";
import viewingApi from "../../../../services/api/viewingApi";
import { useAuth } from "../../../../contexts/AuthContext";

const Detail = () => {
  const { id: roomId } = useParams();
  const navigate = useNavigate();
  const { message } = App.useApp();
  const { user, isAuthenticated } = useAuth();

  // States
  const [roomData, setRoomData] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBookingModalVisible, setIsBookingModalVisible] = useState(false);

  // Fetch room data from API
  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!roomId) {
          setError("Room ID not found");
          return;
        }

        const response = await roomApi.getRoomById(roomId);

        if (response.success && response.data) {
          const room = response.data;

          // Debug thông tin chủ trọ
          console.log("=== LANDLORD DEBUG ===");
          console.log("Room data from API:", room);
          console.log("Building ID:", room.buildingId);
          console.log("Host ID data:", room.buildingId?.hostId);
          console.log("Host name:", room.buildingId?.hostId?.name);
          console.log("Host phone:", room.buildingId?.hostId?.phone);
          console.log("Host email:", room.buildingId?.hostId?.email);
          console.log("Direct landlord:", room.landlord);
          console.log("=====================");

          // Transform API data to match component structure
          const transformedData = {
            title: room.name || "Phòng trọ",
            price: room.price?.rent || room.price || 0,
            rating: room.rating || 4.8,
            reviewCount: room.reviewCount || 0,
            address:
              room.buildingId && typeof room.buildingId === "object"
                ? `${room.buildingId.name} - ${
                    room.buildingId.address?.street ||
                    room.buildingId.address?.ward ||
                    "Địa chỉ không xác định"
                  }`
                : room.address || "Địa chỉ không xác định",
            description: room.description
              ? [room.description]
              : [
                  "Phòng trọ hiện đại và đầy đủ tiện nghi. Vị trí thuận tiện, an ninh tốt.",
                  "Khu vực yên tĩnh, thích hợp cho sinh viên và người đi làm.",
                ],
            amenities:
              room.utilities?.map((utility) => ({
                icon: "amenity",
                name: utility.name || utility,
              })) || [],
            rules: [
              "Giờ giấc tự do, không tiếp khách qua đêm",
              "Không gây ồn ào sau 22:00",
              "Không nuôi thú cưng",
              "Không hút thuốc trong phòng",
              "Đóng tiền đúng hạn trước ngày 5 hàng tháng",
            ],
            details: {
              area: `${room.area}m²` || "25m²",
              maxOccupancy: `${room.capacity} người` || "2 người",
              bedrooms: room.bedrooms || 1,
              bathrooms: room.bathrooms || 1,
              status:
                room.status === "available" ? "Còn trống" : "Đã có người thuê",
              availability: room.isAvailable ? "Ngay" : "Chưa có sẵn",
            },
            // Chi phí phát sinh từ API hoặc default
            additionalCosts: {
              electricity: room.price?.electricity || 4000, // VNĐ/kWh
              water: room.price?.water || 20000, // VNĐ/m³
              internet: room.price?.internet || 0, // VNĐ/tháng
              parking: room.price?.parking || 0, // VNĐ/xe/tháng
              service: room.price?.service || 100000, // VNĐ/tháng
              deposit:
                room.price?.deposit || room.price?.rent || room.price || 0, // 1 tháng tiền nhà
            },
            // Thông tin chủ trọ từ building.hostId
            landlord: {
              name:
                room.buildingId?.hostId?.name ||
                room.buildingId?.hostId?.fullName ||
                room.landlord?.name ||
                room.landlord?.fullName ||
                "Chủ trọ",
              since: room.buildingId?.hostId?.createdAt
                ? new Date(room.buildingId.hostId.createdAt).getFullYear()
                : room.landlord?.since || 
                  room.buildingId?.createdAt 
                    ? new Date(room.buildingId.createdAt).getFullYear()
                    : "2020",
              rating: 
                room.buildingId?.hostId?.rating ||
                room.landlord?.rating || 
                4.9,
              isVerified: 
                room.buildingId?.hostId?.isVerified !== false &&
                room.landlord?.isVerified !== false,
              description:
                room.buildingId?.hostId?.description ||
                room.landlord?.description ||
                "Chủ trọ thân thiện, luôn hỗ trợ nhanh chóng và giải quyết mọi vấn đề trong vòng 24h.",
              avatar:
                room.buildingId?.hostId?.avatar ||
                room.landlord?.avatar ||
                "https://placehold.co/64x64/4F46E5/ffffff?text=" + 
                (room.buildingId?.hostId?.name?.[0] || room.landlord?.name?.[0] || "CT"),
              email: 
                room.buildingId?.hostId?.email ||
                room.landlord?.email,
              phone: 
                room.buildingId?.hostId?.phone ||
                room.landlord?.phone,
              // Thêm ID để debug
              id: room.buildingId?.hostId?._id || room.landlord?.id,
            },
            ratingBreakdown: {
              location: room.rating || 4.8,
              cleanliness: room.rating || 4.5,
              amenities: room.rating || 5.0,
              landlord: room.rating || 4.9,
            },
            reviews: room.reviews || [],
          };

          setRoomData(transformedData);

          // Set images
          if (
            room.images &&
            Array.isArray(room.images) &&
            room.images.length > 0
          ) {
            const imageUrls = room.images.map((img) =>
              typeof img === "string"
                ? img
                : img.url || "https://placehold.co/300x200"
            );
            setImages(imageUrls);
          } else {
            // Default placeholder images
            setImages([
              "https://placehold.co/829x532",
              "https://placehold.co/411x206",
              "https://placehold.co/201x314",
              "https://placehold.co/202x312",
            ]);
          }
        } else {
          setError("Không thể tải thông tin phòng");
        }
      } catch (error) {
        console.error("Error fetching room data:", error);
        setError("Đã xảy ra lỗi khi tải dữ liệu");
        message.error("Không thể tải thông tin phòng");
      } finally {
        setLoading(false);
      }
    };

    fetchRoomData();
  }, [roomId, message]);

  // Loading state
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={{ padding: "50px 0" }}>
        <Alert
          message="Lỗi"
          description={error}
          type="error"
          showIcon
          action={
            <button onClick={() => navigate("/rooms")}>
              Về trang tìm phòng
            </button>
          }
        />
      </div>
    );
  }

  // No data state
  if (!roomData) {
    return (
      <div style={{ padding: "50px 0" }}>
        <Alert
          message="Không tìm thấy phòng"
          description="Phòng bạn tìm kiếm không tồn tại hoặc đã bị xóa."
          type="warning"
          showIcon
          action={
            <button onClick={() => navigate("/rooms")}>
              Về trang tìm phòng
            </button>
          }
        />
      </div>
    );
  }

  // Event handlers
  const handleViewAllImages = () => {
    console.log("View all images clicked");
    // Add image gallery modal logic here
  };

  const handleImageClick = (index) => {
    console.log("Image clicked:", index);
    // Add image viewer logic here
  };

  const handleViewAllReviews = () => {
    console.log("View all reviews clicked");
    // Add reviews modal logic here
  };

  const handleViewOnMap = () => {
    console.log("View on map clicked");
    // Add map modal logic here
  };

  // Price component event handlers
  const handleScheduleViewing = () => {
    // Check if user is authenticated
    if (!isAuthenticated || !user) {
      message.warning("Vui lòng đăng nhập để đặt lịch xem phòng");
      navigate("/login");
      return;
    }

    console.log("=== BEFORE OPENING MODAL ===");
    console.log("roomData:", roomData);
    console.log("roomData.landlord:", roomData?.landlord);
    console.log("user from auth:", user);
    console.log("isBookingModalVisible:", isBookingModalVisible);
    console.log("============================");
    setIsBookingModalVisible(true);
  };

  const handleContactLandlord = () => {
    console.log("Contact landlord clicked");
    // Add contact landlord logic here
  };

  const handleViewContract = () => {
    console.log("View contract clicked");
    // Add view contract logic here
  };

  // Booking modal handlers
  const handleCloseBookingModal = () => {
    setIsBookingModalVisible(false);
  };

  const handleConfirmBooking = async (bookingData) => {
    try {
      console.log("Booking confirmed:", bookingData);
      
      // Prepare viewing data for API
      const viewingData = {
        roomId: roomId,
        viewingDate: `${bookingData.month.split('/')[1]}-${bookingData.month.split('/')[0].padStart(2, '0')}-${bookingData.date.toString().padStart(2, '0')}`,
        viewingTime: bookingData.time,
        contactInfo: {
          name: bookingData.userData.name,
          phone: bookingData.userData.phone,
          email: bookingData.userData.email,
        },
        notes: "Đặt lịch xem phòng từ trang chi tiết phòng",
      };

      // Call API to create viewing appointment
      const response = await viewingApi.createViewing(viewingData);
      
      if (response.success) {
        message.success("Đã đặt lịch xem phòng thành công! Chủ trọ sẽ liên hệ với bạn sớm.");
        console.log("Viewing appointment created:", response.data);
      } else {
        message.error("Có lỗi xảy ra khi đặt lịch. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Error creating viewing appointment:", error);
      message.error("Không thể đặt lịch xem phòng. Vui lòng thử lại sau.");
    } finally {
      setIsBookingModalVisible(false);
    }
  };

  return (
    <div className="detail-container">
      {/* Top Section - Room Images (Full Width) */}
      <div style={{ marginBottom: "100px" }}>
        <RoomImages
          images={images}
          isVerified={roomData.details?.status === "Còn trống"}
          onViewAllImages={handleViewAllImages}
          onImageClick={handleImageClick}
        />
      </div>

      {/* Bottom Section - RoomInfo Left, Price Right */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <RoomInfo
            roomData={roomData}
            onViewAllReviews={handleViewAllReviews}
            onViewOnMap={handleViewOnMap}
          />
        </Col>
        <Col xs={24} lg={8}>
          <Price
            priceData={{
              costs: [
                roomData.additionalCosts?.electricity && {
                  label: "Tiền điện",
                  value: `${roomData.additionalCosts.electricity.toLocaleString()} VNĐ/kWh`,
                },
                roomData.additionalCosts?.water && {
                  label: "Tiền nước",
                  value: `${roomData.additionalCosts.water.toLocaleString()} VNĐ/m³`,
                },
                roomData.additionalCosts?.internet && {
                  label: "Phí Internet",
                  value: `${roomData.additionalCosts.internet.toLocaleString()} VNĐ/tháng`,
                },
                roomData.additionalCosts?.parking && {
                  label: "Phí giữ xe",
                  value: `${roomData.additionalCosts.parking.toLocaleString()} VNĐ/xe/tháng`,
                },
                roomData.additionalCosts?.service && {
                  label: "Phí dịch vụ",
                  value: `${roomData.additionalCosts.service.toLocaleString()} VNĐ/tháng`,
                },
              ].filter(Boolean), // Lọc bỏ những giá trị null/undefined
              deposit: roomData.additionalCosts?.deposit
                ? {
                    title: `Đặt cọc: ${roomData.additionalCosts.deposit.toLocaleString()} VNĐ`,
                    description: "Được hoàn trả khi kết thúc hợp đồng",
                  }
                : null,
            }}
            landlordData={{
              name: roomData.landlord?.name || "Chủ trọ",
              since: `Chủ trọ từ ${roomData.landlord?.since || "2020"}`,
              rating: roomData.landlord?.rating || 4.9,
              description:
                roomData.landlord?.description ||
                "Chủ trọ thân thiện, luôn hỗ trợ nhanh chóng và giải quyết mọi vấn đề trong vòng 24h.",
              isVerified: roomData.landlord?.isVerified !== false,
              avatar: roomData.landlord?.avatar || "https://placehold.co/64x64/4F46E5/ffffff?text=CT",
              email: roomData.landlord?.email,
              phone: roomData.landlord?.phone,
            }}
            roomData={roomData}
            onScheduleViewing={handleScheduleViewing}
            onContactLandlord={handleContactLandlord}
            onViewContract={handleViewContract}
          />
        </Col>
      </Row>

      {/* Schedule Booking Modal */}
      {roomData && roomData.landlord && isBookingModalVisible && (
        <ScheduleBookingModal
          visible={isBookingModalVisible}
          onClose={handleCloseBookingModal}
          onConfirm={handleConfirmBooking}
          roomData={{
            name: roomData.title || "Phòng trọ",
            price: roomData.price || 0,
            address: roomData.address || "Địa chỉ không xác định",
          }}
          userData={{
            name: user?.name || "N/A",
            phone: user?.phone || "N/A",
            email: user?.email || "N/A",
          }}
          landlordData={{
            name: roomData.landlord.name || "Chủ trọ",
            phone: roomData.landlord.phone || "N/A",
            email: roomData.landlord.email || "N/A", 
            since: roomData.landlord.since ? `Chủ trọ từ ${roomData.landlord.since}` : "Chủ trọ từ 2020",
          }}
        />
      )}
    </div>
  );
};

export default Detail;
