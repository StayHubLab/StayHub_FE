import React from "react";
import PropTypes from "prop-types";
import { Button, Avatar, Alert } from "antd";
import {
  InfoCircleOutlined,
  StarFilled,
  UserOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  HomeOutlined,
  StopOutlined,
} from "@ant-design/icons";
import "./Price.css";
import { useNavigate } from "react-router-dom";
import chatService from "../../../../../services/api/chatService";
const Price = ({
  priceData = {
    costs: [
      { label: "Tiền điện", value: "4.000 VNĐ/kWh" },
      { label: "Tiền nước", value: "20.000 VNĐ/m³" },
      { label: "Phí Internet", value: "100.000 VNĐ/tháng" },
      { label: "Phí giữ xe", value: "50.000 VNĐ/xe/tháng" },
      { label: "Phí dịch vụ", value: "100.000 VNĐ/tháng" },
    ],
    deposit: {
      title: "Đặt cọc: 1 tháng tiền nhà",
      description: "Được hoàn trả khi kết thúc hợp đồng",
    },
  },
  landlordData = {
    name: "Chị Lan Anh",
    since: "Chủ trọ từ 2020",
    rating: 4.9,
    description:
      "Luôn hỗ trợ nhanh chóng và giải quyết mọi vấn đề trong vòng 24h.",
    isVerified: true,
    avatar: "https://placehold.co/64x64",
  },
  isUserRenting = false,
  isRoomOccupied = false,
  roomData,
  onScheduleViewing,
  onContactLandlord,
  onViewContract,
}) => {
  const navigate = useNavigate();
  const handleScheduleViewing = () => {
    if (onScheduleViewing) {
      onScheduleViewing();
    }
  };

  const handleContactLandlord = async () => {
    try {
      const recipientId =
        typeof roomData?.landlord?.id === "object"
          ? roomData.landlord.id._id
          : roomData?.landlord?.id;
  
      if (!recipientId) {
        console.error("❌ Không tìm thấy hostId (landlord id)");
        return;
      }
  
      console.log("RecipientId (landlord):", recipientId);
  
      const res = await chatService.createConversation(recipientId);
      const conversation = res.data.conversation;
  
      if (conversation?._id) {
        navigate(`/chat?conversationId=${conversation._id}`);
      } else {
        console.error("❌ Không tạo được conversation");
      }
    } catch (err) {
      console.error("Error creating conversation:", err);
    }
  };

  const handleViewContract = () => {
    if (onViewContract) {
      onViewContract();
    }
  };

  return (
    <div className="price-container">
      {/* Current Renting Status, Room Occupied, or Booking Section */}
      <div className="booking-card">
        {isUserRenting ? (
          // Scenario 1: Current user is renting this room
          <>
            <div className="booking-header">
              <h2 className="booking-title">Trạng thái thuê</h2>
            </div>
            <Alert
              message="Bạn đang thuê phòng này"
              description="Bạn hiện tại là người thuê của phòng này. Liên hệ chủ trọ nếu cần hỗ trợ."
              type="success"
              icon={<HomeOutlined />}
              showIcon
              style={{
                marginBottom: "16px",
                borderRadius: "8px",
              }}
            />
            <div className="costs-section">
              <h3 className="costs-title">Chi phí phát sinh hiện tại</h3>
              <div className="costs-list">
                {priceData.costs.map((cost, index) => (
                  <div key={index} className="cost-item">
                    <span className="cost-label">{cost.label}</span>
                    <span className="cost-value">{cost.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="action-buttons">
              <Button
                size="large"
                className="contact-button"
                onClick={handleContactLandlord}
              >
                Liên hệ chủ trọ
              </Button>
            </div>
          </>
        ) : isRoomOccupied ? (
          // Scenario 2: Room is occupied by someone else
          <>
            <div className="booking-header">
              <h2 className="booking-title">Trạng thái phòng</h2>
            </div>
            <Alert
              message="Phòng đã có người thuê"
              description="Phòng này hiện tại đã có người thuê. Không thể đặt lịch xem phòng lúc này. Bạn có thể liên hệ chủ trọ để biết thêm thông tin."
              type="warning"
              icon={<StopOutlined />}
              showIcon
              style={{
                marginBottom: "16px",
                borderRadius: "8px",
              }}
            />
            <div className="costs-section">
              <h3 className="costs-title">Chi phí tham khảo</h3>
              <div className="costs-list">
                {priceData.costs.map((cost, index) => (
                  <div key={index} className="cost-item">
                    <span className="cost-label">{cost.label}</span>
                    <span className="cost-value">{cost.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="action-buttons">
              <Button
                size="large"
                className="contact-button"
                onClick={handleContactLandlord}
              >
                Liên hệ chủ trọ
              </Button>
            </div>
          </>
        ) : (
          // Scenario 3: Room is available for viewing and booking
          <>
            <div className="booking-header">
              <h2 className="booking-title">Đặt lịch xem phòng hoặc Liên hệ</h2>
            </div>

            <div className="costs-section">
              <h3 className="costs-title">Chi phí phát sinh ước tính</h3>
              <div className="costs-list">
                {priceData.costs.map((cost, index) => (
                  <div key={index} className="cost-item">
                    <span className="cost-label">{cost.label}</span>
                    <span className="cost-value">{cost.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {priceData.deposit && (
              <div className="deposit-section">
                <div className="deposit-content">
                  <InfoCircleOutlined className="deposit-icon" />
                  <div className="deposit-text">
                    <div className="deposit-title">{priceData.deposit.title}</div>
                    <div className="deposit-description">
                      {priceData.deposit.description}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="action-buttons">
              <Button
                type="primary"
                size="large"
                className="schedule-button"
                onClick={handleScheduleViewing}
              >
                Đặt lịch xem phòng
              </Button>
              <Button
                size="large"
                className="contact-button"
                onClick={handleContactLandlord}
              >
                Liên hệ chủ trọ
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Landlord Section */}
      <div className="landlord-card-room">
        <div className="landlord-header">
          <h2 className="landlord-title">Về chủ trọ</h2>
        </div>

        <div className="landlord-profile">
          <Avatar
            size={64}
            src={landlordData.avatar}
            icon={<UserOutlined />}
            className="landlord-avatar"
          />
          <div className="landlord-info">
            <div className="landlord-name">{landlordData.name}</div>
            <div className="landlord-since">{landlordData.since}</div>
          </div>
        </div>

        <div className="landlord-rating">
          <span className="rating-price-label">Chủ trọ thân thiện:</span>
          <span className="rating-value">{landlordData.rating}</span>
          <StarFilled className="rating-star" />
        </div>

        <div className="landlord-description">{landlordData.description}</div>

        {landlordData.isVerified && (
          <div className="verification-status">
            <CheckCircleOutlined className="verification-landlord-icon" />
            <span className="verification-landlords">
              Đã xác minh danh tính
            </span>
          </div>
        )}
      </div>

      {/* Contract Section */}
      <div className="contract-card">
        <div className="contract-header">
          <h2 className="contract-title">Hợp đồng mẫu tham khảo</h2>
        </div>

        <div className="contract-description">
          Xem trước các điều khoản cơ bản của hợp đồng thuê trọ.
        </div>

        <Button
          size="large"
          className="contract-button"
          icon={<FileTextOutlined />}
          onClick={handleViewContract}
        >
          Xem Hợp đồng Mẫu
        </Button>
      </div>
    </div>
  );
};

Price.propTypes = {
  priceData: PropTypes.shape({
    costs: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.string,
      })
    ),
    deposit: PropTypes.shape({
      title: PropTypes.string,
      description: PropTypes.string,
    }),
    roomData: PropTypes.object,
  }),
  landlordData: PropTypes.shape({
    name: PropTypes.string,
    since: PropTypes.string,
    rating: PropTypes.number,
    description: PropTypes.string,
    isVerified: PropTypes.bool,
    avatar: PropTypes.string,
  }),
  isUserRenting: PropTypes.bool,
  isRoomOccupied: PropTypes.bool,
  onScheduleViewing: PropTypes.func,
  onContactLandlord: PropTypes.func,
  onViewContract: PropTypes.func,
};

export default Price;
