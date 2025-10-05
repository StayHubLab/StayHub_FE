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
  Space,
  Empty,
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
  const [api, contextHolder] = notification.useNotification();
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userReviews, setUserReviews] = useState([]);

  // Fetch user's existing reviews
  useEffect(() => {
    const fetchUserReviews = async () => {
      if (!user?._id) return;
      
      try {
        const response = await reviewApi.getRenterReviews(user._id);
        setUserReviews(response.data?.reviews || []);
      } catch (error) {
        console.error('Error fetching user reviews:', error);
      }
    };

    fetchUserReviews();
  }, [user]);

  // Fetch rented rooms and landlords from contracts
  useEffect(() => {
    const fetchRentedData = async () => {
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
        
        // Transform contracts to room format
        const rentedRooms = [];

        contracts.forEach((contract) => {
          const room = contract.roomId || {};
          const building = room.buildingId || {};
          const addressObj = building.address || room.address || {};
          
          const address = [
            addressObj.street,
            addressObj.ward,
            addressObj.district,
            addressObj.city,
          ].filter(Boolean).join(', ') || addressObj.fullAddress || 'Địa chỉ không có sẵn';
          
          // Add room
          if (room._id) {
            rentedRooms.push({
              id: room._id,
              name: room.name || room.title || 'Phòng trọ',
              address: address,
              price: contract.terms?.rentAmount || room.price?.rent || room.price || 0,
              image: room.images?.[0]?.url || room.images?.[0] || room.image,
              status: 'rented',
              landlord: {
                id: building.landlordId?._id || building.landlordId || building.ownerId?._id || building.ownerId,
                name: building.landlordId?.name || building.landlordId?.fullName || building.ownerId?.name || building.ownerId?.fullName || 'Chủ trọ',
                phone: building.landlordId?.phone || building.ownerId?.phone,
                email: building.landlordId?.email || building.ownerId?.email,
                avatar: building.landlordId?.avatar || building.ownerId?.avatar,
              },
              contract: contract,
              roomData: room,
              buildingData: building
            });
          }
        });
        
        setRooms(rentedRooms);
      } catch (error) {
        console.error('Error fetching rented data:', error);
        api.error({
          message: 'Lỗi',
          description: 'Không thể tải danh sách. Vui lòng thử lại.',
          placement: 'topRight'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRentedData();
  }, [user, api]);

  // Check if user already reviewed this room
  const hasReviewed = (roomId) => {
    return userReviews.some(r => (r.roomId?._id || r.roomId) === roomId);
  };

  // Handle opening review modal
  const handleOpenReviewModal = (room) => {
    if (!user) {
      api.warning({
        message: 'Yêu cầu đăng nhập',
        description: 'Vui lòng đăng nhập để đánh giá.',
        placement: 'topRight'
      });
      return;
    }

    // Check if already reviewed
    if (hasReviewed(room.id)) {
      api.info({
        message: 'Đã đánh giá',
        description: 'Bạn đã đánh giá phòng trọ này rồi.',
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
        rating: reviewData.rating,
        comment: reviewData.comment,
        roomId: selectedRoom.roomData?._id || selectedRoom.id,
        contractId: selectedRoom.contract?._id,
      };

      await reviewApi.createReview(payload);

      api.success({
        message: 'Thành công',
        description: 'Đánh giá của bạn đã được gửi thành công!',
        placement: 'topRight'
      });

      // Refresh user reviews
      const response = await reviewApi.getRenterReviews(user._id);
      setUserReviews(response.data?.reviews || []);

      handleCloseReviewModal();
    } catch (error) {
      console.error('Error submitting review:', error);
      api.error({
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
          Đang tải dữ liệu...
        </Text>
      </div>
    );
  }

  return (
    <div className="room-list-container">
      {contextHolder}
      <div className="room-list-header">
        <Title level={2} className="page-title">
          Đánh giá phòng trọ
        </Title>
        <Text className="page-subtitle">
          Đánh giá các phòng trọ mà bạn đang thuê
        </Text>
      </div>

      {loading ? (
        <div className="loading-container">
          <Spin size="large" tip="Đang tải danh sách phòng trọ..." />
        </div>
      ) : (
        <>
          <Row gutter={[24, 24]} className="room-grid">
            {rooms.map((room) => {
              const reviewed = hasReviewed(room.id);
              
              return (
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
                        {reviewed && (
                          <Tag 
                            color="success" 
                            className="reviewed-badge"
                            icon={<StarOutlined />}
                          >
                            Đã đánh giá
                          </Tag>
                        )}
                      </div>
                    }
                    actions={[
                      <Button
                        type="primary"
                        className="review-button"
                        icon={<StarOutlined />}
                        onClick={() => handleOpenReviewModal(room)}
                        disabled={reviewed}
                      >
                        {reviewed ? 'Đã đánh giá' : 'Đánh giá'}
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
                              <Text className="room-address" ellipsis>{room.address}</Text>
                            </div>
                            
                            <div className="room-info-item">
                              <DollarOutlined className="room-info-icon" />
                              <Text strong className="room-price">
                                {formatPrice(room.price)}/tháng
                              </Text>
                            </div>
                            
                            <div className="room-info-item">
                              <UserOutlined className="room-info-icon" />
                              <Text className="landlord-name" ellipsis>
                                Chủ trọ: {room.landlord?.name || 'N/A'}
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
              );
            })}
          </Row>

          {rooms.length === 0 && (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="Bạn chưa thuê phòng trọ nào"
            >
              <Text type="secondary">
                Hãy tìm kiếm và thuê phòng để có thể đánh giá!
              </Text>
            </Empty>
          )}
        </>
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
              targetType="room"
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default RoomListWithReviews;