import React from "react";
import PropTypes from "prop-types";
import { Button, Avatar } from "antd";
import {
  InfoCircleOutlined,
  StarFilled,
  UserOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import "./Price.css";

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
  onScheduleViewing,
  onContactLandlord,
  onViewContract,
}) => {
  const handleScheduleViewing = () => {
    if (onScheduleViewing) {
      onScheduleViewing();
    }
  };

  const handleContactLandlord = () => {
    if (onContactLandlord) {
      onContactLandlord();
    }
  };

  const handleViewContract = () => {
    if (onViewContract) {
      onViewContract();
    }
  };

  return (
    <div className="price-container">
      {/* Booking Section */}
      <div className="booking-card">
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
  }),
  landlordData: PropTypes.shape({
    name: PropTypes.string,
    since: PropTypes.string,
    rating: PropTypes.number,
    description: PropTypes.string,
    isVerified: PropTypes.bool,
    avatar: PropTypes.string,
  }),
  onScheduleViewing: PropTypes.func,
  onContactLandlord: PropTypes.func,
  onViewContract: PropTypes.func,
};

export default Price;
