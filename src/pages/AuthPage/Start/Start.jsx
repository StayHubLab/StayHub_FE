import React from 'react';
import { Button, Card, Space, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { HomeOutlined, UserOutlined } from '@ant-design/icons';
import logoRemoveBG from '../../../assets/images/logo/logoRemoveBG.png';
import './Start.css';

const { Title, Text } = Typography;

const Start = () => {
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    console.log('Selected role:', role);
    navigate(`/register?role=${role}`);
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="start-container">
      <div className="start-content">
        {/* Logo placeholder */}
        <div className="logo-container">
          <img src={logoRemoveBG} alt="StayHub Logo" className="logo-image" />
        </div>

        {/* Welcome message */}
        <div className="welcome-section">
          <Title level={1} className="welcome-title">
            Chào mừng bạn đến với <span className="stay-text">Stay</span>
            <span className="hub-text">Hub</span>!
          </Title>
          <Text className="welcome-subtitle">
            Chọn vai trò của bạn để khám phá những tính năng tối ưu.
          </Text>
        </div>

        {/* Role selection cards */}
        <Space direction="vertical" size={24} className="role-cards">
          <Card
            className="role-card tenant-card"
            hoverable
            onClick={() => handleRoleSelect('tenant')}
          >
            <div className="role-card-content">
              <div className="role-icon tenant-icon">
                <UserOutlined />
              </div>
              <div className="role-text">
                <Title level={4} className="role-title">
                  Tôi là Người Thuê
                </Title>
                <Text className="role-description">Tìm phòng trọ lý tưởng, tiện nghi.</Text>
              </div>
            </div>
          </Card>

          <Card
            className="role-card landlord-card"
            hoverable
            onClick={() => handleRoleSelect('landlord')}
          >
            <div className="role-card-content">
              <div className="role-icon landlord-icon">
                <HomeOutlined />
              </div>
              <div className="role-text">
                <Title level={4} className="role-title">
                  Tôi là Chủ Trọ
                </Title>
                <Text className="role-description">Quản lý tài sản hiệu quả, tự động.</Text>
              </div>
            </div>
          </Card>
        </Space>

        {/* Login link */}
        <div className="login-section">
          <Text className="login-text">
            Đã có tài khoản?{' '}
            <Button type="link" className="login-link" onClick={handleLogin}>
              Đăng nhập
            </Button>
          </Text>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="decoration decoration-top-right" />
      <div className="decoration decoration-bottom-left" />
    </div>
  );
};

export default Start;
