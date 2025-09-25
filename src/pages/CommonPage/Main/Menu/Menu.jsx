import React, { useState } from "react";
import {
  HomeOutlined,
  SearchOutlined,
  HeartOutlined, // Use HeartOutlined instead of FavoriteOutlined
  FileTextOutlined, // Use FileTextOutlined instead of DocumentOutlined
  HistoryOutlined,
  CustomerServiceOutlined, // Use CustomerServiceOutlined instead of SupportOutlined
  SettingOutlined, // Use SettingOutlined instead of SettingsOutlined
  StarOutlined,
  CalendarOutlined, // For viewing appointments
} from "@ant-design/icons";
import "./Menu.css";

import { useNavigate } from "react-router-dom";

const Menu = () => {
  const [activeItem, setActiveItem] = useState("home");
  const navigate = useNavigate();

  const menuItems = [
    {
      id: "home",
      label: "Trang chủ",
      icon: <HomeOutlined />,
      isActive: true,
      route: "/main/home",
    },
    {
      id: "find",
      label: "Tìm Phòng",
      icon: <SearchOutlined />,
      isActive: false,
      route: "/main/find",
    },
    {
      id: "saved",
      label: "Phòng đã lưu",
      icon: <HeartOutlined />, // Changed from FavoriteOutlined
      isActive: false,
      route: "/main/saved",
    },
    {
      id: "viewing-appointments",
      label: "Lịch xem phòng",
      icon: <CalendarOutlined />,
      isActive: false,
      route: "/main/viewing-appointments",
    },
    {
      id: "contract",
      label: "Hợp đồng thuê",
      icon: <FileTextOutlined />,
      isActive: false,
      route: "/main/contract",
    },
    {
      id: "history",
      label: "Lịch sử thuê",
      icon: <HistoryOutlined />,
      isActive: false,
      route: "/main/history",
    },
    {
      id: "support",
      label: "Hỗ trợ",
      icon: <CustomerServiceOutlined />, // Changed from SupportOutlined
      isActive: false,
      route: "/main/support",
    },
    {
      id: "settings",
      label: "Cài đặt",
      icon: <SettingOutlined />, // Changed from SettingsOutlined
      isActive: false,
      route: "/main/settings",
    },
    {
      id: "review",
      label: "Đánh giá",
      icon: <StarOutlined />,
      isActive: false,
      route: "/main/review",
    },
  ];

  const handleItemClick = (itemId, route) => {
    setActiveItem(itemId);
    navigate(route);
  };

  const handleRatingClick = () => {
    setActiveItem("review");
    navigate("/main/review");
  };

  return (
    <div className="menu-container">
      <div className="menu-content">
        {menuItems.map((item, index) => (
          <div
            key={item.id}
            className={`menu-item ${activeItem === item.id ? "active" : ""}`}
            onClick={() => handleItemClick(item.id, item.route)}
            style={{ top: `${index * 56}px` }}
          >
            <div
              className={`menu-item-background ${
                activeItem === item.id ? "active-bg" : ""
              }`}
            >
              <div className="menu-icon-container">
                <div className="menu-icon">{item.icon}</div>
              </div>
              <div className="menu-text-container">
                <div
                  className={`menu-text ${
                    activeItem === item.id ? "active-text" : ""
                  }`}
                >
                  {item.label}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;
