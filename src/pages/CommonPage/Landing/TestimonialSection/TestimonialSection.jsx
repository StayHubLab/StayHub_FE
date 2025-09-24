import { UserOutlined } from '@ant-design/icons';
import { Avatar, Card, Col, Rate, Row, Typography } from 'antd';
import './TestimonialSection.css';

const { Title, Text } = Typography;

const TestimonialSection = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Nguyễn Minh Anh',
      role: 'Sinh viên ĐH Bách Khoa',
      rating: 5,
      comment:
        'StayHub giúp mình tìm được phòng trọ gần trường với giá hợp lý chỉ trong 2 ngày. Quy trình đăng ký đơn giản và chủ trọ rất uy tín.',
      avatar: 'https://via.placeholder.com/64x64/4739F0/ffffff?text=MA',
    },
    {
      id: 2,
      name: 'Trần Văn Hùng',
      role: 'Chủ trọ tại Quận 1',
      rating: 5,
      comment:
        'Từ khi sử dụng StayHub, tỷ lệ lấp phòng của mình tăng 80%. Hệ thống quản lý rất chuyên nghiệp và tiện lợi.',
      avatar: 'https://via.placeholder.com/64x64/FAC227/4739F0?text=TVH',
    },
    {
      id: 3,
      name: 'Lê Thị Hương',
      role: 'Nhân viên văn phòng',
      rating: 5,
      comment:
        'Dịch vụ tuyệt vời! Đội ngũ hỗ trợ nhiệt tình, phản hồi nhanh. Mình đã giới thiệu StayHub cho nhiều bạn bè.',
      avatar: 'https://via.placeholder.com/64x64/10B981/ffffff?text=LTH',
    },
  ];

  return (
    <section className="testimonial-section">
      <div className="testimonial-container">
        <div className="testimonial-header">
          <Title level={2} className="testimonial-title">
            Khách Hàng Nói Gì Về StayHub?
          </Title>
          <Text className="testimonial-subtitle">
            Hàng ngàn người dùng đã tìm được nơi ở lý tưởng và quản lý tài sản hiệu quả với
            StayHub{' '}
          </Text>
        </div>

        <Row gutter={[32, 32]} className="testimonial-cards">
          {testimonials.map((testimonial) => (
            <Col xs={24} md={8} key={testimonial.id}>
              <Card className="testimonial-card" bordered={false}>
                <div className="testimonial-content">
                  <Rate disabled defaultValue={testimonial.rating} className="testimonial-rating" />

                  <Text className="testimonial-comment">{testimonial.comment}</Text>

                  <div className="testimonial-author">
                    <Avatar
                      size={48}
                      src={testimonial.avatar}
                      icon={<UserOutlined />}
                      className="author-avatar"
                    />
                    <div className="author-info">
                      <Title level={5} className="author-name">
                        {testimonial.name}
                      </Title>
                      <Text className="author-role">{testimonial.role}</Text>
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        <div className="testimonial-stats">
          <Row gutter={[48, 24]} justify="center">
            <Col xs={12} sm={6} className="stat-item">
              <Title level={2} className="stat-number">
                100K+
              </Title>
              <Text className="stat-label">Người dùng</Text>
            </Col>
            <Col xs={12} sm={6} className="stat-item">
              <Title level={2} className="stat-number">
                50K+
              </Title>
              <Text className="stat-label">Phòng trọ</Text>
            </Col>
            <Col xs={12} sm={6} className="stat-item">
              <Title level={2} className="stat-number">
                15K+
              </Title>
              <Text className="stat-label">Chủ trọ</Text>
            </Col>
            <Col xs={12} sm={6} className="stat-item">
              <Title level={2} className="stat-number">
                4.9/5
              </Title>
              <Text className="stat-label">Đánh giá</Text>
            </Col>
          </Row>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
