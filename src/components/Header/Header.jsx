import {
  BellOutlined,
  HeartOutlined,
  HistoryOutlined,
  LogoutOutlined,
  MenuOutlined,
  QuestionCircleOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Badge, Button, Drawer, Dropdown, Input, Space } from "antd";
import PropTypes from "prop-types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoRemoveBG from "../../assets/images/logo/logoRemoveBG.png";
import { useAuth } from "../../contexts/AuthContext";
import "./Header.css";

const Header = () => {
  const [searchValue, setSearchValue] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleSearch = () => {
    if (searchValue.trim()) {
      // Navigate to find room page with search query
      navigate(`/main/find?search=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      navigate("/login");
    }
  };

  // User dropdown menu items
  const userMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Thông tin cá nhân",
      onClick: () => navigate("/profile"),
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Đăng xuất",
      onClick: handleLogout,
    },
  ];

  return (
    <header className="header-container">
      <div className="header-content">
        {/* Logo */}
        <div
          className="logo-section"
          onClick={() => navigate(isAuthenticated ? "/main" : "/")}
        >
          <img src={logoRemoveBG} alt="StayHub Logo" className="header-logo" />
        </div>

        {/* Search (ẩn trên mobile) */}
        <div className="search-section">
          <div className="search-container">
            <SearchOutlined className="search-icon" />
            <Input
              placeholder="Bạn muốn tìm trọ ở đâu?"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onPressEnter={handleSearch}
              className="search-input"
              variant="borderless"
            />
            <Button
              type="primary"
              onClick={handleSearch}
              className="search-button"
            >
              Tìm kiếm
            </Button>
          </div>
        </div>

        {/* Right section desktop */}
        <div className="desktop-nav">
          {isAuthenticated ? (
            <Space size={32}>
              <Button
                type="text"
                icon={<HeartOutlined />}
                onClick={() => navigate("/main/saved")}
                className="nav-link"
              >
                Phòng yêu thích
              </Button>
              <Button
                type="text"
                icon={<HistoryOutlined />}
                onClick={() => navigate("/rental-history")}
                className="nav-link"
              >
                Lịch sử thuê
              </Button>
              <Button
                type="text"
                icon={<QuestionCircleOutlined />}
                onClick={() => navigate("/support")}
                className="nav-link"
              >
                Hỗ trợ
              </Button>
              <Button
                type="text"
                icon={
                  <Badge count={5} size="small">
                    <BellOutlined className="notification-icon" />
                  </Badge>
                }
                onClick={() => navigate("/notifications")}
                className="notification-btn"
              />
              <Dropdown
                menu={{ items: userMenuItems }}
                trigger={["click"]}
                placement="bottomRight"
              >
                <Avatar
                  size={40}
                  src={user?.avatar || "https://placehold.co/36x36"}
                  className="user-avatar"
                  style={{ cursor: "pointer" }}
                />
              </Dropdown>
            </Space>
          ) : (
            <Space size={16}>
              <Button
                type="default"
                onClick={() => navigate("/login")}
                className="login-button"
              >
                Đăng nhập
              </Button>
              <Button
                type="primary"
                onClick={() => navigate("/start")}
                className="register-button"
              >
                Đăng ký
              </Button>
            </Space>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="mobile-menu-btn">
          <MenuOutlined onClick={() => setIsDrawerOpen(true)} />
        </div>
      </div>

      {/* Drawer for mobile */}
      <Drawer
        title="Menu"
        placement="right"
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
      >
        {isAuthenticated ? (
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <div className="search-container">
              <SearchOutlined className="search-icon" />
              <Input
                placeholder="Bạn muốn tìm trọ ở đâu?"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onPressEnter={handleSearch}
                className="search-input"
                bordered={false}
              />
              <Button
                type="primary"
                onClick={handleSearch}
                className="search-button"
              >
                Tìm kiếm
              </Button>
            </div>
            <Button
              type="text"
              icon={<HeartOutlined />}
              onClick={() => navigate("/saved-rooms")}
            >
              Phòng yêu thích
            </Button>
            <Button
              type="text"
              icon={<HistoryOutlined />}
              onClick={() => navigate("/rental-history")}
            >
              Lịch sử thuê
            </Button>
            <Button
              type="text"
              icon={<QuestionCircleOutlined />}
              onClick={() => navigate("/support")}
            >
              Hỗ trợ
            </Button>
            <Button
              type="text"
              icon={<BellOutlined />}
              onClick={() => navigate("/notifications")}
            >
              Thông báo
            </Button>
            <Button
              type="text"
              icon={<UserOutlined />}
              onClick={() => navigate("/profile")}
            >
              Thông tin cá nhân
            </Button>
            <Button
              danger
              type="text"
              icon={<LogoutOutlined />}
              onClick={handleLogout}
            >
              Đăng xuất
            </Button>
          </Space>
        ) : (
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <Button type="default" onClick={() => navigate("/login")}>
              Đăng nhập
            </Button>
            <Button type="primary" onClick={() => navigate("/register")}>
              Đăng ký
            </Button>
          </Space>
        )}
      </Drawer>
    </header>
  );
};
// ✅ Khai báo propTypes
Header.propTypes = {
  isAuthenticated: PropTypes.bool, // giá trị true/false
  user: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    avatar: PropTypes.string,
  }),
};
Header.propTypes = {
  isAuthenticated: PropTypes.bool,
  user: PropTypes.object,
};

export default Header;