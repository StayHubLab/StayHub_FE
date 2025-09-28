import React from "react";
import { Row, Col, Typography, Card } from "antd";
import {
  ThunderboltOutlined,
  SafetyOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import "./FeatureSection.css";

const { Title, Text } = Typography;

const FeatureSection = () => {
  const features = [
    {
      id: 1,
      icon: <SafetyOutlined className="landing-feature-icon" />,
      title: "Minh bạch & Tin cậy",
      description:
        "Thông tin phòng trọ được xác thực, đánh giá thực tế từ người thuê trước, không còn lo lắng về tin đăng ảo.",
    },
    {
      id: 2,
      icon: <ThunderboltOutlined className="landing-feature-icon" />,
      title: "Tiện lợi & Nhanh chóng",
      description:
        "Tìm kiếm, lọc phòng theo nhu cầu, lịch xem và thanh toán trực tuyến dễ đặt dàng chỉ trong vài phút.",
    },
    {
      id: 3,
      icon: <AppstoreOutlined className="landing-feature-icon" />,
      title: "Hệ sinh thái kết nối",
      description:
        "Kết nối chủ trọ và người thuê, tích hợp dịch vụ hỗ trợ chuyển nhà, sửa chữa và các tiện ích khác.",
    },
  ];

  return (
    <section className="landing-feature-section">
      <div className="landing-feature-container">
        <div className="landing-feature-header">
          <Title level={2} className="landing-feature-title">
            Tại Sao Chọn StayHub?
          </Title>
          <Text className="landing-feature-subtitle">
            Chúng tôi đang xây dựng nền tảng toàn diện nhất cho việc tìm kiếm,
            thuê và quản lý nhà trọ tại Việt Nam
          </Text>
        </div>

        <Row gutter={[32, 32]} className="landing-feature-cards">
          {features.map((feature) => (
            <Col xs={24} md={8} key={feature.id}>
              <Card className="landing-feature-card" bordered={false}>
                <div className="landing-feature-card-content">
                  <div className="landing-feature-icon-wrapper">
                    {feature.icon}
                  </div>
                  <Title level={4} className="landing-feature-card-title">
                    {feature.title}
                  </Title>
                  <Text className="landing-feature-card-description">
                    {feature.description}
                  </Text>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
};

export default FeatureSection;
