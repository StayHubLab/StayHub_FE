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
  StarOutlined,
  StarFilled
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
  const [isViewReviewModalVisible, setIsViewReviewModalVisible] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
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
          
          // Get landlord info - try multiple paths including hostId from building
          const getLandlordInfo = () => {
            // Try building.hostId (most likely based on Renting.jsx pattern)
            if (building.hostId) {
              return {
                id: building.hostId._id || building.hostId,
                name: building.hostId.name || building.hostId.fullName || 'Chủ trọ',
                phone: building.hostId.phone,
                email: building.hostId.email,
                avatar: building.hostId.avatar,
              };
            }
            // Try building.landlordId
            if (building.landlordId) {
              return {
                id: building.landlordId._id || building.landlordId,
                name: building.landlordId.name || building.landlordId.fullName || 'Chủ trọ',
                phone: building.landlordId.phone,
                email: building.landlordId.email,
                avatar: building.landlordId.avatar,
              };
            }
            // Try contract.hostId
            if (contract.hostId) {
              return {
                id: contract.hostId._id || contract.hostId,
                name: contract.hostId.name || contract.hostId.fullName || 'Chủ trọ',
                phone: contract.hostId.phone,
                email: contract.hostId.email,
                avatar: contract.hostId.avatar,
              };
            }
            // Fallback
            return {
              id: null,
              name: 'Chủ trọ',
              phone: null,
              email: null,
              avatar: null,
            };
          };
          
          // Add room
          if (room._id) {
            rentedRooms.push({
              id: room._id,
              name: room.name || room.title || 'Phòng trọ',
              address: address,
              price: contract.terms?.rentAmount || room.price?.rent || room.price || 0,
              image: room.images?.[0]?.url || room.images?.[0] || room.image,
              status: 'rented',
              landlord: getLandlordInfo(),
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

  // Get review for a specific room
  const getReviewForRoom = (roomId) => {
    return userReviews.find(r => (r.roomId?._id || r.roomId) === roomId);
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

    // Check if already reviewed - show existing review
    if (hasReviewed(room.id)) {
      const review = getReviewForRoom(room.id);
      setSelectedRoom(room);
      setSelectedReview(review);
      setIsViewReviewModalVisible(true);
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

  // Handle closing view review modal
  const handleCloseViewReviewModal = () => {
    setIsViewReviewModalVisible(false);
    setSelectedRoom(null);
    setSelectedReview(null);
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
      <div className="review-room-list-loading">
        <Spin size="large" />
        <Text style={{ marginTop: 16, display: 'block', textAlign: 'center' }}>
          Đang tải dữ liệu...
        </Text>
      </div>
    );
  }

  return (
    <div className="review-room-list-container">
      {contextHolder}
      <div className="review-room-list-header">
        <Title level={2} className="review-page-title">
          Đánh giá phòng trọ
        </Title>
        <Text className="review-page-subtitle">
          Đánh giá các phòng trọ mà bạn đang thuê
        </Text>
      </div>

      {loading ? (
        <div className="loading-container">
          <Spin size="large" tip="Đang tải danh sách phòng trọ..." />
        </div>
      ) : (
        <>
          <Row gutter={[24, 24]} className="review-room-grid">
            {rooms.map((room) => {
              const reviewed = hasReviewed(room.id);
              
              return (
                <Col xs={24} sm={12} lg={8} xl={6} key={room.id}>
                  <Card
                    hoverable
                    className="review-room-card"
                    cover={
                      <div className="review-room-image-container">
                        <img
                          alt={`Hình ảnh phòng trọ ${room.name}`}
                          src={room.image || 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=300&h=200&auto=format&fit=crop&ixlib=rb-4.0.3'}
                          className="review-room-image"
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
                      >
                        {reviewed ? 'Xem đánh giá' : 'Đánh giá'}
                      </Button>
                    ]}
                  >
                    <Meta
                      title={
                        <div className="review-room-title">
                          {room.name}
                        </div>
                      }
                      description={
                        <div className="review-room-description">
                          <Space direction="vertical" size="small" style={{ width: '100%' }}>
                            <div className="review-room-info-item">
                              <EnvironmentOutlined className="review-room-info-icon" />
                              <Text className="review-room-address" ellipsis>{room.address}</Text>
                            </div>
                            
                            <div className="review-room-info-item">
                              <DollarOutlined className="review-room-info-icon" />
                              <Text strong className="review-room-price">
                                {formatPrice(room.price)}/tháng
                              </Text>
                            </div>
                            
                            <div className="review-room-info-item">
                              <UserOutlined className="review-room-info-icon" />
                              <Text className="review-landlord-name" ellipsis>
                                Chủ trọ: {room.landlord?.name || 'N/A'}
                              </Text>
                            </div>
                            
                            <Tag 
                              color="blue"
                              className="review-room-status-tag"
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
          <div className="review-modal-title">
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
          <div className="review-modal-content">
            <div className="review-selected-room-info">
              <Title level={4} className="review-selected-room-name">
                {selectedRoom.name}
              </Title>
              <Text className="review-selected-room-address">
                <EnvironmentOutlined /> {selectedRoom.address}
              </Text>
              <Text className="review-selected-landlord">
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

      {/* View Review Modal */}
      <Modal
        title={
          <div className="review-modal-title">
            <StarOutlined style={{ color: '#4739F0', marginRight: 8 }} />
            Đánh giá của bạn
          </div>
        }
        open={isViewReviewModalVisible}
        onCancel={handleCloseViewReviewModal}
        footer={[
          <Button key="close" onClick={handleCloseViewReviewModal}>
            Đóng
          </Button>
        ]}
        width={600}
        className="review-modal"
      >
        {selectedRoom && selectedReview && (
          <div className="review-modal-content">
            <div className="review-selected-room-info">
              <Title level={4} className="review-selected-room-name">
                {selectedRoom.name}
              </Title>
              <Text className="review-selected-room-address">
                <EnvironmentOutlined /> {selectedRoom.address}
              </Text>
              <Text className="review-selected-landlord">
                <UserOutlined /> Chủ trọ: {selectedRoom.landlord?.name}
              </Text>
            </div>

            {/* Display Review */}
            <div style={{ marginTop: 24 }}>
              <div style={{ marginBottom: 16 }}>
                <Text strong style={{ fontSize: 15, display: 'block', marginBottom: 8 }}>
                  Đánh giá của bạn:
                </Text>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarFilled
                      key={star}
                      style={{
                        fontSize: 24,
                        color: star <= (selectedReview.rating || 0) ? '#FAC227' : '#E8E8E8'
                      }}
                    />
                  ))}
                  <Text style={{ marginLeft: 8, fontSize: 16, fontWeight: 600 }}>
                    {selectedReview.rating}/5
                  </Text>
                </div>
              </div>

              <div>
                <Text strong style={{ fontSize: 15, display: 'block', marginBottom: 8 }}>
                  Nhận xét:
                </Text>
                <div style={{
                  background: '#F8F9FF',
                  padding: 16,
                  borderRadius: 12,
                  border: '1px solid rgba(71, 57, 240, 0.1)',
                  minHeight: 100
                }}>
                  <Text style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                    {selectedReview.comment || 'Không có nhận xét'}
                  </Text>
                </div>
              </div>

              {selectedReview.createdAt && (
                <div style={{ marginTop: 16 }}>
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    Đánh giá vào: {new Date(selectedReview.createdAt).toLocaleString('vi-VN')}
                  </Text>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default RoomListWithReviews;