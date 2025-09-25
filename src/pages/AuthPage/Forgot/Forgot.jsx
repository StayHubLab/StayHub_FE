import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  LockOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { Button, Checkbox, Col, Form, Input, Row, notification } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Forgot.css";
const Forgot = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [step, setStep] = useState(1); // 1: Enter email, 2: Verify and reset
  const [countdown, setCountdown] = useState(0);
  const [canResend, setCanResend] = useState(true);
  const navigate = useNavigate();

  const [api, contextHolder] = notification.useNotification();

  // Countdown effect for resend code
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const startCountdown = () => {
    setCountdown(30);
    setCanResend(false);
  };

  const handleSendCode = async () => {
    try {
      // Validate field email trước khi gọi API
      await form.validateFields(["email"]);
      setSendingCode(true);
      const email = form.getFieldValue("email");
      // Call API thực sự
      const res = await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        {
          email,
        }
      );
      // Nếu backend trả về success
      api.success({
        message: "Gửi mã thành công!",
        description: res.data?.message,
        placement: "topRight",
        duration: 4.5,
      });
      setStep(2);
      startCountdown();
    } catch (error) {
      console.error("Send code error:", error);
      api.error({
        message: "Lỗi gửi mã!",
        description: error.response?.data?.error,
        placement: "topRight",
      });
    } finally {
      setSendingCode(false);
    }
  };

  const handleResetPassword = async (values) => {
    setLoading(true);
    try {
      console.log("Reset password values:", values);
      const res = await axios.post(
        "http://localhost:5000/api/auth/reset-password",
        {
          email: values.email,
          code: values.code,
          newPassword: values.password,
        }
      );
      api.success({
        message: "Mật khẩu đã được thay đổi thành công!",
        description:
          res.data?.message || "Bạn có thể sử dụng mật khẩu mới để đăng nhập.",
        placement: "topRight",
        duration: 4.5,
      });
      navigate("/login");
    } catch (error) {
      console.error(
        "Reset password error:",
        error.response?.data || error.message
      );
      api.error({
        message: "Có lỗi xảy ra!",
        description:
          error.response?.data?.error ||
          "Không thể đặt lại mật khẩu. Vui lòng thử lại.",
        placement: "topRight",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <>
      {contextHolder}

      <div className="forgot-container">
        <div className="forgot-card">
          {/* Brand Title */}
          <div className="forgot-header">
            <h1 className="brand-title">
              <span className="stay-text">Stay</span>
              <span className="hub-text">Hub</span>
            </h1>
          </div>

          {/* Forgot Password Title Section */}
          <div className="forgot-title-section">
            <h2 className="forgot-title">Quên mật khẩu</h2>
            <span className="forgot-subtitle">
              Chúng tôi sẽ gửi mã xác nhận qua email bạn đã đăng kí
            </span>
          </div>

          {/* Forgot Password Form */}
          <Form
            form={form}
            name="forgot"
            onFinish={handleResetPassword}
            className="forgot-form"
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
                  message: "Email không hợp lệ!",
                },
              ]}
            >
              <Input
                prefix={<MailOutlined className="input-icon" />}
                placeholder="email@example.com"
                className="custom-input"
              />
            </Form.Item>

            {/* Verification Code Field */}
            {step === 2 && (
              <Row gutter={12}>
                <Col span={13}>
                  <Form.Item
                    name="verificationCode"
                    rules={[
                      { required: true, message: "Vui lòng nhập mã xác nhận!" },
                    ]}
                  >
                    <Input
                      placeholder="Nhập mã xác nhận"
                      className="custom-input verification-input"
                    />
                  </Form.Item>
                </Col>
                <Col span={11}>
                  <Button
                    onClick={handleSendCode}
                    loading={sendingCode}
                    // disabled={!canResend}
                    className="send-code-btn"
                    block
                  >
                    {!canResend ? `Gửi lại (${countdown}s)` : "Gửi lại"}
                  </Button>
                </Col>
              </Row>
            )}

            {/* Send Code Button for Step 1 */}
            {step === 1 && (
              <Form.Item>
                <Button
                  onClick={handleSendCode}
                  loading={sendingCode}
                  className="send-code-btn"
                  block
                >
                  Gửi mã
                </Button>
              </Form.Item>
            )}

            {/* New Password Fields - Only show in Step 2 */}
            {step === 2 && (
              <>
                {/* New Password Field */}
                <Form.Item
                  name="newPassword"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập mật khẩu mới!",
                    },
                    {
                      min: 8,
                      message: "Mật khẩu phải có ít nhất 8 ký tự!",
                    },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined className="input-icon" />}
                    placeholder="Ít nhất 8 ký tự"
                    className="custom-input"
                    iconRender={(visible) =>
                      visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                    }
                  />
                </Form.Item>

                {/* Confirm Password Field */}
                <Form.Item
                  name="confirmPassword"
                  dependencies={["newPassword"]}
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng xác nhận mật khẩu!",
                    },
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
                  <Input.Password
                    prefix={<LockOutlined className="input-icon" />}
                    placeholder="Xác nhận mật khẩu"
                    className="custom-input"
                    iconRender={(visible) =>
                      visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                    }
                  />
                </Form.Item>

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

                {/* Reset Password Button */}
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="reset-btn"
                    loading={loading}
                    block
                  >
                    Thay đổi mật khẩu
                  </Button>
                </Form.Item>
              </>
            )}

            {/* Login Link */}
            <div className="login-link-section">
              <span className="login-text">
                Bạn đã có tài khoản ?{" "}
                <Button
                  type="link"
                  onClick={handleLoginRedirect}
                  className="login-link-btn"
                >
                  Đăng Nhập
                </Button>
              </span>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Forgot;
