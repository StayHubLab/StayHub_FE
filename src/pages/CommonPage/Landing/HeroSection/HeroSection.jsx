import React from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import "./HeroSection.css";

const HeroSection = () => {
  const navigate = useNavigate();

  const handleFindRoom = () => {
    navigate("/main/find");
  };

  const handleRoomManage = () => {
    navigate("/main/home");
  };

  return (
    <section className="hero-section">
      <div className="hero-background">
        <img
          src="https://placehold.co/1440x700"
          alt="Hero Background"
          className="hero-image"
        />
        <div className="hero-overlay" />
      </div>

      <div className="hero-content">
        <div className="hero-text">
          <h1 className="hero-title">
            StayHub: Tìm Trọ Dễ Dàng, Quản Lý Hiệu Quả
          </h1>
          <p className="hero-subtitle">
            Loại bỏ rủi ro khi tìm trọ, tối ưu quy trình thuê, minh bạch trong
            quản lý và đánh giá – StayHub là nền tảng đồng hành đáng tin cậy
            trong hành trình trọ thời số hóa.
          </p>
        </div>

        <div className="hero-buttons">
          <Button
            type="primary"
            size="large"
            onClick={handleFindRoom}
            className="hero-btn find-room-btn"
          >
            Bắt Đầu Tìm Trọ Ngay
          </Button>
          <Button
            size="large"
            onClick={handleRoomManage}
            className="hero-btn become-host-btn"
          >
            Quản Lý Chỗ Ở Của Bạn
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
