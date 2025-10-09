import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  LockOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Checkbox, Form, Input, notification, Divider } from "antd";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import useGoogleAuth from "../../../hooks/useGoogleAuth";
import logoRemoveBG from "../../../assets/images/logo/logoRemoveBG.png";
import "./Login.css";
const Login = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();
  const { login, googleLogin } = useAuth();

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      // Use AuthContext login method
      const result = await login({
        email: values.email,
        password: values.password,
      });

      if (result.success) {
        const { user } = result.data;
        api.success({
          message: "Đăng nhập thành công!",
          description: `Chào mừng ${
            user?.fullName || user?.email || "bạn"
          } đến với StayHub!`,
          placement: "topRight",
          duration: 2,
        });

        // Wait 2 seconds before navigating
        setTimeout(() => {
          // Navigate based on user role
          if (user?.role === "landlord") {
            navigate("/landlord/dashboard");
          } else {
            navigate("/main/home");
          }
        }, 2000);
      } else {
        // Handle login failure with specific error messages
        let description = "Email hoặc mật khẩu không đúng!";
        
        const errorMsg = (result.error || "").toLowerCase();
        const statusCode = result.statusCode;
        
        // Determine specific error based on status code and message
        if (statusCode === 500 || errorMsg.includes("internal server error")) {
          // Internal server error - likely wrong credentials but server didn't return specific error
          description = "Email hoặc mật khẩu không đúng!";
        } else if (statusCode === 401) {
          // Unauthorized - typically wrong password
          description = "Mật khẩu không chính xác!";
        } else if (statusCode === 404) {
          // Not found - user doesn't exist
          description = "Tài khoản không tồn tại!";
        } else if (errorMsg.includes("password") || errorMsg.includes("mật khẩu") || errorMsg.includes("incorrect")) {
          description = "Mật khẩu không chính xác!";
        } else if (errorMsg.includes("not found") || errorMsg.includes("không tồn tại") || errorMsg.includes("does not exist") || errorMsg.includes("user")) {
          description = "Tài khoản không tồn tại!";
        } else if (errorMsg.includes("invalid credentials") || errorMsg.includes("sai thông tin")) {
          description = "Email hoặc mật khẩu không đúng!";
        } else if (errorMsg && errorMsg !== "login failed" && errorMsg !== "internal server error") {
          // If there's a specific error message, use it (but not generic ones)
          description = result.error;
        }
        
        api.error({
          message: "Đăng nhập thất bại!",
          description: description,
          placement: "topRight",
          duration: 4.5,
        });
      }
    } catch (error) {
      // This catch block handles unexpected errors
      let description = "Email hoặc mật khẩu không đúng!";
      
      // Try to get more specific error from response
      const errorMsg = (error?.response?.data?.error || error?.response?.data?.message || error?.message || "").toLowerCase();
      const statusCode = error?.response?.status;
      
      if (statusCode === 401) {
        // Unauthorized - wrong credentials
        description = "Email hoặc mật khẩu không đúng!";
      } else if (statusCode === 404) {
        // Not found - user doesn't exist
        description = "Tài khoản không tồn tại!";
      } else if (errorMsg.includes("password") || errorMsg.includes("mật khẩu") || errorMsg.includes("incorrect")) {
        description = "Mật khẩu không chính xác!";
      } else if (errorMsg.includes("not found") || errorMsg.includes("không tồn tại") || errorMsg.includes("does not exist")) {
        description = "Tài khoản không tồn tại!";
      } else if (errorMsg && errorMsg !== "login failed") {
        description = error?.response?.data?.error || error?.response?.data?.message || error?.message;
      }
      
      api.error({
        message: "Lỗi đăng nhập!",
        description: description,
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

  // Google login handlers
  const handleGoogleSuccess = async (googleData) => {
    setLoading(true);
    try {

      const result = await googleLogin(googleData);

      if (result.success) {
        const { user } = result.data;
        api.success({
          message: "Đăng nhập Google thành công!",
          description: `Chào mừng ${
            user?.fullName || user?.name || user?.email || "bạn"
          } đến với StayHub!`,
          placement: "topRight",
          duration: 2,
        });

        // Wait 2 seconds before navigating
        setTimeout(() => {
          // Navigate based on user role
          if (user?.role === "landlord") {
            navigate("/landlord/dashboard");
          } else {
            navigate("/main/home");
          }
        }, 2000);
      } else {
        api.error({
          message: "Đăng nhập Google thất bại!",
          description: result.error || "Vui lòng thử lại sau.",
          placement: "topRight",
          duration: 4.5,
        });
      }
    } catch (error) {
      api.error({
        message: "Lỗi không mong muốn!",
        description:
          "Đã có lỗi xảy ra khi đăng nhập Google. Vui lòng thử lại sau.",
        placement: "topRight",
        duration: 4.5,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = (error) => {
    api.error({
      message: "Lỗi xác thực Google!",
      description: "Không thể đăng nhập bằng Google. Vui lòng thử lại.",
      placement: "topRight",
      duration: 4.5,
    });
    setLoading(false);
  };

  // Initialize Google Auth
  const googleButtonRef = useGoogleAuth(handleGoogleSuccess, handleGoogleError);

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
                <Link className="terms-link">
                  Điều khoản sử dụng
                </Link>{" "}
                và{" "}
                <Link className="privacy-link">
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
          <Divider>Hoặc đăng nhập với</Divider>

          {/* Google Login Button */}
          <div className="social-login-section">
            <div
              ref={googleButtonRef}
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            />
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
