import React, { useState, useEffect } from 'react';
import {
    Button,
    Form,
    Input,
    Checkbox,
    Typography,
    message,
    Row,
    Col,
    Select,
    Tabs
} from 'antd';
import {
    UserOutlined,
    LockOutlined,
    MailOutlined,
    PhoneOutlined,
    EyeInvisibleOutlined,
    EyeTwoTone,
    ArrowLeftOutlined,
    EnvironmentOutlined,
    HomeOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './Register.css';
import logoRemoveBG from '../../../assets/images/logo/logoRemoveBG.png';

const { Title, Text, Link } = Typography;
const { Option } = Select;

const Register = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [sendingCode, setSendingCode] = useState(false);
    
    // Address state
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [loadingProvinces, setLoadingProvinces] = useState(false);
    const [loadingDistricts, setLoadingDistricts] = useState(false);
    const [loadingWards, setLoadingWards] = useState(false);
    const [activeTab, setActiveTab] = useState('1');
    const [infoCompleted, setInfoCompleted] = useState(false);

    // Vietnam Province API functions
    const fetchProvinces = async () => {
        setLoadingProvinces(true);
        try {
            const response = await fetch('https://provinces.open-api.vn/api/p/');
            const data = await response.json();
            setProvinces(data);
        } catch (error) {
            console.error('Error fetching provinces:', error);
            message.error('Không thể tải danh sách tỉnh/thành phố');
        } finally {
            setLoadingProvinces(false);
        }
    };

    const fetchDistricts = async (provinceCode) => {
        setLoadingDistricts(true);
        try {
            const response = await fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`);
            const data = await response.json();
            setDistricts(data.districts || []);
            setWards([]); // Reset wards when province changes
            form.setFieldsValue({ district: undefined, ward: undefined });
        } catch (error) {
            console.error('Error fetching districts:', error);
            message.error('Không thể tải danh sách quận/huyện');
        } finally {
            setLoadingDistricts(false);
        }
    };

    const fetchWards = async (districtCode) => {
        setLoadingWards(true);
        try {
            const response = await fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
            const data = await response.json();
            setWards(data.wards || []);
            form.setFieldsValue({ ward: undefined });
        } catch (error) {
            console.error('Error fetching wards:', error);
            message.error('Không thể tải danh sách phường/xã');
        } finally {
            setLoadingWards(false);
        }
    };

    // Handle address changes
    const handleProvinceChange = (value) => {
        fetchDistricts(value);
    };

    const handleDistrictChange = (value) => {
        fetchWards(value);
    };

    // Load provinces on component mount
    useEffect(() => {
        fetchProvinces();
    }, []);

    // Validate information tab before allowing address tab
    const validateInfoTab = async () => {
        try {
            await form.validateFields(['fullName', 'email', 'phone', 'password', 'confirmPassword', 'verificationCode']);
            setInfoCompleted(true);
            setActiveTab('2');
        } catch (error) {
            message.error('Vui lòng hoàn thành tất cả thông tin cá nhân!');
        }
    };

    const handleTabChange = (key) => {
        if (key === '2' && !infoCompleted) {
            validateInfoTab();
        } else {
            setActiveTab(key);
        }
    };

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
                    <Tabs 
                        activeKey={activeTab} 
                        onChange={handleTabChange}
                        className="register-tabs"
                        items={[
                            {
                                key: '1',
                                label: 'Thông tin cá nhân',
                                children: (
                                    <div className="tab-content">
                                        <Row gutter={24}>
                                            {/* Left Column */}
                                            <Col span={12}>
                                                {/* Full Name */}
                                                <Form.Item
                                                    name="fullName"
                                                    label="Họ và tên"
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

                                                {/* Email */}
                                                <Form.Item
                                                    name="email"
                                                    label="Email"
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

                                                {/* Phone Number */}
                                                <Form.Item
                                                    name="phone"
                                                    label="Số điện thoại"
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
                                            </Col>

                                            {/* Right Column */}
                                            <Col span={12}>
                                                {/* Password */}
                                                <Form.Item
                                                    name="password"
                                                    label="Mật khẩu"
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
                                                    label="Xác nhận mật khẩu"
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

                                                {/* Verification Code */}
                                                <Row gutter={12}>
                                                    <Col span={15}>
                                                        <Form.Item
                                                            name="verificationCode"
                                                            label="Mã xác nhận"
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
                                                        <Form.Item label=" ">
                                                            <Button
                                                                onClick={handleSendCode}
                                                                loading={sendingCode}
                                                                className="send-code-btn"
                                                                block
                                                            >
                                                                Gửi mã
                                                            </Button>
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
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
                                )
                            },
                            {
                                key: '2',
                                label: 'Địa chỉ',
                                disabled: !infoCompleted,
                                children: (
                                    <div className="tab-content">
                                        <Row gutter={24}>
                                            {/* Left Column */}
                                            <Col span={12}>
                                                {/* Province */}
                                                <Form.Item
                                                    name="province"
                                                    label="Tỉnh/Thành phố"
                                                    rules={[
                                                        { required: true, message: 'Vui lòng chọn tỉnh/thành phố!' }
                                                    ]}
                                                >
                                                    <Select
                                                        placeholder="Chọn tỉnh/thành phố"
                                                        className="custom-select"
                                                        loading={loadingProvinces}
                                                        onChange={handleProvinceChange}
                                                        showSearch
                                                        filterOption={(input, option) =>
                                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                        }
                                                    >
                                                        {provinces.map((province) => (
                                                            <Option key={province.code} value={province.code}>
                                                                {province.name}
                                                            </Option>
                                                        ))}
                                                    </Select>
                                                </Form.Item>

                                                {/* District */}
                                                <Form.Item
                                                    name="district"
                                                    label="Quận/Huyện"
                                                    rules={[
                                                        { required: true, message: 'Vui lòng chọn quận/huyện!' }
                                                    ]}
                                                >
                                                    <Select
                                                        placeholder="Chọn quận/huyện"
                                                        className="custom-select"
                                                        loading={loadingDistricts}
                                                        onChange={handleDistrictChange}
                                                        disabled={districts.length === 0}
                                                        showSearch
                                                        filterOption={(input, option) =>
                                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                        }
                                                    >
                                                        {districts.map((district) => (
                                                            <Option key={district.code} value={district.code}>
                                                                {district.name}
                                                            </Option>
                                                        ))}
                                                    </Select>
                                                </Form.Item>
                                            </Col>

                                            {/* Right Column */}
                                            <Col span={12}>
                                                {/* Ward */}
                                                <Form.Item
                                                    name="ward"
                                                    label="Phường/Xã"
                                                    rules={[
                                                        { required: true, message: 'Vui lòng chọn phường/xã!' }
                                                    ]}
                                                >
                                                    <Select
                                                        placeholder="Chọn phường/xã"
                                                        className="custom-select"
                                                        loading={loadingWards}
                                                        disabled={wards.length === 0}
                                                        showSearch
                                                        filterOption={(input, option) =>
                                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                        }
                                                    >
                                                        {wards.map((ward) => (
                                                            <Option key={ward.code} value={ward.code}>
                                                                {ward.name}
                                                            </Option>
                                                        ))}
                                                    </Select>
                                                </Form.Item>

                                                {/* Detailed Address */}
                                                <Form.Item
                                                    name="detailedAddress"
                                                    label="Địa chỉ cụ thể"
                                                    rules={[
                                                        { required: true, message: 'Vui lòng nhập địa chỉ cụ thể!' }
                                                    ]}
                                                >
                                                    <Input
                                                        prefix={<HomeOutlined className="input-icon" />}
                                                        placeholder="Số nhà, tên đường..."
                                                        className="custom-input"
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        
                                        <div className="tab-footer">
                                            <Button 
                                                onClick={() => setActiveTab('1')}
                                                className="back-tab-btn"
                                            >
                                                ← Quay lại
                                            </Button>
                                            
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
                                                className="agreement-item"
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
                                            <Form.Item className="register-button-item">
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
                                        </div>
                                    </div>
                                )
                            }
                        ]}
                    />
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