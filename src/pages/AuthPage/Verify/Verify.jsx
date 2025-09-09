import React, { useState } from 'react';
import { Button, Upload, message, Row, Col, Typography } from 'antd';
import {
    UploadOutlined,
    CameraOutlined,
    SafetyCertificateOutlined,
    CrownOutlined,
    SafetyOutlined,
    SafetyCertificateFilled,
    InfoCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './Verify.css';

const { Title, Text } = Typography;
const { Dragger } = Upload;

const Verify = () => {
    const [loading, setLoading] = useState(false);
    const [frontIdFile, setFrontIdFile] = useState(null);
    const [backIdFile, setBackIdFile] = useState(null);
    const [selfieFile, setSelfieFile] = useState(null);
    const navigate = useNavigate();

    // Upload configuration
    const uploadProps = {
        name: 'file',
        multiple: false,
        accept: 'image/*',
        beforeUpload: () => false, // Prevent auto upload
        showUploadList: false,
    };

    const handleFrontIdUpload = (info) => {
        const file = info.file;
        if (file) {
            setFrontIdFile(file);
            message.success(`${file.name} đã được chọn`);
        }
    };

    const handleBackIdUpload = (info) => {
        const file = info.file;
        if (file) {
            setBackIdFile(file);
            message.success(`${file.name} đã được chọn`);
        }
    };

    const handleSelfieUpload = (info) => {
        const file = info.file;
        if (file) {
            setSelfieFile(file);
            message.success(`${file.name} đã được chọn`);
        }
    };

    const handleCameraCapture = () => {
        // TODO: Implement camera capture functionality
        message.info('Chức năng chụp ảnh sẽ được triển khai');
    };

    const handleSubmitVerification = async () => {
        if (!frontIdFile || !backIdFile || !selfieFile) {
            message.error('Vui lòng tải lên đủ 3 ảnh để xác thực!');
            return;
        }

        setLoading(true);
        try {
            // TODO: Implement verification API call
            console.log('Submitting verification:', {
                frontId: frontIdFile,
                backId: backIdFile,
                selfie: selfieFile
            });

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            message.success('Gửi xác thực thành công! Chúng tôi sẽ xem xét trong vòng 24h.');
            navigate('/login');
        } catch (error) {
            message.error('Có lỗi xảy ra khi gửi xác thực!');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyLater = () => {
        navigate('/login');
    };

    return (
        <div className="verify-container">
            <div className="verify-content">
                {/* Main Card */}
                <div className="verify-card">
                    {/* Header */}
                    <div className="verify-header">
                        <Title level={2} className="verify-title">
                            Xác thực thông tin tài khoản
                        </Title>
                        <Text className="verify-subtitle">
                            Vui lòng cung cấp thông tin CMND/CCCD để xác thực tài khoản, tăng độ tin cậy và mở khóa các tính năng nâng cao.
                        </Text>
                    </div>

                    <Row gutter={[32, 0]}>
                        {/* Left Column - Upload Steps */}
                        <Col xs={24} lg={14}>
                            <div className="upload-steps">
                                {/* Step 1: Front ID */}
                                <div className="upload-step">
                                    <div className="step-header">
                                        <span className="step-number">1</span>
                                        <Title level={4} className="step-title">
                                            Tải lên mặt trước CMND/CCCD
                                        </Title>
                                    </div>
                                    <Dragger
                                        {...uploadProps}
                                        onChange={handleFrontIdUpload}
                                        className="upload-dragger"
                                    >
                                        <div className="upload-icon">
                                            <UploadOutlined />
                                        </div>
                                        <p className="upload-text">
                                            Kéo thả ảnh hoặc click để tải lên
                                        </p>
                                        <Button type="primary" className="upload-btn">
                                            Chọn file
                                        </Button>
                                    </Dragger>
                                    <Text className="upload-note">
                                        Đảm bảo ảnh rõ nét, không bị chói, mất góc.
                                    </Text>
                                </div>

                                {/* Step 2: Back ID */}
                                <div className="upload-step">
                                    <div className="step-header">
                                        <span className="step-number">2</span>
                                        <Title level={4} className="step-title">
                                            Tải lên mặt sau CMND/CCCD
                                        </Title>
                                    </div>
                                    <Dragger
                                        {...uploadProps}
                                        onChange={handleBackIdUpload}
                                        className="upload-dragger"
                                    >
                                        <div className="upload-icon">
                                            <UploadOutlined />
                                        </div>
                                        <p className="upload-text">
                                            Kéo thả ảnh hoặc click để tải lên
                                        </p>
                                        <Button type="primary" className="upload-btn">
                                            Chọn file
                                        </Button>
                                    </Dragger>
                                    <Text className="upload-note">
                                        Đảm bảo ảnh rõ nét, không bị chói, mất góc.
                                    </Text>
                                </div>

                                {/* Step 3: Selfie */}
                                <div className="upload-step">
                                    <div className="step-header">
                                        <span className="step-number">3</span>
                                        <Title level={4} className="step-title">
                                            Chụp ảnh chân dung (Selfie)
                                        </Title>
                                    </div>
                                    <Dragger
                                        {...uploadProps}
                                        onChange={handleSelfieUpload}
                                        className="upload-dragger selfie-dragger"
                                    >
                                        <div className="upload-icon">
                                            <CameraOutlined />
                                        </div>
                                        <p className="upload-text">
                                            Hãy chụp ảnh selfie rõ mặt, không đội mũ, không đeo kính. Đảm bảo ánh sáng tốt.
                                        </p>
                                        <div className="selfie-buttons">
                                            <Button
                                                type="primary"
                                                icon={<CameraOutlined />}
                                                onClick={handleCameraCapture}
                                                className="camera-btn"
                                            >
                                                Mở camera
                                            </Button>
                                            <Button
                                                type="default"
                                                icon={<UploadOutlined />}
                                                className="upload-file-btn"
                                            >
                                                Tải lên ảnh
                                            </Button>
                                        </div>
                                    </Dragger>
                                </div>
                            </div>
                        </Col>

                        {/* Right Column - Benefits */}
                        <Col xs={24} lg={10}>
                            <div className="benefits-card">
                                <Title level={3} className="benefits-title">
                                    Lợi ích của xác thực
                                </Title>

                                <div className="benefits-list">
                                    <div className="benefit-item">
                                        <div className="benefit-icon trust">
                                            <SafetyCertificateFilled />
                                        </div>
                                        <div className="benefit-content">
                                            <Title level={5} className="benefit-title">
                                                Tăng độ tin cậy
                                            </Title>
                                            <Text className="benefit-description">
                                                Tăng độ tin cậy khi thuê/cho thuê
                                            </Text>
                                        </div>
                                    </div>

                                    <div className="benefit-item">
                                        <div className="benefit-icon premium">
                                            <CrownOutlined />
                                        </div>
                                        <div className="benefit-content">
                                            <Title level={5} className="benefit-title">
                                                Tính năng nâng cao
                                            </Title>
                                            <Text className="benefit-description">
                                                Mở khóa đặt cọc trực tuyến, quản lý hợp đồng
                                            </Text>
                                        </div>
                                    </div>

                                    <div className="benefit-item">
                                        <div className="benefit-icon security">
                                            <SafetyOutlined />
                                        </div>
                                        <div className="benefit-content">
                                            <Title level={5} className="benefit-title">
                                                Bảo vệ an toàn
                                            </Title>
                                            <Text className="benefit-description">
                                                Bảo vệ bạn khỏi lừa đảo
                                            </Text>
                                        </div>
                                    </div>
                                </div>

                                {/* Security Notice */}
                                <div className="security-notice">
                                    <div className="notice-header">
                                        <InfoCircleOutlined className="notice-icon" />
                                        <Title level={5} className="notice-title">
                                            Lưu ý bảo mật
                                        </Title>
                                    </div>
                                    <div className="notice-content">
                                        <Text className="notice-text">
                                            Thông tin của bạn được mã hóa và bảo vệ theo tiêu chuẩn quốc tế.
                                            Chúng tôi không chia sẻ dữ liệu với bên thứ ba.
                                        </Text>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    {/* Action Buttons */}
                    <div className="action-buttons">
                        <Button
                            type="primary"
                            size="large"
                            loading={loading}
                            onClick={handleSubmitVerification}
                            className="submit-btn"
                        >
                            Gửi xác thực
                        </Button>
                        <Button
                            type="link"
                            onClick={handleVerifyLater}
                            className="later-btn"
                        >
                            Tôi sẽ xác thực sau
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Verify;