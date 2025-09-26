import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./Activity.css";
import {
  BellOutlined,
  MessageOutlined,
  HomeOutlined,
  CheckCircleOutlined,
  StarOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { message, Spin } from "antd";
import { useAuth } from "../../../../../contexts/AuthContext";
import notificationApi from "../../../../../services/api/notificationApi";

const Activity = ({ onActivityAction }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();

  // Load activities from API
  useEffect(() => {
    const loadActivities = async () => {
      if (!isAuthenticated || !user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await notificationApi.getNotifications({
          page: 1,
          limit: 5, // Show only 5 recent activities
        });

        if (response.success && response.data?.notifications) {
          // Transform API data to component format
          const transformedActivities = response.data.notifications.map(
            (notification) => ({
              id: notification._id,
              type: mapNotificationType(notification.type),
              icon: getIconType(notification.type),
              iconColor: getIconColor(notification.type),
              title: notification.title,
              message: notification.content,
              time: formatTimeAgo(notification.createdAt),
              actionText: getActionText(notification.type),
              isHighlighted: !notification.isRead,
              data: notification.data, // Additional data from backend
            })
          );

          setActivities(transformedActivities);
        }
      } catch (error) {
        console.error("Error loading activities:", error);
        // Fallback to empty array or mock data if needed
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    loadActivities();
  }, [isAuthenticated, user]);

  // Helper function to map notification types
  const mapNotificationType = (type) => {
    const typeMap = {
      payment_due: "payment_due",
      payment_confirmed: "payment_confirmed",
      message: "response",
      new_room: "new_room",
      review_request: "review_available",
      booking_confirmed: "booking_confirmed",
      maintenance_request: "maintenance_request",
    };
    return typeMap[type] || "general";
  };

  // Helper function to get icon type
  const getIconType = (type) => {
    const iconMap = {
      payment_due: "bell",
      payment_confirmed: "check",
      message: "message",
      new_room: "home",
      review_request: "star",
      booking_confirmed: "check",
      maintenance_request: "bell",
    };
    return iconMap[type] || "bell";
  };

  // Helper function to get icon color
  const getIconColor = (type) => {
    const colorMap = {
      payment_due: "#FAC227",
      payment_confirmed: "#28A745",
      message: "#4739F0",
      new_room: "#4739F0",
      review_request: "#4739F0",
      booking_confirmed: "#28A745",
      maintenance_request: "#FAC227",
    };
    return colorMap[type] || "#4739F0";
  };

  // Helper function to get action text
  const getActionText = (type) => {
    const actionMap = {
      payment_due: "Thanh toán",
      payment_confirmed: "Xem hóa đơn",
      message: "Xem chi tiết",
      new_room: "Xem phòng",
      review_request: "Đánh giá ngay",
      booking_confirmed: "Xem booking",
      maintenance_request: "Xem yêu cầu",
    };
    return actionMap[type] || "Xem chi tiết";
  };

  // Helper function to format time ago
  const formatTimeAgo = (dateString) => {
    if (!dateString) return "Vừa xong";

    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Vừa xong";
    if (diffInHours < 24) return `${diffInHours} giờ trước`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return "Hôm qua";
    if (diffInDays < 7) return `${diffInDays} ngày trước`;

    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks === 1) return "1 tuần trước";
    if (diffInWeeks < 4) return `${diffInWeeks} tuần trước`;

    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths} tháng trước`;
  };

  const handleActivityAction = async (activityId, actionType, activityData) => {
    try {
      // Mark notification as read if not already read
      const activity = activities.find((act) => act.id === activityId);
      if (activity && activity.isHighlighted) {
        await notificationApi.markAsRead(activityId);
        // Update local state
        setActivities((prev) =>
          prev.map((act) =>
            act.id === activityId ? { ...act, isHighlighted: false } : act
          )
        );
      }

      // Call parent callback if provided
      if (onActivityAction) {
        onActivityAction(activityId, actionType, activityData);
      } else {
        // Default behavior - show message
        message.info(`Chức năng ${actionType} đang được phát triển`);
      }
    } catch (error) {
      console.error("Error handling activity action:", error);
      message.error("Có lỗi xảy ra khi xử lý hoạt động");
    }
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
      className={`activity-item ${
        activity.isHighlighted ? "highlighted" : ""
      } ${index > 0 ? "with-border" : ""}`}
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
            onClick={() =>
              handleActivityAction(activity.id, activity.type, activity.data)
            }
          >
            {activity.actionText}
          </div>
        </div>
      </div>
    </div>
  );

  // Loading state
  if (loading) {
    return (
      <div className="activity-container">
        <div className="activity-header">
          <div className="activity-title-main">Hoạt động & Thông báo</div>
        </div>
        <div className="activity-card">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "40px",
            }}
          >
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
            />
          </div>
        </div>
      </div>
    );
  }

  // Empty state for unauthenticated users or no activities
  if (!isAuthenticated || activities.length === 0) {
    return (
      <div className="activity-container">
        <div className="activity-header">
          <div className="activity-title-main">Hoạt động & Thông báo</div>
        </div>
        <div className="activity-card">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "40px",
              color: "#666",
            }}
          >
            <BellOutlined
              style={{ fontSize: 48, color: "#ccc", marginBottom: 16 }}
            />
            <div>
              {!isAuthenticated
                ? "Đăng nhập để xem thông báo"
                : "Không có thông báo mới"}
            </div>
          </div>
        </div>
      </div>
    );
  }

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
  onActivityAction: PropTypes.func,
};

export default Activity;
