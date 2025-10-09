import {
  BankOutlined,
  CameraOutlined,
  CreditCardOutlined,
  EditOutlined,
  HomeOutlined,
  KeyOutlined,
  MailOutlined,
  PhoneOutlined,
  SaveOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Select,
  Space,
  Switch,
  Tabs,
  Typography,
  Upload,
  notification,
} from "antd";
import { useEffect, useState } from "react";
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
  const { user, updateProfile } = useAuth();
  const [api, contextHolder] = notification.useNotification();
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("1");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);

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
        bankInfo: {
          bankName: user.bankInfo?.bankName || "",
          accountNumber: user.bankInfo?.accountNumber || "",
        },
      });
      setAvatarUrl(user.avatar?.url || "");
      
    }
  }, [user, form]);

  useEffect(() => {
    const loadProvinces = async () => {
      setLoadingProvinces(true);
      try {
        const data = await fetchProvinces();
        setProvinces(data || []);
        
        // Auto-match province from user.address.city
        if (user?.address?.city && data?.length > 0) {
          const cityName = user.address.city;
          const matchedProvince = data.find(
            (p) => 
              p.name === cityName ||
              p.name.includes(cityName) ||
              cityName.includes(p.name)
          );
          
          if (matchedProvince) {
            form.setFieldsValue({ province: matchedProvince.code });
            setSelectedProvinceId(matchedProvince.code);
          }
        }
      } catch {
        api.error({ message: "Lỗi tải danh sách tỉnh/thành phố" });
      } finally {
        setLoadingProvinces(false);
      }
    };
    loadProvinces();
  }, [user, form, api]);

  // Auto-load wards when province is selected
  useEffect(() => {
    const loadWards = async () => {
      if (selectedProvinceId) {
        setLoadingWards(true);
        try {
          const data = await fetchWards(selectedProvinceId);
          setWards(data || []);
          
          // Auto-match ward from user.address.ward
          if (user?.address?.ward && data?.length > 0) {
            const wardName = user.address.ward;
            const matchedWard = data.find(
              (w) =>
                w.name === wardName ||
                w.name.includes(wardName) ||
                wardName.includes(w.name)
            );
            
            if (matchedWard) {
              form.setFieldsValue({ ward: matchedWard.code });
            }
          }
        } catch {
          api.error({ message: "Lỗi tải phường/xã" });
        } finally {
          setLoadingWards(false);
        }
      }
    };
    loadWards();
  }, [selectedProvinceId, user, form, api]);

  const handleProvinceChange = async (provinceCode) => {
    setSelectedProvinceId(provinceCode);
    setWards([]);
    form.setFieldsValue({ ward: undefined });
  };

  const handleUpdateProfile = async (values) => {
    setLoading(true);
    try {
      const provinceObj = provinces.find((p) => p.code === values.province);
      const wardObj = wards.find((w) => w.code === values.ward);
      
      // Match backend structure: city, ward, district, street
      const address = {
        city: provinceObj ? formatProvinceName(provinceObj) : null,
        district: provinceObj ? formatProvinceName(provinceObj) : null, // Same as city for now
        ward: wardObj ? formatWardName(wardObj) : null,
        street: values.detailedAddress || "",
      };

      let result;

      // Create FormData if there's an avatar file
      if (avatarFile) {
        const formData = new FormData();
        formData.append('avatar', avatarFile, avatarFile.name);
        formData.append('name', values.name);
        formData.append('phone', values.phone);
        formData.append('bio', values.bio || '');
        
        // Backend expects JSON string for complex objects
        formData.append('address', JSON.stringify(address));
        formData.append('bankInfo', JSON.stringify(values.bankInfo));


        // Call authApi.updateProfile directly with FormData
        try {
          const response = await authApi.updateProfile(formData);
          
          // Backend returns: { success: true, message: "...", data: user }
          if (response && response.success && response.data) {
            result = { success: true, data: response.data };
            
            // Update avatar URL from response
            if (response.data.avatar?.url) {
              setAvatarUrl(response.data.avatar.url);
            }
          } else {
            result = { success: true, data: response };
          }
        } catch (error) {
          throw error;
        }
      } else {
        // No avatar file, send JSON payload
        const payload = {
          name: values.name,
          phone: values.phone,
          bio: values.bio,
          address,
          bankInfo: values.bankInfo,
        };

        result = await updateProfile(payload);
      }

      if (result.success) {
        api.success({ message: "Cập nhật thành công" });
        setEditMode(false);
        setAvatarFile(null); // Reset avatar file after successful upload
        
        // Update user in localStorage and AuthContext
        const updatedUserData = result.data;
        if (updatedUserData) {
          // Update localStorage
          const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
          const mergedUser = { ...currentUser, ...updatedUserData };
          localStorage.setItem("user", JSON.stringify(mergedUser));
          
          // Update avatar URL if available
          if (updatedUserData.avatar?.url) {
            setAvatarUrl(updatedUserData.avatar.url);
          }
          
          // Reload page to reflect changes (optional)
          // window.location.reload();
        }
      } else {
        api.error({ message: result.error || "Lỗi cập nhật thông tin" });
      }
    } catch (error) {
      api.error({ message: error?.response?.data?.message || "Lỗi cập nhật thông tin" });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (values) => {
    setLoading(true);
    try {
      await authApi.changePassword(values);
      api.success({ message: "Đổi mật khẩu thành công" });
      passwordForm.resetFields();
    } catch (error) {
      api.error({ message: "Đổi mật khẩu thất bại" });
    } finally {
      setLoading(false);
    }
  };

  const beforeAvatarUpload = (file) => {
    // Validate file type
    const isValidType = file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/jpg';
    if (!isValidType) {
      api.error({
        message: 'Lỗi định dạng file',
        description: 'Chỉ chấp nhận file .png hoặc .jpg!',
      });
      return false;
    }

    // Validate file size (max 5MB)
    const isValidSize = file.size / 1024 / 1024 < 5;
    if (!isValidSize) {
      api.error({
        message: 'Lỗi kích thước file',
        description: 'Kích thước file không được vượt quá 5MB!',
      });
      return false;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setAvatarUrl(e.target.result);
    };
    reader.readAsDataURL(file);
    setAvatarFile(file);

    return false; // Prevent auto upload
  };

  if (!user) {
    return (
      <div className="profile-loading">
        <Title level={4}>Vui lòng đăng nhập để xem thông tin cá nhân</Title>
      </div>
    );
  }

  const uploadButton = (
    <div className="avatar-upload-button">
      <CameraOutlined style={{ fontSize: "18px" }} />
      <div>Đổi ảnh</div>
    </div>
  );

  return (
    <div className="profile-container">
      {contextHolder}
      <div className="profile-content">
        <Row gutter={[24, 24]}>
          {/* LEFT COLUMN */}
          <Col xs={24} md={8}>
            <Card className="profile-left-card">
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
                  beforeUpload={beforeAvatarUpload}
                  accept=".png,.jpg,.jpeg"
                  disabled={!editMode}
                  className="avatar-upload"
                >
                  {editMode && uploadButton}
                </Upload>
              </div>

              <Divider />
              <div className="profile-info">
                <Title level={3} className="profile-name">
                  {user?.name}
                </Title>
                <Space direction="vertical" size="small">
                  <Text type="secondary">
                    <UserOutlined />{" "}
                    {user?.role === "landlord" ? "Chủ Trọ" : "Người thuê"}
                  </Text>
                  <Text>
                    <MailOutlined /> {user?.email}
                  </Text>
                  <Text>
                    <PhoneOutlined /> {user?.phone}
                  </Text>
                  <Text>
                    <BankOutlined /> {user?.bankInfo?.bankName || "Chưa có ngân hàng"}
                  </Text>
                  <Text>
                    <CreditCardOutlined />{" "}
                    {user?.bankInfo?.accountNumber || "Chưa có số tài khoản"}
                  </Text>
                </Space>
              </div>
            </Card>
          </Col>

          {/* RIGHT COLUMN */}
          <Col xs={24} md={16}>
            <Card className="profile-right-card">
              <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                type="line"
                className="profile-tabs"
                items={[
                  {
                    key: "1",
                    label: (
                      <span>
                        <UserOutlined /> Thông tin cá nhân
                      </span>
                    ),
                    children: (
                      <div className="tab-content">
                        <div className="tab-header">
                          <Space>
                          <Title level={4}>Thông tin cá nhân</Title>
                            {editMode && (
                              <Button
                                onClick={() => {
                                  setEditMode(false);
                                  setAvatarFile(null);
                                  // Reset avatar to original
                                  setAvatarUrl(user?.avatar?.url || "");
                                  // Reset form to original user values
                                  form.setFieldsValue({
                                    name: user.name,
                                    email: user.email,
                                    phone: user.phone,
                                    bio: user.bio || "",
                                    detailedAddress: user.address?.street || "",
                                    bankInfo: {
                                      bankName: user.bankInfo?.bankName || "",
                                      accountNumber: user.bankInfo?.accountNumber || "",
                                    },
                                  });
                                  // Reset province and ward selections
                                  if (user?.address?.city && provinces.length > 0) {
                                    const cityName = user.address.city;
                                    const matchedProvince = provinces.find(
                                      (p) => 
                                        p.name === cityName ||
                                        p.name.includes(cityName) ||
                                        cityName.includes(p.name)
                                    );
                                    if (matchedProvince) {
                                      form.setFieldsValue({ province: matchedProvince.code });
                                      setSelectedProvinceId(matchedProvince.code);
                                    }
                                  }
                                }}
                              >
                                Hủy
                              </Button>
                            )}
                            <Button
                              type={editMode ? "primary" : "default"}
                              icon={editMode ? <SaveOutlined /> : <EditOutlined />}
                              onClick={() => {
                                if (editMode) form.submit();
                                else setEditMode(true);
                              }}
                              loading={loading}
                            >
                              {editMode ? "Lưu" : "Chỉnh sửa"}
                            </Button>
                          </Space>
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
                                rules={[{ required: true }]}
                              >
                                <Input prefix={<UserOutlined />} />
                              </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                              <Form.Item
                                name="phone"
                                label="Số điện thoại"
                                rules={[
                                  { required: true },
                                  {
                                    pattern: /^[0-9]{10,11}$/,
                                    message: "Số điện thoại không hợp lệ!",
                                  },
                                ]}
                              >
                                <Input prefix={<PhoneOutlined />} />
                              </Form.Item>
                            </Col>
                            <Col xs={24}>
                              <Form.Item name="bio" label="Giới thiệu">
                                <TextArea rows={4} maxLength={500} showCount />
                              </Form.Item>
                            </Col>
                          </Row>

                          <Divider orientation="left">Địa chỉ</Divider>

                          <Row gutter={[16, 16]}>
                            <Col xs={24} md={12}>
                              <Form.Item
                                name="province"
                                label="Tỉnh/Thành phố"
                                rules={[{ required: true }]}
                              >
                                <Select
                                  placeholder="Chọn tỉnh/thành phố"
                                  loading={loadingProvinces}
                                  onChange={handleProvinceChange}
                                >
                                  {provinces.map((p) => (
                                    <Select.Option key={p.code} value={p.code}>
                                      {formatProvinceName(p)}
                                    </Select.Option>
                                  ))}
                                </Select>
                              </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                              <Form.Item
                                name="ward"
                                label="Phường/Xã"
                                rules={[{ required: true }]}
                              >
                                <Select
                                  placeholder="Chọn phường/xã"
                                  loading={loadingWards}
                                  disabled={!editMode || !selectedProvinceId}
                                >
                                  {wards.map((w) => (
                                    <Select.Option key={w.code} value={w.code}>
                                      {formatWardName(w)}
                                    </Select.Option>
                                  ))}
                                </Select>
                              </Form.Item>
                            </Col>
                            <Col xs={24}>
                              <Form.Item
                                name="detailedAddress"
                                label="Địa chỉ cụ thể"
                              >
                                <Input prefix={<HomeOutlined />} />
                              </Form.Item>
                            </Col>
                          </Row>

                          <Divider orientation="left">
                            Thông tin ngân hàng
                          </Divider>

                          <Row gutter={[16, 16]}>
                            <Col xs={24} md={12}>
                              <Form.Item
                                name={["bankInfo", "bankName"]}
                                label="Tên ngân hàng"
                                rules={[{ required: true }]}
                              >
                                <Input prefix={<BankOutlined />} />
                              </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                              <Form.Item
                                name={["bankInfo", "accountNumber"]}
                                label="Số tài khoản"
                                rules={[{ required: true }]}
                              >
                                <Input prefix={<CreditCardOutlined />} />
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
                        <KeyOutlined /> Bảo mật
                      </span>
                    ),
                    children: (
                      <Form
                        form={passwordForm}
                        layout="vertical"
                        onFinish={handleChangePassword}
                        className="tab-content"
                      >
                        <Title level={4}>Đổi mật khẩu</Title>
                        <Form.Item
                          name="currentPassword"
                          label="Mật khẩu hiện tại"
                          rules={[{ required: true }]}
                        >
                          <Input.Password />
                        </Form.Item>
                        <Form.Item
                          name="newPassword"
                          label="Mật khẩu mới"
                          rules={[{ required: true, min: 8 }]}
                        >
                          <Input.Password />
                        </Form.Item>
                        <Form.Item
                          name="confirmPassword"
                          label="Xác nhận mật khẩu mới"
                          dependencies={["newPassword"]}
                          rules={[
                            { required: true },
                            ({ getFieldValue }) => ({
                              validator(_, value) {
                                return !value ||
                                  getFieldValue("newPassword") === value
                                  ? Promise.resolve()
                                  : Promise.reject(
                                      new Error("Mật khẩu xác nhận không khớp!")
                                    );
                              },
                            }),
                          ]}
                        >
                          <Input.Password />
                        </Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                          Đổi mật khẩu
                        </Button>
                      </Form>
                    ),
                  },
                  {
                    key: "3",
                    label: (
                      <span>
                        <SettingOutlined /> Cài đặt
                      </span>
                    ),
                    children: (
                      <div className="tab-content settings-list">
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
                      </div>
                    ),
                  },
                ]}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Profile;
