import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Tabs, Card, Row, Col, Typography, Tag, Divider, Avatar } from 'antd';
import { HomeOutlined, UserOutlined, CalendarOutlined, DollarOutlined } from '@ant-design/icons';
import './RoomDetailModal.css';

const { TabPane } = Tabs;
const { Title, Text } = Typography;

const RoomDetailModal = ({ visible, onClose, room, activeTab, onTabChange }) => {
  if (!room) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getStatusTag = (status) => {
    const statusConfig = {
      available: { label: 'Còn trống', color: 'green' },
      occupied: { label: 'Đã thuê', color: '#4739F0' },
      maintenance: { label: 'Bảo trì', color: '#FAC227' }
    };
    const config = statusConfig[status] || statusConfig.available;
    return <Tag color={config.color}>{config.label}</Tag>;
  };

  return (
    <Modal
      title={`Chi tiết phòng ${room.roomCode}`}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      className="landlord-room-detail-modal"
    >
      <Tabs 
        activeKey={activeTab} 
        onChange={onTabChange}
        className="landlord-detail-tabs"
      >
        {/* Tab 1: Room Details */}
        <TabPane 
          tab={
            <span className="landlord-tab-title">
              <HomeOutlined /> Chi tiết phòng
            </span>
          } 
          key="1"
        >
          <Card className="landlord-detail-card">
            <Row gutter={24}>
              <Col span={12}>
                <div className="landlord-detail-section">
                  <div className="landlord-detail-item">
                    <Text strong className="landlord-detail-label">Mã phòng:</Text>
                    <div className="landlord-detail-value">{room.roomCode}</div>
                  </div>
                  <div className="landlord-detail-item">
                    <Text strong className="landlord-detail-label">Tên phòng:</Text>
                    <div className="landlord-detail-value">{room.name}</div>
                  </div>
                  <div className="landlord-detail-item">
                    <Text strong className="landlord-detail-label">Địa chỉ:</Text>
                    <div className="landlord-detail-value">{room.address}</div>
                  </div>
                  <div className="landlord-detail-item">
                    <Text strong className="landlord-detail-label">Loại phòng:</Text>
                    <div className="landlord-detail-value">{room.type}</div>
                  </div>
                  <div className="landlord-detail-item">
                    <Text strong className="landlord-detail-label">Diện tích:</Text>
                    <div className="landlord-detail-value">{room.area}m²</div>
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div className="landlord-detail-section">
                  <div className="landlord-detail-item">
                    <Text strong className="landlord-detail-label">Giá thuê:</Text>
                    <div className="landlord-detail-value landlord-price-highlight">
                      {formatCurrency(room.price)}/tháng
                    </div>
                  </div>
                  <div className="landlord-detail-item">
                    <Text strong className="landlord-detail-label">Trạng thái:</Text>
                    <div className="landlord-detail-value">{getStatusTag(room.status)}</div>
                  </div>
                  <div className="landlord-detail-item">
                    <Text strong className="landlord-detail-label">Tiện nghi:</Text>
                    <div className="landlord-detail-value">
                      <div className="landlord-amenities">
                        {room.amenities?.map(amenity => (
                          <Tag key={amenity} color="#4739F0" className="landlord-amenity-tag">
                            {amenity}
                          </Tag>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
            {room.description && (
              <>
                <Divider className="landlord-divider" />
                <div className="landlord-detail-item">
                  <Text strong className="landlord-detail-label">Mô tả:</Text>
                  <div className="landlord-detail-value landlord-description">
                    {room.description}
                  </div>
                </div>
              </>
            )}
          </Card>
        </TabPane>

        {/* Tab 2: Guest Information */}
        <TabPane 
          tab={
            <span className="landlord-tab-title">
              <UserOutlined /> Thông tin khách thuê
            </span>
          } 
          key="2"
        >
          <Card className="landlord-detail-card">
            {room.tenant ? (
              <Row gutter={24}>
                <Col span={24}>
                  <div className="landlord-tenant-header">
                    <Avatar size={64} icon={<UserOutlined />} className="landlord-tenant-avatar" />
                    <div className="landlord-tenant-name-section">
                      <Title level={4} className="landlord-tenant-name">
                        {room.tenant.name}
                      </Title>
                      <Text type="secondary" className="landlord-tenant-occupation">
                        {room.tenant.occupation}
                      </Text>
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="landlord-detail-section">
                    <div className="landlord-detail-item">
                      <Text strong className="landlord-detail-label">Số điện thoại:</Text>
                      <div className="landlord-detail-value">{room.tenant.phone}</div>
                    </div>
                    <div className="landlord-detail-item">
                      <Text strong className="landlord-detail-label">Email:</Text>
                      <div className="landlord-detail-value">{room.tenant.email}</div>
                    </div>
                    <div className="landlord-detail-item">
                      <Text strong className="landlord-detail-label">CMND/CCCD:</Text>
                      <div className="landlord-detail-value">{room.tenant.idCard}</div>
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="landlord-detail-section">
                    <div className="landlord-detail-item">
                      <Text strong className="landlord-detail-label">Ngày bắt đầu hợp đồng:</Text>
                      <div className="landlord-detail-value">
                        {new Date(room.tenant.contractStart).toLocaleDateString('vi-VN')}
                      </div>
                    </div>
                    <div className="landlord-detail-item">
                      <Text strong className="landlord-detail-label">Ngày kết thúc hợp đồng:</Text>
                      <div className="landlord-detail-value">
                        {new Date(room.tenant.contractEnd).toLocaleDateString('vi-VN')}
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            ) : (
              <div className="landlord-empty-state">
                <UserOutlined className="landlord-empty-icon" />
                <div className="landlord-empty-text">Phòng chưa có khách thuê</div>
              </div>
            )}
          </Card>
        </TabPane>

        {/* Tab 3: Room Payment Due */}
        <TabPane 
          tab={
            <span className="landlord-tab-title">
              <CalendarOutlined /> Hạn thanh toán
            </span>
          } 
          key="3"
        >
          <Card className="landlord-detail-card">
            {room.dueDate ? (
              <div className="landlord-payment-info">
                <Row gutter={24}>
                  <Col span={12}>
                    <div className="landlord-payment-card">
                      <DollarOutlined className="landlord-payment-icon landlord-payment-icon-primary" />
                      <div className="landlord-payment-details">
                        <Title level={4} className="landlord-payment-title">
                          Hạn thanh toán tiếp theo
                        </Title>
                        <Text className="landlord-payment-date">
                          {new Date(room.dueDate).toLocaleDateString('vi-VN')}
                        </Text>
                        <div className={`landlord-payment-status ${
                          new Date(room.dueDate) < new Date() 
                            ? 'landlord-overdue' 
                            : 'landlord-on-time'
                        }`}>
                          {new Date(room.dueDate) < new Date() ? 'Quá hạn' : 'Còn thời hạn'}
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className="landlord-payment-card">
                      <CalendarOutlined className="landlord-payment-icon landlord-payment-icon-secondary" />
                      <div className="landlord-payment-details">
                        <Title level={4} className="landlord-payment-title">
                          Số tiền phải thanh toán
                        </Title>
                        <Text className="landlord-payment-amount">
                          {formatCurrency(room.price)}
                        </Text>
                        <div className="landlord-payment-type">Tiền thuê tháng</div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            ) : (
              <div className="landlord-empty-state">
                <CalendarOutlined className="landlord-empty-icon" />
                <div className="landlord-empty-text">Không có thông tin thanh toán</div>
              </div>
            )}
          </Card>
        </TabPane>
      </Tabs>
    </Modal>
  );
};

RoomDetailModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  room: PropTypes.object,
  activeTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired
};

export default RoomDetailModal;