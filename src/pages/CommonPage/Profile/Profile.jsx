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
  Select,
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
} from "@ant-design/icons";
import { useAuth } from "../../../contexts/AuthContext";
import authApi from "../../../services/api/authApi";
import {
  fetchProvinces,
  fetchWards,
  formatProvinceName,
  formatWardName,
} from "../../../services/api/vietnamProvinceApi";
import "./Profile.css";

const { Title, Text } = Typography;
const { TextArea } = Input;

const Profile = () => {
  const { user } = useAuth();
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("1");
  const [avatarUrl, setAvatarUrl] = useState("");
  // Address states (use same approach as Register)
  const [provinces, setProvinces] = useState([]);
  const [wards, setWards] = useState([]);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);
  const [selectedProvinceId, setSelectedProvinceId] = useState(null);

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        name: user.name,
        email: user.email,
        phone: user.phone,
        bio: user.bio || "",
        detailedAddress: user.address?.street || "",
      });
      setAvatarUrl(user.avatar || "");
    }
  }, [user, form]);

  // Load provinces on mount
  useEffect(() => {
    const loadProvinces = async () => {
      setLoadingProvinces(true);
      try {
        const data = await fetchProvinces();
        setProvinces(data || []);
      } catch (error) {
        notification.error({
          message: "Lỗi",
          description:
            error?.message || "Không tải được danh sách tỉnh/thành phố",
        });
      } finally {
        setLoadingProvinces(false);
      }
    };

    loadProvinces();
  }, []);

  const handleProvinceChange = async (provinceCode) => {
    setSelectedProvinceId(provinceCode);
    setWards([]);
    form.setFieldsValue({ ward: undefined });
    setLoadingWards(true);
    try {
      const data = await fetchWards(provinceCode);
      setWards(data || []);
    } catch (error) {
      notification.error({
        message: "Lỗi",
        description: error?.message || "Không tải được danh sách phường/xã",
      });
    } finally {
      setLoadingWards(false);
    }
  };

  // Helper: normalize Vietnamese names for matching
  const normalizeName = (str) =>
    (str || "")
      .toString()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

  // Prefill province & ward from existing user.address after provinces load
  useEffect(() => {
    const prefillAddress = async () => {
      if (!user || !provinces || provinces.length === 0) return;

      const cityName = user.address?.city || user.address?.provinceName;
      const wardName = user.address?.ward || user.address?.wardName;

      if (cityName) {
        const provinceMatch = provinces.find(
          (p) => normalizeName(p.name) === normalizeName(cityName)
        );

        if (provinceMatch) {
          form.setFieldsValue({ province: provinceMatch.code });
          setSelectedProvinceId(provinceMatch.code);

          // Load wards and set ward if found
          setLoadingWards(true);
          try {
            const data = await fetchWards(provinceMatch.code);
            setWards(data || []);
            if (wardName) {
              const wardMatch = (data || []).find(
                (w) => normalizeName(w.name) === normalizeName(wardName)
              );
              if (wardMatch) {
                form.setFieldsValue({ ward: wardMatch.code });
              }
            }
          } catch (_) {
            // ignore, already handled elsewhere
          } finally {
            setLoadingWards(false);
          }
        }
      }

      // Ensure street is shown
      if (user.address?.street) {
        form.setFieldsValue({ detailedAddress: user.address.street });
      }
    };

    prefillAddress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, provinces]);

  const handleUpdateProfile = async (values) => {
    setLoading(true);
    try {
      // Build address payload similar to Register
      const provinceObj = provinces.find((p) => p.code === values.province);
      const wardObj = wards.find((w) => w.code === values.ward);

      const address = {
        provinceCode: values.province || null,
        provinceName: provinceObj ? formatProvinceName(provinceObj) : null,
        wardCode: values.ward || null,
        wardName: wardObj ? formatWardName(wardObj) : null,
        street: values.detailedAddress || "",
        // Fields commonly expected by backend
        ward: wardObj ? formatWardName(wardObj) : "",
        district: provinceObj ? formatProvinceName(provinceObj) : "",
        city: provinceObj ? formatProvinceName(provinceObj) : "",
      };

      const payload = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        bio: values.bio,
        address,
      };

      await authApi.updateProfile(payload);

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
                <Form.Item
                  name="province"
                  label="Tỉnh/Thành phố"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn tỉnh/thành phố!",
                    },
                  ]}
                >
                  <Select
                    placeholder="Chọn tỉnh/thành phố"
                    loading={loadingProvinces}
                    onChange={handleProvinceChange}
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option?.children
                        ?.toLowerCase()
                        ?.includes(input.toLowerCase())
                    }
                  >
                    {provinces.map((province) => (
                      <Select.Option key={province.code} value={province.code}>
                        {formatProvinceName(province)}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="ward"
                  label="Phường/Xã"
                  rules={[
                    { required: true, message: "Vui lòng chọn phường/xã!" },
                  ]}
                >
                  <Select
                    placeholder={
                      !selectedProvinceId
                        ? "Vui lòng chọn tỉnh/thành phố trước"
                        : loadingWards
                        ? "Đang tải phường/xã..."
                        : wards.length === 0
                        ? "Không có dữ liệu phường/xã"
                        : "Chọn phường/xã"
                    }
                    loading={loadingWards}
                    disabled={!selectedProvinceId || loadingWards}
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option?.children
                        ?.toLowerCase()
                        ?.includes(input.toLowerCase())
                    }
                  >
                    {wards.map((ward) => (
                      <Select.Option key={ward.code} value={ward.code}>
                        {formatWardName(ward)}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item name="detailedAddress" label="Địa chỉ cụ thể">
                  <Input
                    prefix={<HomeOutlined />}
                    placeholder="Số nhà, tên đường..."
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
                      action="/api/users/profile"
                      method="PUT"
                      onChange={handleAvatarUpload}
                      className="avatar-upload"
                      headers={{
                        Authorization: `Bearer ${localStorage.getItem(
                          "token"
                        )}`,
                      }}
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
