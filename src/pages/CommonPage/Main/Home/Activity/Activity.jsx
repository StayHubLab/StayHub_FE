import React from "react";
import PropTypes from "prop-types";
import "./Activity.css";
import {
  BellOutlined,
  MessageOutlined,
  HomeOutlined,
  CheckCircleOutlined,
  StarOutlined,
} from "@ant-design/icons";

const Activity = ({
  activities = [
    {
      id: 1,
      type: "payment_due",
      icon: "bell",
      iconColor: "#FAC227",
      title: "Phòng 201:",
      message: " Sắp đến kỳ thanh toán tháng 7/2025.",
      time: "2 giờ trước",
      actionText: "Thanh toán",
      isHighlighted: true,
    },
    {
      id: 2,
      type: "response",
      icon: "message",
      iconColor: "#4739F0",
      title: "Chủ trọ",
      highlightedText: " chị Lan Anh",
      message: " đã trả lời yêu cầu sửa chữa vòi nước của bạn.",
      time: "Hôm qua",
      actionText: "Xem chi tiết",
      isHighlighted: false,
    },
    {
      id: 3,
      type: "new_room",
      icon: "home",
      iconColor: "#4739F0",
      title: "Phòng mới",
      highlightedText: " P305",
      message: " phù hợp tiêu chí của bạn đã được đăng.",
      time: "2 ngày trước",
      actionText: "Xem phòng",
      isHighlighted: false,
    },
    {
      id: 4,
      type: "payment_confirmed",
      icon: "check",
      iconColor: "#28A745",
      title: "",
      message: "Thanh toán tiền phòng tháng 6/2025 đã được xác nhận.",
      time: "1 tuần trước",
      actionText: "Xem hóa đơn",
      isHighlighted: false,
    },
    {
      id: 5,
      type: "review_available",
      icon: "star",
      iconColor: "#4739F0",
      title: "Bạn có thể đánh giá phòng",
      highlightedText: " 201",
      message: " sau 1 tháng sử dụng.",
      time: "1 tuần trước",
      actionText: "Đánh giá ngay",
      isHighlighted: false,
    },
  ],
}) => {
  const handleActivityAction = (activityId, actionType) => {
    console.log("Activity action clicked:", activityId, actionType);
  };

  const getIcon = (iconType, color) => {
    const iconStyle = { color, fontSize: "16px" };

    switch (iconType) {
      case "bell":
        return <BellOutlined style={iconStyle} />;
      case "message":
        return <MessageOutlined style={iconStyle} />;
      case "home":
        return <HomeOutlined style={iconStyle} />;
      case "check":
        return <CheckCircleOutlined style={iconStyle} />;
      case "star":
        return <StarOutlined style={iconStyle} />;
      default:
        return <BellOutlined style={iconStyle} />;
    }
  };

  const renderActivityContent = (activity) => {
    return (
      <div className="activity-content">
        <span className="activity-title">{activity.title}</span>
        {activity.highlightedText && (
          <span className="activity-highlighted">
            {activity.highlightedText}
          </span>
        )}
        <span className="activity-message">{activity.message}</span>
      </div>
    );
  };

  const renderActivityItem = (activity, index) => (
    <div
      key={activity.id}
      className={`activity-item ${activity.isHighlighted ? "highlighted" : ""} ${index > 0 ? "with-border" : ""}`}
    >
      <div className="activity-main-content">
        <div className="activity-left">
          <div className="activity-icon">
            {getIcon(activity.icon, activity.iconColor)}
          </div>
          {renderActivityContent(activity)}
        </div>

        <div className="activity-right">
          <div className="activity-time">{activity.time}</div>
          <div
            className="activity-action"
            onClick={() => handleActivityAction(activity.id, activity.type)}
          >
            {activity.actionText}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="activity-container">
      {/* Header */}
      <div className="activity-header">
        <div className="activity-title-main">Hoạt động & Thông báo</div>
      </div>

      {/* Activities Card */}
      <div className="activity-card">
        <div className="activity-content-wrapper">
          {activities.map((activity, index) =>
            renderActivityItem(activity, index)
          )}
        </div>
      </div>
    </div>
  );
};

Activity.propTypes = {
  activities: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      type: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
      iconColor: PropTypes.string.isRequired,
      title: PropTypes.string,
      highlightedText: PropTypes.string,
      message: PropTypes.string.isRequired,
      time: PropTypes.string.isRequired,
      actionText: PropTypes.string.isRequired,
      isHighlighted: PropTypes.bool,
    })
  ),
};

export default Activity;
