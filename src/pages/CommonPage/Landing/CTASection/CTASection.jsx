import React from 'react';
import { Typography, Button, Row, Col } from 'antd';
import { ArrowRightOutlined, PhoneOutlined } from '@ant-design/icons';
import './CTASection.css';

const { Title, Text } = Typography;

const CTASection = () => {
  return (
    <section className="cta-section">
      <div className="cta-container">
        <div className="cta-content">
          <Title level={2} className="cta-title">
            Sẵn Sàng Bắt Đầu Với StayHub?
          </Title>
          <Text className="cta-subtitle">
            Tham gia cộng đồng hơn 100,000 người dùng đang tin tưởng StayHub 
            để tìm kiếm và quản lý chỗ ở một cách hiệu quả nhất.
          </Text>

          <Row gutter={[24, 16]} className="cta-buttons" justify="center">
            <Col xs={24} sm={12} md={8}>
              <Button 
                type="primary" 
                size="large" 
                className="cta-btn primary-btn"
                icon={<ArrowRightOutlined />}
                iconPosition="end"
                block
              >
                Tìm Phòng Ngay
              </Button>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Button 
                size="large" 
                className="cta-btn secondary-btn"
                icon={<ArrowRightOutlined />}
                iconPosition="end"
                block
              >
                Cho Thuê Phòng
              </Button>
            </Col>
          </Row>

          <div className="cta-contact">
            <PhoneOutlined className="contact-icon" />
            <Text className="contact-text">
              Cần hỗ trợ? Gọi ngay: <strong>0000 000 000</strong>
            </Text>
          </div>
        </div>

        <div className="cta-features">
          <Row gutter={[32, 16]} justify="center">
            <Col xs={24} sm={8} className="cta-feature">
              <div className="feature-item">
                <Title level={4} className="feature-number">24/7</Title>
                <Text className="feature-text">Hỗ trợ khách hàng</Text>
              </div>
            </Col>
            <Col xs={24} sm={8} className="cta-feature">
              <div className="feature-item">
                <Title level={4} className="feature-number">100%</Title>
                <Text className="feature-text">Miễn phí cho người thuê</Text>
              </div>
            </Col>
            <Col xs={24} sm={8} className="cta-feature">
              <div className="feature-item">
                <Title level={4} className="feature-number">30 ngày</Title>
                <Text className="feature-text">Dùng thử miễn phí</Text>
              </div>
            </Col>
          </Row>
        </div>
      </div>

      <div className="cta-background">
        <div className="bg-shape bg-shape-1"></div>
        <div className="bg-shape bg-shape-2"></div>
        <div className="bg-shape bg-shape-3"></div>
      </div>
    </section>
  );
};

export default CTASection;
