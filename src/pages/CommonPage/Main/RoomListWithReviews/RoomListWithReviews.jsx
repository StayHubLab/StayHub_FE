import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Modal,
  notification,
  Spin,
  Typography,
  Tag,
  Space
} from 'antd';
import {
  EnvironmentOutlined,
  DollarOutlined,
  UserOutlined,
  StarOutlined
} from '@ant-design/icons';
import FormReview from './FormReview';
import { useAuth } from '../../../../contexts/AuthContext';
import contractApi from '../../../../services/api/contractApi';
import reviewApi from '../../../../services/api/reviewApi';
import './RoomListWithReviews.css';

const { Title, Text } = Typography;
const { Meta } = Card;

const RoomListWithReviews = () => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch rented rooms data from contracts API
  useEffect(() => {
    const fetchRentedRooms = async () => {
      if (!user?._id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Get active contracts for the current user
        const contractResponse = await contractApi.getByUser(user._id, {
          status: 'active',
          limit: 50,
          page: 1,
        });
        
        const contracts = Array.isArray(contractResponse?.data)
          ? contractResponse.data
          : contractResponse?.contracts || contractResponse?.items || [];
        
        // Transform contracts to room format for display
        const rentedRooms = contracts.map((contract) => {
          const room = contract.roomId || {};
          const building = room.buildingId || {};
          const addressObj = building.address || room.address || {};
          
          const address = [
            addressObj.street,
            addressObj.ward,
            addressObj.district,
            addressObj.city,
          ].filter(Boolean).join(', ') || addressObj.fullAddress || 'Địa chỉ không có sẵn';
          
          return {
            id: room._id || room.id || contract._id,
            name: room.name || room.title || 'Phòng trọ',
            address: address,
            price: contract.terms?.rentAmount || room.price?.rent || room.price || 0,
            image: room.images?.[0]?.url || room.images?.[0] || room.image,
            status: 'rented',
            landlord: {
              id: building.landlordId?._id || building.landlordId || building.ownerId?._id || building.ownerId,
              name: building.landlordId?.name || building.landlordId?.fullName || building.ownerId?.name || building.ownerId?.fullName || 'Chủ trọ',
            },
            contract: contract,
            roomData: room,
            buildingData: building
          };
        }).filter(room => room.id);
        
        setRooms(rentedRooms);
      } catch (error) {
        console.error('Error fetching rented rooms:', error);
        notification.error({
          message: 'Lỗi',
          description: 'Không thể tải danh sách phòng trọ bạn đang thuê. Vui lòng thử lại.',
          placement: 'topRight'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRentedRooms();
  }, [user]);

  // Handle opening review modal
  const handleOpenReviewModal = (room) => {
    if (!user) {
      notification.warning({
        message: 'Yêu cầu đăng nhập',
        description: 'Vui lòng đăng nhập để đánh giá phòng trọ.',
        placement: 'topRight'
      });
      return;
    }

    setSelectedRoom(room);
    setIsModalVisible(true);
  };

  // Handle closing review modal
  const handleCloseReviewModal = () => {
    setIsModalVisible(false);
    setSelectedRoom(null);
  };

  // Handle review submission
  const handleReviewSubmit = async (reviewData) => {
    try {
      const payload = {
        targetType: 'room',
        roomId: selectedRoom.roomData?._id || selectedRoom.id,
        landlordId: selectedRoom.landlord?.id,
        tenantId: user._id || user.id,
        rating: reviewData.rating,
        comment: reviewData.comment,
        contractId: selectedRoom.contract?._id
      };

      await reviewApi.createReview(payload);

      notification.success({
        message: 'Thành công',
        description: 'Đánh giá của bạn đã được gửi thành công!',
        placement: 'topRight'
      });

      handleCloseReviewModal();
    } catch (error) {
      console.error('Error submitting review:', error);
      notification.error({
        message: 'Lỗi',
        description: error.response?.data?.message || 'Không thể gửi đánh giá. Vui lòng thử lại.',
        placement: 'topRight'
      });
    }
  };

  // Format price display
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="room-list-loading">
        <Spin size="large" />
        <Text style={{ marginTop: 16, display: 'block', textAlign: 'center' }}>
          Đang tải danh sách phòng trọ...
        </Text>
      </div>
    );
  }

  return (
    <div className="room-list-container">
      <div className="room-list-header">
        <Title level={2} className="page-title">
          Phòng trọ bạn đang thuê
        </Title>
        <Text className="page-subtitle">
          Đánh giá những căn phòng trọ bạn đang thuê
        </Text>
      </div>

      <Row gutter={[24, 24]} className="room-grid">
        {rooms.map((room) => (
          <Col xs={24} sm={12} lg={8} xl={6} key={room.id}>
            <Card
              hoverable
              className="room-card"
              cover={
                <div className="room-image-container">
                  <img
                    alt={`Hình ảnh phòng trọ ${room.name}`}
                    src={room.image || 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=300&h=200&auto=format&fit=crop&ixlib=rb-4.0.3'}
                    className="room-image"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=300&h=200&auto=format&fit=crop&ixlib=rb-4.0.3';
                    }}
                  />
                </div>
              }
              actions={[
                <Button
                  type="primary"
                  className="review-button"
                  icon={<StarOutlined />}
                  onClick={() => handleOpenReviewModal(room)}
                >
                  Đánh giá
                </Button>
              ]}
            >
              <Meta
                title={
                  <div className="room-title">
                    {room.name}
                  </div>
                }
                description={
                  <div className="room-description">
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                      <div className="room-info-item">
                        <EnvironmentOutlined className="room-info-icon" />
                        <Text className="room-address">{room.address}</Text>
                      </div>
                      
                      <div className="room-info-item">
                        <DollarOutlined className="room-info-icon" />
                        <Text strong className="room-price">
                          {formatPrice(room.price)}/tháng
                        </Text>
                      </div>
                      
                      <div className="room-info-item">
                        <UserOutlined className="room-info-icon" />
                        <Text className="landlord-name">
                          Chủ trọ: {room.landlord?.name || 'Chưa có thông tin'}
                        </Text>
                      </div>
                      
                      <Tag 
                        color="blue"
                        className="room-status-tag"
                      >
                        Đang thuê
                      </Tag>
                    </Space>
                  </div>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>

      {rooms.length === 0 && !loading && (
        <div className="empty-state">
          <Text className="empty-message">
            Bạn chưa thuê phòng trọ nào. Hãy tìm kiếm và thuê phòng để có thể đánh giá!
          </Text>
        </div>
      )}

      {/* Review Modal */}
      <Modal
        title={
          <div className="modal-title">
            <StarOutlined style={{ color: '#4739F0', marginRight: 8 }} />
            Đánh giá phòng trọ
          </div>
        }
        open={isModalVisible}
        onCancel={handleCloseReviewModal}
        footer={null}
        width={600}
        className="review-modal"
        destroyOnClose
      >
        {selectedRoom && (
          <div className="modal-content">
            <div className="selected-room-info">
              <Title level={4} className="selected-room-name">
                {selectedRoom.name}
              </Title>
              <Text className="selected-room-address">
                <EnvironmentOutlined /> {selectedRoom.address}
              </Text>
              <Text className="selected-landlord">
                <UserOutlined /> Chủ trọ: {selectedRoom.landlord?.name}
              </Text>
            </div>
            
            <FormReview
              onSubmit={handleReviewSubmit}
              onCancel={handleCloseReviewModal}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default RoomListWithReviews;