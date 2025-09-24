import React from 'react';
import { Row, Col, Typography, Button, List } from 'antd';
import { CheckCircleOutlined, ArrowRightOutlined } from '@ant-design/icons';
import './LandlordSection.css';

const { Title, Text } = Typography;

const LandlordSection = () => {
  const features = [
    "Đăng tin miễn phí và quản lý thông tin phòng trọ dễ dàng.",
    "Hệ thống lọc người thuê với xác minh danh tính đầy đủ.",
    "Công cụ quản lý hợp đồng minh bạch và thanh toán tự động.",
    "Báo cáo doanh thu chi tiết và phân tích hiệu quả kinh doanh.",
  ];

  return (
    <section className="landlord-section">
      <div className="landlord-container">
        <Row gutter={[80, 48]} align="middle">
          <Col xs={24} lg={12} className="landlord-content">
            <div className="landlord-text">
              <Title level={2} className="landlord-title">
                Dành Cho Chủ Trọ
              </Title>
              <Text className="landlord-subtitle">
                Quản lý tài sản của bạn dễ dàng với hệ thống tự động hóa thông minh. Từ đăng tin, quản lý hợp đồng đến thu phí, tất cả đều được số hóa.              </Text>

              <List
                className="landlord-features"
                dataSource={features}
                renderItem={(item) => (
                  <List.Item className="landlord-feature-item">
                    <CheckCircleOutlined className="feature-check-icon" />
                    <Text className="textlandlord">{item}</Text>
                  </List.Item>
                )}
              />

              <div className="landlord-cta">
                <Button
                  type="primary"
                  size="large"
                  className="landlord-btn"
                  icon={<ArrowRightOutlined />}
                  iconPosition="end"
                >
                  Đăng kí làm chủ trọ
                </Button>
                <Text className="landlord-note">
                  Dễ dàng, nhanh chóng.
                </Text>
              </div>
            </div>
          </Col>

          <Col xs={24} lg={12} className="landlord-image">
            <div className="image-container">
              <img
                src="/src/assets/images/landlord-dashboard.png"
                alt="Landlord Dashboard"
                className="landlord-img"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/600x400/4739F0/ffffff?text=Landlord+Dashboard";
                }}
              />
              <div className="image-overlay">
                <div className="stats-card">
                  <Title level={4} className="stats-number">15,000+</Title>
                  <Text className="stats-label">Chủ trọ tin tưởng</Text>
                </div>
                <div className="stats-card">
                  <Title level={4} className="stats-number">98%</Title>
                  <Text className="stats-label">Tỷ lệ hài lòng</Text>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </section>
  );
};

export default LandlordSection;
