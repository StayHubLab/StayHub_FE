import React from "react";
import { Form, Input, Button, Switch, Typography, Card, Row, Col } from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  LockOutlined,
} from "@ant-design/icons";
import "./Settings.css";

const { Title } = Typography;

const Settings = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
  };

  return (
    <div className="settings-container">
      <Title level={2}>Cài đặt</Title>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card title="Thông tin cá nhân" className="settings-card">
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              initialValues={{
                name: "Nguyễn Văn Chủ",
                email: "landlord@example.com",
                phone: "0123456789",
              }}
            >
              <Form.Item name="name" label="Họ tên">
                <Input prefix={<UserOutlined />} />
              </Form.Item>

              <Form.Item name="email" label="Email">
                <Input prefix={<MailOutlined />} />
              </Form.Item>

              <Form.Item name="phone" label="Số điện thoại">
                <Input prefix={<PhoneOutlined />} />
              </Form.Item>

              <Form.Item name="password" label="Mật khẩu mới">
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Để trống nếu không đổi"
                />
              </Form.Item>

              <Button type="primary" htmlType="submit">
                Cập nhật thông tin
              </Button>
            </Form>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Cài đặt thông báo" className="settings-card">
            <div className="notification-item">
              <div>
                <div className="notification-title">Email thông báo</div>
                <div className="notification-desc">
                  Nhận thông báo qua email
                </div>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="notification-item">
              <div>
                <div className="notification-title">Thông báo thanh toán</div>
                <div className="notification-desc">
                  Thông báo khi có giao dịch mới
                </div>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="notification-item">
              <div>
                <div className="notification-title">Thông báo lịch hẹn</div>
                <div className="notification-desc">
                  Nhận thông báo lịch xem phòng
                </div>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="notification-item">
              <div>
                <div className="notification-title">Báo cáo hàng tháng</div>
                <div className="notification-desc">
                  Gửi báo cáo doanh thu hàng tháng
                </div>
              </div>
              <Switch />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Settings;
