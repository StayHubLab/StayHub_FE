import { ArrowRightOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { Button, Col, List, Row, Typography } from "antd";
import "./TenantSection.css";
import tenantImage from "../../../../assets/images/landing/tenant.png";

const { Title, Text } = Typography;

const TenantSection = () => {
  const features = [
    "Tìm kiếm thông minh với bộ lọc đa tiêu chí và bản đồ tương tác",
    "Bảo mật thông tin cá nhân và hỗ trợ sự cố nhanh chóng",
    "Ký hợp đồng trực tuyến, thanh toán an toàn qua ứng dụng",
  ];

  return (
    <section className="tenant-section">
      <div className="tenant-container">
        <Row gutter={[80, 48]} align="middle">
          <Col xs={24} lg={12} className="tenant-image">
            <div className="tenant-image-container">
              <img
                src="/src/assets/images/tenant-searching.png"
                alt="Tenant Searching"
                className="tenant-img"
                onError={(e) => {
                  e.target.src = tenantImage;
                }}
              />
              <div className="search-overlay">
                <div className="search-card">
                  <Title level={5} className="search-title">
                    Tìm kiếm thông minh
                  </Title>
                  <Text className="search-subtitle">
                    50,000+ phòng trọ đã được xác minh
                  </Text>
                </div>
              </div>
            </div>
          </Col>

          <Col xs={24} lg={12} className="tenant-content">
            <div className="tenant-text">
              <Title level={2} className="tenant-title">
                Dành Cho Người Thuê
              </Title>
              <Text className="tenant-subtitle">
                Tìm kiếm và thuê phòng trọ chưa bao giờ dễ dàng đến thế. Với
                StayHub, bạn có thể khám phá hàng ngàn lựa chọn phù hợp với nhu
                cầu và ngân sách.
              </Text>

              <List
                className="tenant-features"
                dataSource={features}
                renderItem={(item) => (
                  <List.Item className="tenant-feature-item">
                    <CheckCircleOutlined
                      className="feature-check-icon"
                      style={{ color: "#e6af22" }}
                    />
                    <Text className="texttenant">{item}</Text>
                  </List.Item>
                )}
              />

              <div className="tenant-cta">
                <Button
                  type="primary"
                  size="large"
                  className="tenant-btn"
                  icon={<ArrowRightOutlined />}
                  iconPosition="end"
                >
                  Tìm Phòng Ngay
                </Button>
                <Text className="tenant-note">
                  Hoàn toàn miễn phí cho người thuê
                </Text>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </section>
  );
};

export default TenantSection;
