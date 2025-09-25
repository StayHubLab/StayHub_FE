import React from "react";
import { Row, Col, Typography, Button, List } from "antd";
import { CheckCircleOutlined, ArrowRightOutlined } from "@ant-design/icons";
import "./LandlordSection.css";
import landlordImage from "../../../../assets/images/landing/landlord.png";
const { Title, Text } = Typography;

const LandlordSection = () => {
  const features = [
    "Đăng tin miễn phí và quản lý thông tin phòng trọ dễ dàng.",
    "Hệ thống lọc người thuê với xác minh danh tính đầy đủ.",
    "Công cụ quản lý hợp đồng minh bạch và thanh toán tự động.",
    "Báo cáo doanh thu chi tiết và phân tích hiệu quả kinh doanh.",
  ];

  return (
    <section className="landing-landlord-section">
      <div className="landing-landlord-container">
        <Row gutter={[80, 48]} align="middle">
          <Col xs={24} lg={12} className="landing-landlord-content">
            <div className="landing-landlord-text">
              <Title level={2} className="landing-landlord-title">
                Dành Cho Chủ Trọ
              </Title>
              <Text className="landing-landlord-subtitle">
                Quản lý tài sản của bạn dễ dàng với hệ thống tự động hóa thông
                minh. Từ đăng tin, quản lý hợp đồng đến thu phí, tất cả đều được
                số hóa.{" "}
              </Text>

              <List
                className="landing-landlord-features"
                dataSource={features}
                renderItem={(item) => (
                  <List.Item className="landing-landlord-feature-item">
                    <CheckCircleOutlined className="landing-feature-check-icon" />
                    <Text className="landing-textlandlord">{item}</Text>
                  </List.Item>
                )}
              />

              <div className="landing-landlord-cta">
                <Button
                  type="primary"
                  size="large"
                  className="landing-landlord-btn"
                  icon={<ArrowRightOutlined />}
                  iconPosition="end"
                >
                  Đăng kí làm chủ trọ
                </Button>
                <Text className="landing-landlord-note">
                  Dễ dàng, nhanh chóng.
                </Text>
              </div>
            </div>
          </Col>

          <Col xs={24} lg={12} className="landing-landlord-image">
            <div className="landing-image-container">
              <img
                src="/src/assets/images/landlord-dashboard.png"
                alt="Landlord Dashboard"
                className="landing-landlord-img"
                onError={(e) => {
                  e.target.src = landlordImage;
                }}
              />
              <div className="landing-image-overlay">
                <div className="landing-stats-card">
                  <Title level={4} className="landing-stats-number">
                    15,000+
                  </Title>
                  <Text className="landing-stats-label">Chủ trọ tin tưởng</Text>
                </div>
                <div className="landing-stats-card">
                  <Title level={4} className="landing-stats-number">
                    98%
                  </Title>
                  <Text className="landing-stats-label">Tỷ lệ hài lòng</Text>
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
