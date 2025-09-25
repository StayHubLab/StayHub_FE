import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  LockOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Checkbox, Form, Input, notification } from "antd";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import logoRemoveBG from "../../../assets/images/logo/logoRemoveBG.png";
import "./Login.css";
const Login = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      console.log("Login values:", values);

      // Use AuthContext login method
      const result = await login({
        email: values.email,
        password: values.password,
      });

      if (result.success) {
        const { user } = result.data;
        api.success({
          message: "Đăng nhập thành công!",
          description: `Chào mừng ${user?.fullName || user?.email || "bạn"} đến với StayHub!`,
          placement: "topRight",
          duration: 4.5,
        });

        // Navigate to home or dashboard
        navigate("/");
      } else {
        // Handle login failure
        api.error({
          message: "Đăng nhập thất bại!",
          description:
            result.error || "Vui lòng kiểm tra lại thông tin đăng nhập.",
          placement: "topRight",
          duration: 4.5,
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      api.error({
        message: "Lỗi không mong muốn!",
        description: "Đã có lỗi xảy ra. Vui lòng thử lại sau.",
        placement: "topRight",
        duration: 4.5,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot");
  };

  return (
    <div className="login-container">
      {contextHolder}
      <div className="login-card">
        {/* Brand Title */}
        <div className="login-header">
          <div className="logo-container">
            <img src={logoRemoveBG} alt="StayHub Logo" className="logo-image" />
          </div>
        </div>

        {/* Login Title Section */}
        <div className="login-title-section">
          <h2 className="login-title">Đăng Nhập</h2>
          <span className="login-subtitle">
            Tham gia cộng đồng thông minh của chúng tôi ngay hôm nay.
          </span>
        </div>

        {/* Login Form */}
        <Form
          form={form}
          name="login"
          onFinish={handleLogin}
          className="login-form"
          size="large"
        >
          {/* Email Field */}
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập email!",
              },
              {
                type: "email",
                message: "Vui lòng nhập đúng định dạng email!",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="input-icon" />}
              placeholder="Email"
              className="custom-input"
            />
          </Form.Item>

          {/* Password Field */}
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mật khẩu!",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="input-icon" />}
              placeholder="Mật khẩu"
              className="custom-input"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          {/* Forgot Password Link */}
          <div className="forgot-password-section">
            <Button
              type="link"
              onClick={handleForgotPassword}
              className="login-link-btn"
            >
              Quên mật khẩu ?
            </Button>
          </div>

          {/* Terms Agreement Checkbox */}
          <Form.Item
            name="agreement"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error("Vui lòng đồng ý với các điều khoản!")
                      ),
              },
            ]}
            className="agreement-checkbox"
          >
            <Checkbox>
              <span className="agreement-text">
                Tôi đồng ý với{" "}
                <Link to="/terms" className="terms-link">
                  Điều khoản sử dụng
                </Link>{" "}
                và{" "}
                <Link to="/privacy" className="privacy-link">
                  Chính sách bảo mật
                </Link>{" "}
                của StayHub
              </span>
            </Checkbox>
          </Form.Item>

          {/* Login Button */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-btn"
              loading={loading}
              block
            >
              Đăng Nhập
            </Button>
          </Form.Item>

          {/* Social Login Divider */}
          <div className="social-divider">
            <span className="divider-text">Hoặc đăng nhập với</span>
          </div>

          {/* Google Login Button */}
          <div className="social-login-section">
            <Button
              className="google-login-btn"
              block
              icon={
                <img
                  src="https://developers.google.com/identity/images/g-logo.png"
                  alt="Google"
                  style={{ width: "18px", height: "18px" }}
                />
              }
            >
              Đăng nhập với Google
            </Button>
          </div>

          {/* Register Link */}
          <div className="register-link-section">
            <span className="register-text">
              Bạn chưa có tài khoản ?{" "}
              <Link to="/start" className="register-link">
                Đăng Kí
              </Link>
            </span>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;
