import React, { useState } from "react";
import {
  DashboardOutlined,
  HomeOutlined,
  TeamOutlined,
  TransactionOutlined,
  CrownOutlined,
  SettingOutlined,
  CustomerServiceOutlined,
} from "@ant-design/icons";
import "./LandlordMenu.css";

import { useNavigate } from "react-router-dom";

const LandlordMenu = () => {
  const [activeItem, setActiveItem] = useState("dashboard");
  const navigate = useNavigate();

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <DashboardOutlined />,
      isActive: true,
      route: "/landlord/dashboard",
    },
    {
      id: "manage-room",
      label: "Quản lý phòng",
      icon: <HomeOutlined />,
      isActive: false,
      route: "/landlord/manage-room",
    },
    {
      id: "manage-tenants",
      label: "Quản lý thuê trọ",
      icon: <TeamOutlined />,
      isActive: false,
      route: "/landlord/manage-tenants",
    },
    {
      id: "transaction",
      label: "Giao dịch",
      icon: <TransactionOutlined />,
      isActive: false,
      route: "/landlord/transaction",
    },
    {
      id: "subscription",
      label: "Gói đăng ký",
      icon: <CrownOutlined />,
      isActive: false,
      route: "/landlord/subscription",
    },
    {
      id: "settings",
      label: "Cài đặt",
      icon: <SettingOutlined />,
      isActive: false,
      route: "/landlord/settings",
    },
    {
      id: "support",
      label: "Hỗ trợ",
      icon: <CustomerServiceOutlined />,
      isActive: false,
      route: "/landlord/support",
    },
  ];

  const handleItemClick = (itemId, route) => {
    setActiveItem(itemId);
    navigate(route);
  };

  return (
    <div className="landlord-menu-container">
      <div className="landlord-menu-content">
        {menuItems.map((item, index) => (
          <div
            key={item.id}
            className={`landlord-menu-item ${activeItem === item.id ? "active" : ""}`}
            onClick={() => handleItemClick(item.id, item.route)}
            style={{ top: `${index * 56}px` }}
          >
            <div
              className={`landlord-menu-item-background ${activeItem === item.id ? "active-bg" : ""}`}
            >
              <div className="landlord-menu-icon-container">
                <div className="landlord-menu-icon">{item.icon}</div>
              </div>
              <div className="landlord-menu-text-container">
                <div
                  className={`landlord-menu-text ${activeItem === item.id ? "active-text" : ""}`}
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

export default LandlordMenu;
