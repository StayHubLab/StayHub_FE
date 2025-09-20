import React from 'react';
import PropTypes from 'prop-types';
import './Renting.css';
import { MessageOutlined } from '@ant-design/icons';

const Renting = ({
  roomData = {
    title: "Phòng Trọ 201 - Chung cư X",
    address: "K20/28 Nguyễn Hữu Thọ, Quận Hải Châu, Đà Nẵng",
    price: 2800000,
    dueDate: "28/06/2025",
    image: "https://placehold.co/440x300"
  }
}) => {

  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN');
  };

  const handleViewContract = () => {
    console.log('View contract clicked');
  };

  const handlePayNow = () => {
    console.log('Pay now clicked');
  };

  const handleReportIssue = () => {
    console.log('Report issue clicked');
  };

  const handleChatWithLandlord = () => {
    console.log('Chat with landlord clicked');
  };

  return (
    <div className="renting-container">
      {/* Section Title */}
      <div className="renting-title">Phòng bạn đang thuê</div>

      {/* Room Card */}
      <div className="renting-card">
        <div className="renting-card-content">
          {/* Room Image */}
          <div className="renting-image-container">
            <div className="renting-image-wrapper">
              <img
                src={roomData.image}
                alt={roomData.title}
                className="renting-image"
              />
            </div>
          </div>

          {/* Room Details */}
          <div className="renting-details">
            {/* Room Title */}
            <div className="renting-room-title">{roomData.title}</div>

            {/* Room Address */}
            <div className="renting-room-address">{roomData.address}</div>

            {/* Price Section */}
            <div className="renting-price-section">
              <div className="renting-price">{formatPrice(roomData.price)} VNĐ</div>
              <div className="renting-price-unit">/tháng</div>
            </div>

            {/* Payment Due Alert */}
            <div className="renting-payment-alert">
              <div className="renting-payment-text">
                Đến hạn thanh toán: {roomData.dueDate}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="renting-actions">
              <div className="renting-buttons-row">
                {/* View Contract Link */}
                <div className="renting-contract-link" onClick={handleViewContract}>
                  Xem Hợp đồng
                </div>

                {/* Pay Now Button */}
                <div className="renting-pay-button" onClick={handlePayNow}>
                  <div className="renting-pay-text">Thanh toán ngay</div>
                </div>

                {/* Report Issue Button */}
                <div className="renting-report-button" onClick={handleReportIssue}>
                  <div className="renting-report-text">Báo cáo sự cố</div>
                </div>
              </div>
            </div>
            {/* Chat with Landlord */}
            <div className="renting-chat-section" onClick={handleChatWithLandlord}>
              <div className="renting-chat-icon">
                <MessageOutlined />
              </div>
              <div className="renting-chat-text">Trò chuyện với chủ trọ</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Renting.propTypes = {
  roomData: PropTypes.shape({
    title: PropTypes.string,
    address: PropTypes.string,
    price: PropTypes.number,
    dueDate: PropTypes.string,
    image: PropTypes.string
  })
};

export default Renting;