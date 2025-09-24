import React from "react";
import PropTypes from "prop-types";
import "./Welcome.css";
import {
  SearchOutlined,
  HeartOutlined,
  WarningOutlined,
} from "@ant-design/icons";

const Welcome = ({ userName = "Nguyễn Hoài An" }) => {
  const handleFindNewRoom = () => {
    // Navigate to search page or trigger search functionality
    console.log("Navigate to find new room");
  };

  const handleViewSavedRooms = () => {
    // Navigate to saved rooms page
    console.log("Navigate to saved rooms");
  };

  const handleReportIssue = () => {
    // Open report issue modal or page
    console.log("Open report issue");
  };

  return (
    <div className="welcome-container">
      {/* Welcome Text Section */}
      <div className="welcome-text-section">
        <div className="welcome-title-home">Chào mừng, {userName}!</div>
        <div className="welcome-subtitle-home">
          Cùng khám phá và quản lý hành trình tìm trọ của bạn.
        </div>
      </div>

      {/* Action Buttons Section */}
      <div className="welcome-actions">
        {/* Find New Room Button */}
        <div className="action-button primary" onClick={handleFindNewRoom}>
          <div className="button-icon-container">
            <div className="button-icon">
              <SearchOutlined
                style={{ fontSize: "16px", color: "#ffffffff" }}
              />
            </div>
          </div>
          <div className="button-text primary-text">Tìm phòng mới</div>
        </div>

        {/* View Saved Rooms Button */}
        <div className="action-button secondary" onClick={handleViewSavedRooms}>
          <div className="button-icon-container">
            <div className="button-icon">
              <HeartOutlined style={{ fontSize: "16px", color: "#4739F0" }} />
            </div>
          </div>
          <div className="button-text secondary-text">Xem phòng đã lưu</div>
        </div>

        {/* Report Issue Button */}
        <div className="action-button warning" onClick={handleReportIssue}>
          <div className="button-icon-container">
            <div className="button-icon">
              <WarningOutlined style={{ fontSize: "16px", color: "#FAC227" }} />
            </div>
          </div>
          <div className="button-text warning-text">Báo cáo sự cố</div>
        </div>
      </div>
    </div>
  );
};

Welcome.propTypes = {
  userName: PropTypes.string,
};

export default Welcome;
