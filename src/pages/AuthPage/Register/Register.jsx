import React, { useState, useEffect } from "react";
import {
  Button,
  Form,
  Input,
  Checkbox,
  Typography,
  notification,
  Row,
  Col,
  Select,
  Tabs,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  HomeOutlined,
} from "@ant-design/icons";
import authApi from "../../../services/api/authApi.js";
import { useNavigate, useLocation } from "react-router-dom";
import logoRemoveBG from "../../../assets/images/logo/logoRemoveBG.png";
import "./Register.css";
import {
  fetchProvinces,
  fetchWards,
  formatProvinceName,
  formatWardName,
} from "../../../services/api/vietnamProvinceApi";

const { Title, Text, Link } = Typography;
const { Option } = Select;

const Register = () => {
  const [api, contextHolder] = notification.useNotification();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();

  // submit/loading
  const [loading, setLoading] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [selectedRole, setSelectedRole] = useState("tenant");

  // Tabs & validation gate
  const [activeTab, setActiveTab] = useState("1");
  const [infoCompleted, setInfoCompleted] = useState(false);

  // Address state (VN admin update: Province + Ward only)
  const [provinces, setProvinces] = useState([]);
  const [wards, setWards] = useState([]);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);
  const [selectedProvinceId, setSelectedProvinceId] = useState(null);

  // --- Loaders ---
  const loadProvinces = async () => {
    setLoadingProvinces(true);
    try {
      const data = await fetchProvinces();
      setProvinces(data || []);
    } catch (error) {
      const status = error?.response?.status;
      const backendMessage =
        error?.response?.data?.error || error?.response?.data?.message || "";
      const msg = String(backendMessage).toLowerCase();
      if (
        status === 409 ||
        msg.includes("already exists") ||
        msg.includes("already registered") ||
        msg.includes("email exists") ||
        msg.includes("duplicate") ||
        msg.includes("đã được đăng") ||
        msg.includes("da duoc dang")
      ) {
        api.error({
          message: "Lỗi",
          description: "Email này đã được đăng ký",
        });
        return;
      }
      api.error({
        message: "Lỗi",
        description:
          error?.message || "Không tải được danh sách tỉnh/thành phố",
      });
    } finally {
      setLoadingProvinces(false);
    }
  };

  const loadWards = async (provinceCode) => {
    setLoadingWards(true);
    try {
      const data = await fetchWards(provinceCode);
      setWards(data || []);
      // Reset ward when province changes
      form.setFieldsValue({ ward: undefined });
    } catch (error) {
      const status = error?.response?.status;
      const backendMessage =
        error?.response?.data?.error || error?.response?.data?.message || "";
      const msg = String(backendMessage).toLowerCase();
      if (
        status === 409 ||
        msg.includes("already exists") ||
        msg.includes("already registered") ||
        msg.includes("email exists") ||
        msg.includes("duplicate") ||
        msg.includes("đã được đăng") ||
        msg.includes("da duoc dang")
      ) {
        api.error({
          message: "L��-i",
          description: "Email nA�y �`A� �`�����c �?��ng kA�",
        });
        return;
      }
      api.error({
        message: "Lỗi",
        description: error?.message || "Không tải được danh sách phường/xã",
      });
    } finally {
      setLoadingWards(false);
    }
  };

  useEffect(() => {
    loadProvinces();
  }, []);

  // Countdown timer for resend code
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Read role from query string (?role=landlord|tenant)
  useEffect(() => {
    try {
      const params = new URLSearchParams(location.search);
      const roleParam = params.get("role");
      if (roleParam === "landlord" || roleParam === "tenant") {
        setSelectedRole(roleParam);
      }
    } catch (_) {
      // ignore
    }
  }, [location.search]);

  // --- Handlers ---
  const handleProvinceChange = (value) => {
    setSelectedProvinceId(value);
    setWards([]);
    loadWards(value);
  };

  const validateInfoTab = async () => {
    try {
      await form.validateFields([
        "fullName",
        "email",
        "phone",
        "password",
        "confirmPassword",
        "verificationCode",
        "agreement",
      ]);
      setInfoCompleted(true);
      setActiveTab("2");
    } catch (_) {
      api.error({
        message: "Lỗi",
        description: "Vui lòng hoàn thành tất cả thông tin cá nhân!",
      });
    }
  };

  const handleTabChange = (key) => {
    if (key === "2" && !infoCompleted) {
      validateInfoTab();
    } else {
      setActiveTab(key);
    }
  };

  const handleRegister = async (values) => {
    setLoading(true);
    try {
      // Create address payload with both codes & display names
      const provinceObj = provinces.find((p) => p.code === values.province);
      const wardObj = wards.find((w) => w.code === values.ward);

      const address = {
        provinceCode: values.province || null,
        provinceName: provinceObj ? formatProvinceName(provinceObj) : null,
        wardCode: values.ward || null,
        wardName: wardObj ? formatWardName(wardObj) : null,
        street: values.detailedAddress || "",
        // Required fields for backend
        ward: wardObj ? formatWardName(wardObj) : "",
        district: provinceObj ? formatProvinceName(provinceObj) : "",
        city: provinceObj ? formatProvinceName(provinceObj) : "",
      };

      const payload = {
        email: values.email,
        password: values.password,
        phone: values.phone,
        name: values.fullName,
        address,
        role: selectedRole,
        verificationCode: values.verificationCode,
      };

      // Debug

      const response = await authApi.register(payload);

      if (response?.data) {
        api.success({
          message: "Thành công",
          description: "Đăng ký thành công!",
        });

        // Redirect based on role
        if (selectedRole === "landlord") {
          navigate("/create-building");
        } else {
          navigate("/verify");
        }
      } else {
        api.success({
          message: "Thành công",
          description: "Đăng ký thành công!",
        });

        // Redirect based on role
        if (selectedRole === "landlord") {
          navigate("/create-building");
        } else {
          navigate("/verify");
        }
      }
    } catch (error) {
      api.error({
        message: "Lỗi",
        description:
          error?.response?.data?.error || "Đăng ký thất bại. Vui lòng thử lại!",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendCode = async () => {
    setSendingCode(true);
    try {
      const email = form.getFieldValue("email");
      if (!email) {
        api.error({
          message: "Lỗi",
          description: "Vui lòng nhập email!",
        });
        return;
      }
      await authApi.sendVerificationCode(email);
      api.success({
        message: "Thành công",
        description: "Mã xác nhận đã được gửi tới email của bạn!",
      });
      // Start 30 second countdown
      setCountdown(30);
    } catch (error) {
      // Check if error is due to existing user
      const errorMessage = error?.response?.data?.error || error?.response?.data?.message || "";
      const statusCode = error?.response?.status;
      
      // If status is 500 and error is "Internal server error", it's likely a duplicate email
      if (statusCode === 500 || 
          errorMessage.toLowerCase().includes("already exists") || 
          errorMessage.toLowerCase().includes("đã tồn tại") ||
          errorMessage.toLowerCase().includes("internal server error")) {
        api.error({
          message: "Lỗi",
          description: "Tài khoản này đã đăng ký, hãy thử lại",
        });
      } else {
        api.error({
          message: "Lỗi",
          description: errorMessage || "Không thể gửi mã xác nhận!",
        });
      }
    } finally {
      setSendingCode(false);
    }
  };

  const handleLoginRedirect = () => navigate("/login");
  const handleVerifyRedirect = () => navigate("/verify");

  return (
    <>
      {contextHolder}
      <div className="register-container">
        <div className="register-card">
        {/* Header */}
        <div className="register-header">
          <div className="logo-container">
            <img src={logoRemoveBG} alt="StayHub Logo" className="logo-image" />
          </div>

          <div className="register-title-section">
            <Title level={2} className="register-title">
              Tạo tài khoản <span className="stay-text">Stay</span>
              <span className="hub-text">Hub</span>
            </Title>
            <Text className="register-subtitle">
              Tham gia cộng đồng thông minh của chúng tôi ngay hôm nay.
            </Text>
          </div>
        </div>

        {/* Registration Form */}
        <Form
          form={form}
          name="register"
          onFinish={handleRegister}
          layout="vertical"
          size="large"
          className="register-form"
        >
          <Tabs
            activeKey={activeTab}
            onChange={handleTabChange}
            className="register-tabs"
            items={[
              {
                key: "1",
                label: "Thông tin cá nhân",
                children: (
                  <div className="tab-content">
                    <Row gutter={24}>
                      {/* Left */}
                      <Col xs={24} md={12}>
                        {/* Full Name */}
                        <Form.Item
                          name="fullName"
                          label="Họ và tên"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập họ tên!",
                            },
                            {
                              min: 2,
                              message: "Họ tên phải có ít nhất 2 ký tự!",
                            },
                          ]}
                        >
                          <Input
                            prefix={<UserOutlined className="input-icon" />}
                            placeholder="Nguyễn Văn A"
                            className="custom-input"
                          />
                        </Form.Item>

                        {/* Email */}
                        <Form.Item
                          name="email"
                          label="Email"
                          rules={[
                            { required: true, message: "Vui lòng nhập email!" },
                            { type: "email", message: "Email không hợp lệ!" },
                          ]}
                        >
                          <Input
                            prefix={<MailOutlined className="input-icon" />}
                            placeholder="email@example.com"
                            className="custom-input"
                          />
                        </Form.Item>

                        {/* Phone */}
                        <Form.Item
                          name="phone"
                          label="Số điện thoại"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập số điện thoại!",
                            },
                            {
                              pattern: /^[0-9]{10,11}$/,
                              message: "Số điện thoại không hợp lệ!",
                            },
                          ]}
                        >
                          <Input
                            prefix={<PhoneOutlined className="input-icon" />}
                            placeholder="09XX XXX XXX"
                            className="custom-input"
                          />
                        </Form.Item>
                      </Col>

                      {/* Right */}
                      <Col xs={24} md={12}>
                        {/* Password */}
                        <Form.Item
                          name="password"
                          label="Mật khẩu"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập mật khẩu!",
                            },
                            {
                              min: 8,
                              message: "Mật khẩu phải có ít nhất 8 ký tự!",
                            },
                            {
                              validator(_, value) {
                                if (!value) {
                                  return Promise.resolve();
                                }
                                
                                const hasUpperCase = /[A-Z]/.test(value);
                                const hasLowerCase = /[a-z]/.test(value);
                                const hasNumber = /[0-9]/.test(value);
                                const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
                                
                                if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
                                  return Promise.reject(
                                    new Error(
                                      "Mật khẩu phải chứa chữ hoa, chữ thường, số và ký tự đặc biệt!"
                                    )
                                  );
                                }
                                
                                return Promise.resolve();
                              },
                            },
                          ]}
                        >
                          <Input.Password
                            prefix={<LockOutlined className="input-icon" />}
                            placeholder="Ít nhất 8 ký tự"
                            iconRender={(visible) =>
                              visible ? (
                                <EyeTwoTone />
                              ) : (
                                <EyeInvisibleOutlined />
                              )
                            }
                            className="custom-input"
                          />
                        </Form.Item>

                        {/* Confirm Password */}
                        <Form.Item
                          name="confirmPassword"
                          label="Xác nhận mật khẩu"
                          dependencies={["password"]}
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng xác nhận mật khẩu!",
                            },
                            ({ getFieldValue }) => ({
                              validator(_, value) {
                                if (
                                  !value ||
                                  getFieldValue("password") === value
                                )
                                  return Promise.resolve();
                                return Promise.reject(
                                  new Error("Mật khẩu xác nhận không khớp!")
                                );
                              },
                            }),
                          ]}
                        >
                          <Input.Password
                            prefix={<LockOutlined className="input-icon" />}
                            placeholder="Xác nhận mật khẩu"
                            iconRender={(visible) =>
                              visible ? (
                                <EyeTwoTone />
                              ) : (
                                <EyeInvisibleOutlined />
                              )
                            }
                            className="custom-input"
                          />
                        </Form.Item>

                        {/* Verification Code */}
                        <Row gutter={12}>
                          <Col span={15}>
                            <Form.Item
                              name="verificationCode"
                              label="Mã xác nhận"
                              rules={[
                                {
                                  required: true,
                                  message: "Vui lòng nhập mã xác nhận!",
                                },
                              ]}
                            >
                              <Input
                                placeholder="Nhập mã xác nhận"
                                className="custom-input verification-input"
                              />
                            </Form.Item>
                          </Col>
                          <Col span={9}>
                            <Form.Item label=" ">
                              <Button
                                onClick={handleSendCode}
                                loading={sendingCode}
                                disabled={countdown > 0}
                                className="regissend-code-btn"
                                block
                              >
                                {countdown > 0 ? `${countdown}s` : "Gửi mã"}
                              </Button>
                            </Form.Item>
                          </Col>
                        </Row>

                        {/* Terms */}
                        <Form.Item
                          name="agreement"
                          valuePropName="checked"
                          className="agreement-item"
                          rules={[
                            {
                              validator: (_, value) =>
                                value
                                  ? Promise.resolve()
                                  : Promise.reject(
                                      new Error(
                                        "Vui lòng đồng ý với điều khoản!"
                                      )
                                    ),
                            },
                          ]}
                        >
                          <Checkbox className="agreement-checkbox">
                            <Text className="agreement-text">
                              Tôi đồng ý với{" "}
                              <Link className="terms-link">
                                Điều khoản sử dụng
                              </Link>{" "}
                              và{" "}
                              <Link className="privacy-link">
                                Chính sách bảo mật
                              </Link>{" "}
                              của StayHub
                            </Text>
                          </Checkbox>
                        </Form.Item>
                      </Col>
                    </Row>

                    <div className="tab-footer">
                      <Button
                        type="primary"
                        onClick={validateInfoTab}
                        className="next-tab-btn"
                      >
                        Tiếp tục → Địa chỉ
                      </Button>
                    </div>
                  </div>
                ),
              },
              {
                key: "2",
                label: "Địa chỉ",
                disabled: !infoCompleted,
                children: (
                  <div className="tab-content">
                    <Row gutter={24}>
                      {/* Left */}
                      <Col xs={24} md={12}>
                        {/* Province */}
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
                            className="custom-select"
                            loading={loadingProvinces}
                            onChange={handleProvinceChange}
                            showSearch
                            filterOption={(input, option) =>
                              option?.children
                                ?.toLowerCase()
                                ?.indexOf(input.toLowerCase()) >= 0
                            }
                          >
                            {provinces.map((province) => (
                              <Option key={province.code} value={province.code}>
                                {formatProvinceName(province)}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>

                        {/* Ward */}
                        <Form.Item
                          name="ward"
                          label="Phường/Xã"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng chọn phường/xã!",
                            },
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
                            className="custom-select"
                            loading={loadingWards}
                            disabled={!selectedProvinceId || loadingWards}
                            showSearch
                            filterOption={(input, option) =>
                              option?.children
                                ?.toLowerCase()
                                ?.indexOf(input.toLowerCase()) >= 0
                            }
                          >
                            {wards.map((ward) => (
                              <Option key={ward.code} value={ward.code}>
                                {formatWardName(ward)}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>

                      {/* Right */}
                      <Col xs={24} md={12}>
                        {/* Detailed Address */}
                        <Form.Item
                          name="detailedAddress"
                          label="Địa chỉ cụ thể"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập địa chỉ cụ thể!",
                            },
                          ]}
                        >
                          <Input
                            prefix={<HomeOutlined className="input-icon" />}
                            placeholder="Số nhà, tên đường, khu vực..."
                            className="custom-input"
                          />
                        </Form.Item>

                        {/* Note */}
                        <div className="address-note">
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            💡 Lưu ý: Theo cải cách hành chính mới, hệ thống chỉ
                            sử dụng Tỉnh/Thành phố và Phường/Xã.
                          </Text>
                        </div>
                      </Col>
                    </Row>

                    <div className="tab-footer">
                      <Button
                        onClick={() => setActiveTab("1")}
                        className="back-tab-btn"
                      >
                        ← Quay lại
                      </Button>

                      <Form.Item className="register-button-item">
                        <Button
                          type="primary"
                          htmlType="submit"
                          loading={loading}
                          className="register-btn"
                        >
                          Đăng Ký
                        </Button>
                      </Form.Item>
                    </div>
                  </div>
                ),
              },
            ]}
          />
        </Form>

        {/* Login Link */}
        <div className="login-link-section">
          <Text className="login-text">
            Bạn đã có tài khoản?{" "}
            <Button
              type="link"
              onClick={handleLoginRedirect}
              className="login-link-btn"
            >
              Đăng nhập
            </Button>
          </Text>
        </div>
      </div>
    </div>
    </>
  );
};

export default Register;
