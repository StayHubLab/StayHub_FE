import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Avatar,
  Typography,
  Row,
  Col,
  Tabs,
  Upload,
  notification,
  Divider,
  Switch,
  Space,
} from "antd";
import {
  UserOutlined,
  SettingOutlined,
  KeyOutlined,
  HomeOutlined,
  CameraOutlined,
  EditOutlined,
  SaveOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../../contexts/AuthContext";
import authApi from "../../../services/api/authApi";
import "./Profile.css";

const { Title, Text } = Typography;
const { TextArea } = Input;

const Profile = () => {
  const { user, login } = useAuth();
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("1");
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        name: user.name,
        email: user.email,
        phone: user.phone,
        bio: user.bio || "",
        address: {
          street: user.address?.street || "",
          ward: user.address?.ward || "",
          city: user.address?.city || "",
          district: user.address?.district || "",
        },
      });
      setAvatarUrl(user.avatar || "");
    }
  }, [user, form]);

  const handleUpdateProfile = async (values) => {
    setLoading(true);
    try {
      await authApi.updateProfile(values);

      // Refresh user data
      const profileData = await authApi.getProfile();
      if (profileData?.data) {
        // Update AuthContext with new user data
        notification.success({
          message: "Thành công",
          description: "Cập nhật thông tin thành công!",
        });
        setEditMode(false);
      }
    } catch (error) {
      notification.error({
        message: "Lỗi",
        description: error?.response?.data?.message || "Cập nhật thất bại!",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (values) => {
    setLoading(true);
    try {
      await authApi.changePassword(values);
      notification.success({
        message: "Thành công",
        description: "Đổi mật khẩu thành công!",
      });
      passwordForm.resetFields();
    } catch (error) {
      notification.error({
        message: "Lỗi",
        description: error?.response?.data?.message || "Đổi mật khẩu thất bại!",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      setAvatarUrl(info.file.response?.url);
      setLoading(false);
    }
  };

  const uploadButton = (
    <div className="avatar-upload-button">
      <CameraOutlined style={{ fontSize: "20px" }} />
      <div>Đổi ảnh</div>
    </div>
  );

  const tabItems = [
    {
      key: "1",
      label: (
        <span>
          <UserOutlined />
          Thông tin cá nhân
        </span>
      ),
      children: (
        <div className="tab-content">
          <div className="tab-header">
            <Title level={4}>Thông tin cá nhân</Title>
            <Button
              type={editMode ? "primary" : "default"}
              icon={editMode ? <SaveOutlined /> : <EditOutlined />}
              onClick={() => {
                if (editMode) {
                  form.submit();
                } else {
                  setEditMode(true);
                }
              }}
              loading={loading}
            >
              {editMode ? "Lưu" : "Chỉnh sửa"}
            </Button>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleUpdateProfile}
            disabled={!editMode}
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="name"
                  label="Họ và tên"
                  rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="Nhập họ và tên"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="phone"
                  label="Số điện thoại"
                  rules={[
                    { required: true, message: "Vui lòng nhập số điện thoại!" },
                    {
                      pattern: /^[0-9]{10,11}$/,
                      message: "Số điện thoại không hợp lệ!",
                    },
                  ]}
                >
                  <Input
                    prefix={<PhoneOutlined />}
                    placeholder="Nhập số điện thoại"
                  />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item name="bio" label="Giới thiệu">
                  <TextArea
                    rows={4}
                    placeholder="Viết một vài dòng giới thiệu về bản thân..."
                    maxLength={500}
                    showCount
                  />
                </Form.Item>
              </Col>
            </Row>

            <Divider orientation="left">Địa chỉ</Divider>

            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Form.Item name={["address", "street"]} label="Địa chỉ cụ thể">
                  <Input
                    prefix={<HomeOutlined />}
                    placeholder="Số nhà, tên đường..."
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item name={["address", "ward"]} label="Phường/Xã">
                  <Input
                    prefix={<EnvironmentOutlined />}
                    placeholder="Phường/Xã"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item name={["address", "district"]} label="Quận/Huyện">
                  <Input
                    prefix={<EnvironmentOutlined />}
                    placeholder="Quận/Huyện"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item name={["address", "city"]} label="Tỉnh/Thành phố">
                  <Input
                    prefix={<EnvironmentOutlined />}
                    placeholder="Tỉnh/Thành phố"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <span>
          <KeyOutlined />
          Bảo mật
        </span>
      ),
      children: (
        <div className="tab-content">
          <Title level={4}>Đổi mật khẩu</Title>
          <Text type="secondary">
            Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người
            khác.
          </Text>

          <Form
            form={passwordForm}
            layout="vertical"
            onFinish={handleChangePassword}
            style={{ marginTop: 24, maxWidth: 500 }}
          >
            <Form.Item
              name="currentPassword"
              label="Mật khẩu hiện tại"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu hiện tại!" },
              ]}
            >
              <Input.Password placeholder="Nhập mật khẩu hiện tại" />
            </Form.Item>

            <Form.Item
              name="newPassword"
              label="Mật khẩu mới"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu mới!" },
                { min: 8, message: "Mật khẩu phải có ít nhất 8 ký tự!" },
              ]}
            >
              <Input.Password placeholder="Nhập mật khẩu mới" />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Xác nhận mật khẩu mới"
              dependencies={["newPassword"]}
              rules={[
                { required: true, message: "Vui lòng xác nhận mật khẩu mới!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Mật khẩu xác nhận không khớp!")
                    );
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Xác nhận mật khẩu mới" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Đổi mật khẩu
              </Button>
            </Form.Item>
          </Form>
        </div>
      ),
    },
    {
      key: "3",
      label: (
        <span>
          <SettingOutlined />
          Cài đặt
        </span>
      ),
      children: (
        <div className="tab-content">
          <Title level={4}>Cài đặt tài khoản</Title>

          <div className="settings-list">
            <div className="setting-item">
              <div className="setting-info">
                <Text strong>Thông báo email</Text>
                <br />
                <Text type="secondary">
                  Nhận thông báo qua email về đặt phòng và tin nhắn
                </Text>
              </div>
              <Switch defaultChecked />
            </div>

            <Divider />

            <div className="setting-item">
              <div className="setting-info">
                <Text strong>Thông báo push</Text>
                <br />
                <Text type="secondary">
                  Nhận thông báo đẩy trên trình duyệt
                </Text>
              </div>
              <Switch />
            </div>

            <Divider />

            <div className="setting-item">
              <div className="setting-info">
                <Text strong>Hiển thị số điện thoại</Text>
                <br />
                <Text type="secondary">
                  Cho phép người khác xem số điện thoại của bạn
                </Text>
              </div>
              <Switch defaultChecked />
            </div>

            <Divider />

            <div className="setting-item">
              <div className="setting-info">
                <Text strong>Chế độ riêng tư</Text>
                <br />
                <Text type="secondary">
                  Ẩn hồ sơ khỏi kết quả tìm kiếm công khai
                </Text>
              </div>
              <Switch />
            </div>
          </div>
        </div>
      ),
    },
  ];

  if (!user) {
    return (
      <div className="profile-loading">
        <Title level={4}>Vui lòng đăng nhập để xem thông tin cá nhân</Title>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-content">
        <Row gutter={[24, 24]}>
          <Col xs={24}>
            <Card className="profile-header-card">
              <Row align="middle" gutter={[16, 16]}>
                <Col xs={24} sm={6} md={4}>
                  <div className="avatar-container">
                    <Avatar
                      size={120}
                      src={avatarUrl}
                      icon={<UserOutlined />}
                      className="profile-avatar"
                    />
                    <Upload
                      name="avatar"
                      showUploadList={false}
                      action="/api/upload/avatar"
                      onChange={handleAvatarUpload}
                      className="avatar-upload"
                    >
                      {uploadButton}
                    </Upload>
                  </div>
                </Col>
                <Col xs={24} sm={18} md={20}>
                  <div className="profile-info">
                    <Title level={2} className="profile-name">
                      {user?.name}
                    </Title>
                    <Space direction="vertical" size="small">
                      <Text className="profile-role" type="secondary">
                        <UserOutlined />{" "}
                        {user?.role === "tenant" ? "Người thuê" : "Chủ nhà"}
                      </Text>
                      <Text className="profile-email" type="secondary">
                        <MailOutlined /> {user?.email}
                      </Text>
                      <Text className="profile-phone" type="secondary">
                        <PhoneOutlined /> {user?.phone}
                      </Text>
                    </Space>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>

          <Col xs={24}>
            <Card>
              <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                items={tabItems}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Profile;
