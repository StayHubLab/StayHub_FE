import React, { useState } from 'react';
import {
    Button,
    Form,
    Input,
    Checkbox,
    Typography,
    message,
    Row,
    Col
} from 'antd';
import {
    UserOutlined,
    LockOutlined,
    MailOutlined,
    PhoneOutlined,
    EyeInvisibleOutlined,
    EyeTwoTone,
    ArrowLeftOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './Register.css';
import logoRemoveBG from '../../../assets/images/logo/logoRemoveBG.png';

const { Title, Text, Link } = Typography;

const Register = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [sendingCode, setSendingCode] = useState(false);

    const handleRegister = async (values) => {
        setLoading(true);
        try {
            console.log('Registration values:', values);
            // TODO: Implement registration API call
            message.success('Đăng ký thành công!');
            handleVerifyRedirect();
        } catch (error) {
            message.error('Đăng ký thất bại. Vui lòng thử lại!');
        } finally {
            setLoading(false);
        }
    };

    const handleSendCode = async () => {
        setSendingCode(true);
        try {
            const phoneNumber = form.getFieldValue('phone');
            if (!phoneNumber) {
                message.error('Vui lòng nhập số điện thoại!');
                return;
            }
            console.log('Sending code to:', phoneNumber);
            // TODO: Implement send SMS code API call
            message.success('Mã xác nhận đã được gửi!');
        } catch (error) {
            message.error('Không thể gửi mã xác nhận!');
        } finally {
            setSendingCode(false);
        }
    };

    const handleLoginRedirect = () => {
        navigate('/login');
    };

    const handleVerifyRedirect = () => {
        navigate('/verify');
    };

    return (
        <div className="register-container">
            <div className="register-card">
                {/*Go back*/}
                {/* <ArrowLeftOutlined onClick={handleStartRedirect} /> */}
                {/* Header */}
                <div className="register-header">
                    <div className="logo-container">
                        <img
                            src={logoRemoveBG}
                            alt="StayHub Logo"
                            className="logo-image"
                        />
                    </div>

                    <div className="register-title-section">
                        <Title level={2} className="register-title">
                            Tạo tài khoản <span className="stay-text">Stay</span><span className="hub-text">Hub</span>
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
                    {/* Full Name */}
                    <Form.Item
                        name="fullName"
                        rules={[
                            { required: true, message: 'Vui lòng nhập họ tên!' },
                            { min: 2, message: 'Họ tên phải có ít nhất 2 ký tự!' }
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined className="input-icon" />}
                            placeholder="Nguyễn Văn A"
                            className="custom-input"
                        />
                    </Form.Item>

                    {/* Password */}
                    <Form.Item
                        name="password"
                        rules={[
                            { required: true, message: 'Vui lòng nhập mật khẩu!' },
                            { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự!' }
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined className="input-icon" />}
                            placeholder="Ít nhất 8 ký tự"
                            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                            className="custom-input"
                        />
                    </Form.Item>

                    {/* Confirm Password */}
                    <Form.Item
                        name="confirmPassword"
                        dependencies={['password']}
                        rules={[
                            { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined className="input-icon" />}
                            placeholder="Xác nhận mật khẩu"
                            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                            className="custom-input"
                        />
                    </Form.Item>

                    {/* Email */}
                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: 'Vui lòng nhập email!' },
                            { type: 'email', message: 'Email không hợp lệ!' }
                        ]}
                    >
                        <Input
                            prefix={<MailOutlined className="input-icon" />}
                            placeholder="email@example.com"
                            className="custom-input"
                        />
                    </Form.Item>

                    {/* Phone and Verification Code */}
                    <Row gutter={12}>
                        <Col span={15}>
                            <Form.Item
                                name="verificationCode"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập mã xác nhận!' }
                                ]}
                            >
                                <Input
                                    placeholder="Nhập mã xác nhận"
                                    className="custom-input verification-input"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={9}>
                            <Button
                                onClick={handleSendCode}
                                loading={sendingCode}
                                className="send-code-btn"
                                block
                            >
                                Gửi mã
                            </Button>
                        </Col>
                    </Row>

                    {/* Phone Number */}
                    <Form.Item
                        name="phone"
                        rules={[
                            { required: true, message: 'Vui lòng nhập số điện thoại!' },
                            { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ!' }
                        ]}
                    >
                        <Input
                            prefix={<PhoneOutlined className="input-icon" />}
                            placeholder="09XX XXX XXX"
                            className="custom-input"
                        />
                    </Form.Item>

                    {/* Terms and Conditions */}
                    <Form.Item
                        name="agreement"
                        valuePropName="checked"
                        rules={[
                            {
                                validator: (_, value) =>
                                    value ? Promise.resolve() : Promise.reject(new Error('Vui lòng đồng ý với điều khoản!')),
                            },
                        ]}
                    >
                        <Checkbox className="agreement-checkbox">
                            <Text className="agreement-text">
                                Tôi đồng ý với{' '}
                                <Link href="/terms" className="terms-link">
                                    Điều khoản sử dụng
                                </Link>
                                {' '}và{' '}
                                <Link href="/privacy" className="privacy-link">
                                    Chính sách bảo mật
                                </Link>
                                {' '}của StayHub
                            </Text>
                        </Checkbox>
                    </Form.Item>

                    {/* Register Button */}
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            className="register-btn"
                            block
                        >
                            Đăng Ký
                        </Button>
                    </Form.Item>
                </Form>

                {/* Login Link */}
                <div className="login-link-section">
                    <Text className="login-text">
                        Bạn đã có tài khoản?{' '}
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
    );
};

export default Register;