import React from "react";
import { Card, Button, Typography, Row, Col, Tag } from "antd";
import { CrownOutlined, CheckOutlined } from "@ant-design/icons";
import "./Subscription.css";

const { Title, Text } = Typography;

const Subscription = () => {
  const plans = [
    {
      name: "Gói cơ bản",
      price: 0,
      features: ["Tối đa 5 phòng", "Hỗ trợ cơ bản", "Báo cáo hàng tháng"],
      current: true,
    },
    {
      name: "Gói chuyên nghiệp",
      price: 299000,
      features: [
        "Không giới hạn phòng",
        "Hỗ trợ 24/7",
        "Báo cáo chi tiết",
        "Tích hợp thanh toán",
      ],
      popular: true,
    },
    {
      name: "Gói doanh nghiệp",
      price: 599000,
      features: [
        "Tất cả tính năng Pro",
        "Quản lý nhiều tòa nhà",
        "API tích hợp",
        "Ưu tiên hỗ trợ",
      ],
    },
  ];

  return (
    <div className="subscription-container">
      <div className="subscription-header">
        <Title level={2}>Gói đăng ký</Title>
        <Text>Chọn gói phù hợp với nhu cầu quản lý của bạn</Text>
      </div>

      <Row gutter={[24, 24]} className="subscription-plans">
        {plans.map((plan, index) => (
          <Col xs={24} md={8} key={index}>
            <Card
              className={`plan-card ${plan.current ? "current" : ""} ${plan.popular ? "popular" : ""}`}
              actions={[
                <Button
                  key="upgrade-btn"
                  type={plan.current ? "default" : "primary"}
                  block
                  disabled={plan.current}
                >
                  {plan.current ? "Đang sử dụng" : "Nâng cấp"}
                </Button>,
              ]}
            >
              {plan.popular && (
                <Tag color="orange" className="popular-tag">
                  Phổ biến
                </Tag>
              )}
              <div className="plan-header">
                <CrownOutlined className="plan-icon" />
                <Title level={4}>{plan.name}</Title>
                <div className="plan-price">
                  <span className="price">
                    {plan.price === 0
                      ? "Miễn phí"
                      : `${plan.price.toLocaleString()}VNĐ`}
                  </span>
                  {plan.price > 0 && <span className="period">/tháng</span>}
                </div>
              </div>
              <div className="plan-features">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="feature">
                    <CheckOutlined className="check-icon" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Subscription;
