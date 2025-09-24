import React, { useState } from "react";
import { Row, Col } from "antd";
import "./Detail.css";
import RoomImages from "./RoomImages/RoomImages";
import RoomInfo from "./LeftContainer/RoomInfo";
import Price from "./RightContainer/Price";

const Detail = () => {
  // Sample room data
  const [roomData] = useState({
    title: "Phòng Trọ Hiện Đại Tầng 3 - K20/28 Nguyễn Hữu Thọ",
    price: 4500000,
    rating: 4.8,
    reviewCount: 25,
    address:
      "K20/28 Nguyễn Hữu Thọ, Phường Hòa Cường Nam, Quận Hải Châu, Đà Nẵng",
    description: [
      "Phòng trọ mới xây, hiện đại và đầy đủ tiện nghi. Diện tích 25m², phù hợp cho 1-2 người ở. Không gian thoáng mát, ánh sáng tự nhiên. Vị trí trung tâm, thuận tiện di chuyển.",
      "Khu vực an ninh, có camera giám sát 24/7. Cổng ra vào có khóa vân tay. Chủ nhà thân thiện, hỗ trợ nhanh chóng khi có vấn đề phát sinh.",
    ],
    amenities: [
      { icon: "aircon", name: "Điều hòa" },
      { icon: "wifi", name: "Wifi tốc độ cao" },
      { icon: "water", name: "Nóng lạnh" },
      { icon: "parking", name: "Chỗ để xe" },
      { icon: "kitchen", name: "Bếp riêng" },
      { icon: "flexible", name: "Giờ giấc tự do" },
      { icon: "furniture", name: "Nội thất đầy đủ" },
      { icon: "security", name: "An ninh 24/7" },
      { icon: "cleaning", name: "Dọn phòng hàng tuần" },
    ],
    rules: [
      "Giờ giấc tự do, không tiếp khách qua đêm",
      "Không gây ồn ào sau 22:00",
      "Không nuôi thú cưng",
      "Không hút thuốc trong phòng",
      "Đóng tiền đúng hạn trước ngày 5 hàng tháng",
      "Đặt cọc 1 tháng tiền nhà khi ký hợp đồng",
      "Thời gian thuê tối thiểu 6 tháng",
      "Báo trước 1 tháng khi muốn dọn đi",
    ],
    details: {
      area: "25m²",
      maxOccupancy: "2 người",
      bedrooms: 1,
      bathrooms: 1,
      status: "Còn trống",
      availability: "Ngay",
    },
    ratingBreakdown: {
      location: 4.8,
      cleanliness: 4.5,
      amenities: 5.0,
      landlord: 4.9,
    },
    reviews: [
      {
        id: 1,
        name: "Nguyễn Thị Minh",
        date: "Tháng 5, 2023",
        rating: 5,
        comment:
          "Phòng rất sạch sẽ và đầy đủ tiện nghi. Chủ nhà thân thiện và luôn hỗ trợ khi cần. Vị trí thuận tiện, gần chợ và siêu thị. Tôi rất hài lòng với thời gian ở đây.",
        avatar: "https://placehold.co/40x40",
      },
      {
        id: 2,
        name: "Trần Văn Hùng",
        date: "Tháng 4, 2023",
        rating: 5,
        comment:
          "Phòng rộng rãi, thoáng mát. Điều hòa và wifi hoạt động tốt. Khu vực an ninh, yên tĩnh. Chỉ có điều nước nóng thỉnh thoảng không ổn định.",
        avatar: "https://placehold.co/40x40",
      },
    ],
  });

  const [images] = useState([
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
    "https://placehold.co/300x200",
  ]);

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
    console.log("Schedule viewing clicked");
    // Add schedule viewing logic here
  };

  const handleContactLandlord = () => {
    console.log("Contact landlord clicked");
    // Add contact landlord logic here
  };

  const handleViewContract = () => {
    console.log("View contract clicked");
    // Add view contract logic here
  };

  return (
    <div className="detail-container">
      {/* Top Section - Room Images (Full Width) */}
      <div style={{ marginBottom: "100px" }}>
        {" "}
        {/* tăng marginBottom */}
        <RoomImages
          images={images}
          isVerified={true}
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
            onScheduleViewing={handleScheduleViewing}
            onContactLandlord={handleContactLandlord}
            onViewContract={handleViewContract}
          />
        </Col>
      </Row>
    </div>
  );
};

export default Detail;
