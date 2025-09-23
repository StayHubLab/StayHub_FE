import React from 'react';
import { Card, Button, Typography, Row, Col, Form, Input, Select } from 'antd';
import { PhoneOutlined, MailOutlined, MessageOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import './Support.css';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const Support = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log('Support request:', values);
  };

  const faqItems = [
    {
      question: 'Làm thế nào để thêm phòng mới?',
      answer: 'Vào mục "Quản lý phòng" và nhấn nút "Thêm phòng mới"'
    },
    {
      question: 'Cách xác nhận thanh toán từ khách thuê?',
      answer: 'Vào mục "Giao dịch" để xem và xác nhận các khoản thanh toán'
    },
    {
      question: 'Tôi có thể quản lý bao nhiêu phòng?',
      answer: 'Tùy thuộc vào gói đăng ký của bạn. Gói cơ bản có thể quản lý tối đa 5 phòng'
    }
  ];

  return (
    <div className="support-container">
      <Title level={2}>Hỗ trợ</Title>
      
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={8}>
          <Card title="Liên hệ trực tiếp" className="contact-card">
            <div className="contact-item">
              <PhoneOutlined className="contact-icon" />
              <div>
                <div className="contact-title">Hotline</div>
                <div className="contact-info">1900-1234</div>
              </div>
            </div>
            
            <div className="contact-item">
              <MailOutlined className="contact-icon" />
              <div>
                <div className="contact-title">Email</div>
                <div className="contact-info">support@stayhub.vn</div>
              </div>
            </div>
            
            <div className="contact-item">
              <MessageOutlined className="contact-icon" />
              <div>
                <div className="contact-title">Chat trực tuyến</div>
                <Button type="primary" size="small">Bắt đầu chat</Button>
              </div>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} lg={16}>
          <Card title="Gửi yêu cầu hỗ trợ" className="support-form-card">
            <Form form={form} layout="vertical" onFinish={onFinish}>
              <Form.Item name="subject" label="Chủ đề" rules={[{ required: true }]}>
                <Select placeholder="Chọn chủ đề">
                  <Option value="technical">Vấn đề kỹ thuật</Option>
                  <Option value="billing">Vấn đề thanh toán</Option>
                  <Option value="feature">Yêu cầu tính năng</Option>
                  <Option value="other">Khác</Option>
                </Select>
              </Form.Item>
              
              <Form.Item name="message" label="Nội dung" rules={[{ required: true }]}>
                <TextArea rows={6} placeholder="Mô tả chi tiết vấn đề của bạn..." />
              </Form.Item>
              
              <Button type="primary" htmlType="submit">
                Gửi yêu cầu
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
      
      <Card title="Câu hỏi thường gặp" className="faq-card">
        {faqItems.map((item, index) => (
          <div key={index} className="faq-item">
            <div className="faq-question">
              <QuestionCircleOutlined /> {item.question}
            </div>
            <Paragraph className="faq-answer">{item.answer}</Paragraph>
          </div>
        ))}
      </Card>
    </div>
  );
};

export default Support;