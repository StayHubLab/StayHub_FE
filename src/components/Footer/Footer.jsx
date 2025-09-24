import React from 'react';
import { Row, Col, Typography, Space } from 'antd';
import {
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  LinkedinOutlined,
  EnvironmentOutlined,
  MailOutlined,
  PhoneOutlined,
} from '@ant-design/icons';
import logoRemoveBG from '../../assets/images/logo/logoRemoveBG.png';
import './Footer.css';

const { Title, Text } = Typography;

const Footer = () => {
  const handleSocialClick = (platform) => {
    // TODO: Add actual social media links
    console.log(`Opening ${platform}`);
  };

  const handleLinkClick = (link) => {
    // TODO: Add navigation logic
    console.log(`Navigating to ${link}`);
  };

  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div style={{ paddingTop: 20 }}>
          <Row gutter={[32, 32]}>
            {/* Logo and Description Column */}
            <Col xs={24} sm={12} md={6} lg={6}>
              <div className="footer-brand">
                <img src={logoRemoveBG} alt="StayHub Logo" className="footer-logo" />
                <Text className="brand-description">
                  Giải pháp trọ toàn diện trong kỷ nguyên số
                </Text>

                {/* Social Media Icons */}
                <div className="social-media">
                  <Space size={16}>
                    <div className="social-icon" onClick={() => handleSocialClick('facebook')}>
                      <FacebookOutlined />
                    </div>
                    <div className="social-icon" onClick={() => handleSocialClick('twitter')}>
                      <TwitterOutlined />
                    </div>
                    <div className="social-icon" onClick={() => handleSocialClick('instagram')}>
                      <InstagramOutlined />
                    </div>
                    <div className="social-icon" onClick={() => handleSocialClick('linkedin')}>
                      <LinkedinOutlined />
                    </div>
                  </Space>
                </div>
              </div>
            </Col>

            {/* For Tenants Column */}
            <Col xs={24} sm={12} md={6} lg={6}>
              <div className="footer-section">
                <Title level={5} className="section-title">
                  Dành cho người thuê
                </Title>
                <div className="footer-links">
                  <div className="footer-link" onClick={() => handleLinkClick('search-rooms')}>
                    Tìm phòng trọ
                  </div>
                  <div className="footer-link" onClick={() => handleLinkClick('payment')}>
                    Cọc, Thanh toán online
                  </div>
                  <div className="footer-link" onClick={() => handleLinkClick('contract')}>
                    Hợp đồng thuê
                  </div>
                  <div className="footer-link" onClick={() => handleLinkClick('support')}>
                    Hỗ trợ sự cố
                  </div>
                </div>
              </div>
            </Col>

            {/* For Landlords Column */}
            <Col xs={24} sm={12} md={6} lg={6}>
              <div className="footer-section">
                <Title level={5} className="section-title">
                  Dành cho chủ trọ
                </Title>
                <div className="footer-links">
                  <div className="footer-link" onClick={() => handleLinkClick('post-listing')}>
                    Đăng tin
                  </div>
                  <div className="footer-link" onClick={() => handleLinkClick('manage-rooms')}>
                    Quản lý phòng trọ
                  </div>
                  <div className="footer-link" onClick={() => handleLinkClick('manage-contracts')}>
                    Quản lý hợp đồng
                  </div>
                  <div className="footer-link" onClick={() => handleLinkClick('financial-reports')}>
                    Báo cáo tài chính
                  </div>
                </div>
              </div>
            </Col>

            {/* Contact Column */}
            <Col xs={24} sm={12} md={6} lg={6}>
              <div className="footer-section">
                <Title level={5} className="section-title">
                  Liên hệ
                </Title>
                <div className="contact-info">
                  <div className="contact-item">
                    <EnvironmentOutlined className="contact-icon" />
                    <Text className="contact-footer">FPT Da Nang University</Text>
                  </div>
                  <div className="contact-item">
                    <MailOutlined className="contact-icon" />
                    <Text className="contact-footer">stayhub56@gmail.com</Text>
                  </div>
                  <div className="contact-item">
                    <PhoneOutlined className="contact-icon" />
                    <Text className="contact-footer">0000 000 000</Text>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
