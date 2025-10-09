import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Modal,
  Tabs,
  Card,
  Row,
  Col,
  Typography,
  Tag,
  Divider,
  Avatar,
  Image,
  Rate,
  Progress,
  Badge,
  Spin,
} from "antd";
import {
  HomeOutlined,
  UserOutlined,
  CalendarOutlined,
  DollarOutlined,
  PictureOutlined,
  StarOutlined,
  EyeOutlined,
  HeartOutlined,
  SettingOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import roomApi from "../../../../services/api/roomApi";
import "./RoomDetailModal.css";

const { TabPane } = Tabs;
const { Title, Text } = Typography;

const RoomDetailModal = ({
  visible,
  onClose,
  room,
  activeTab,
  onTabChange,
}) => {
  const [contractInfo, setContractInfo] = useState(null);
  const [loadingContract, setLoadingContract] = useState(false);

  useEffect(() => {
    if (visible && room?._id) {
      fetchContractInfo();
    }
  }, [visible, room?._id]);

  const fetchContractInfo = async () => {
    if (!room?._id) return;

    try {
      setLoadingContract(true);
      const response = await roomApi.getRoomContractInfo(room._id);
      if (response.success) {
        setContractInfo(response.data);
      }
    } catch (error) {
    } finally {
      setLoadingContract(false);
    }
  };

  if (!room) return null;

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return "Chưa cập nhật";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };


  const getStatusTag = (status) => {
    const statusConfig = {
      available: { label: "Còn trống", color: "green" },
      rented: { label: "Đã thuê", color: "#4739F0" },
      occupied: { label: "Đã thuê", color: "#4739F0" },
      maintenance: { label: "Bảo trì", color: "#FAC227" },
      reserved: { label: "Đã đặt cọc", color: "orange" },
    };
    const config = statusConfig[status] || statusConfig.available;
    return <Tag color={config.color}>{config.label}</Tag>;
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("vi-VN");
  };

  const formatNumber = (number) => {
    if (!number) return "0";
    return new Intl.NumberFormat("vi-VN").format(number);
  };

  const renderFeatures = (features) => {
    if (!features || typeof features !== "object") return null;

    const featureLabels = {
      hasBalcony: "Ban công",
      hasWindow: "Cửa sổ",
      hasAircon: "Điều hòa",
      hasWaterHeater: "Nóng lạnh",
      hasKitchen: "Bếp",
      hasWardrobe: "Tủ quần áo",
      hasDesk: "Bàn làm việc",
      hasTv: "TV",
      hasInternet: "Internet",
      hasElevator: "Thang máy",
    };

    return Object.entries(features)
      .filter(([key, value]) => value === true)
      .map(([key]) => (
        <Tag key={key} color="blue" icon={<CheckCircleOutlined />}>
          {featureLabels[key] || key}
        </Tag>
      ));
  };

  const renderUtilities = (utilities) => {
    if (!utilities || !Array.isArray(utilities)) return null;

    return utilities.map((utility, index) => (
      <Tag
        key={index}
        color={utility.isAvailable ? "green" : "red"}
        icon={
          utility.isAvailable ? (
            <CheckCircleOutlined />
          ) : (
            <CloseCircleOutlined />
          )
        }
      >
        {utility.name}
        {utility.description && ` - ${utility.description}`}
      </Tag>
    ));
  };

  const formatAddress = (address) => {
    if (!address) return "N/A";
    if (typeof address === "string") return address;

    const { street, ward, district, city } = address;
    const parts = [street, ward, district, city].filter(Boolean);
    return parts.join(", ");
  };

  const getBuildingInfo = () => {
    // If room has building reference populated
    if (room.buildingId && typeof room.buildingId === "object") {
      return room.buildingId;
    }
    // If room has building info directly
    if (room.building) {
      return room.building;
    }
    return null;
  };

  const building = getBuildingInfo();

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
            {/* Basic Information */}
            <Row gutter={24}>
              <Col span={12}>
                <div className="landlord-detail-section">
                  <Title level={5}>Thông tin cơ bản</Title>
                  <div className="landlord-detail-item">
                    <Text strong className="landlord-detail-label">
                      Mã phòng:
                    </Text>
                    <div className="landlord-detail-value">{room.roomCode}</div>
                  </div>
                  <div className="landlord-detail-item">
                    <Text strong className="landlord-detail-label">
                      Tên phòng:
                    </Text>
                    <div className="landlord-detail-value">{room.name}</div>
                  </div>
                  <div className="landlord-detail-item">
                    <Text strong className="landlord-detail-label">
                      Địa chỉ:
                    </Text>
                    <div className="landlord-detail-value">
                      {building
                        ? formatAddress(building.address)
                        : room.address}
                    </div>
                  </div>
                  <div className="landlord-detail-item">
                    <Text strong className="landlord-detail-label">
                      Loại phòng:
                    </Text>
                    <div className="landlord-detail-value">{room.type}</div>
                  </div>
                  <div className="landlord-detail-item">
                    <Text strong className="landlord-detail-label">
                      Diện tích:
                    </Text>
                    <div className="landlord-detail-value">{room.area}m²</div>
                  </div>
                  <div className="landlord-detail-item">
                    <Text strong className="landlord-detail-label">
                      Sức chứa:
                    </Text>
                    <div className="landlord-detail-value">
                      {room.capacity || "N/A"} người
                    </div>
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div className="landlord-detail-section">
                  <Title level={5}>Giá cả & Trạng thái</Title>
                  {/* Giá thuê */}
                  <div className="landlord-detail-item">
                    <Text strong className="landlord-detail-label">
                      Giá thuê:
                    </Text>
                    <div className="landlord-detail-value landlord-price-highlight">
                      {formatCurrency(room.priceDetails?.rent || room.price)}
                      /tháng
                    </div>
                  </div>

                  {/* Tiền điện */}
                  <div className="landlord-detail-item">
                    <Text strong className="landlord-detail-label">
                      Tiền điện:
                    </Text>
                    <div className="landlord-detail-value">
                      {room.priceDetails?.electricity !== undefined &&
                      room.priceDetails?.electricity !== null
                        ? formatCurrency(room.priceDetails.electricity) + "/kWh"
                        : "Chưa cập nhật"}
                    </div>
                  </div>

                  {/* Tiền nước */}
                  <div className="landlord-detail-item">
                    <Text strong className="landlord-detail-label">
                      Tiền nước:
                    </Text>
                    <div className="landlord-detail-value">
                      {room.priceDetails?.water !== undefined &&
                      room.priceDetails?.water !== null
                        ? formatCurrency(room.priceDetails.water) + "/m³"
                        : "Chưa cập nhật"}
                    </div>
                  </div>

                  {/* Phí dịch vụ */}
                  <div className="landlord-detail-item">
                    <Text strong className="landlord-detail-label">
                      Phí dịch vụ:
                    </Text>
                    <div className="landlord-detail-value">
                      {room.priceDetails?.service !== undefined &&
                      room.priceDetails?.service !== null
                        ? formatCurrency(room.priceDetails.service) + "/tháng"
                        : "Chưa cập nhật"}
                    </div>
                  </div>

                  {/* Tiền cọc */}
                  <div className="landlord-detail-item">
                    <Text strong className="landlord-detail-label">
                      Tiền cọc:
                    </Text>
                    <div className="landlord-detail-value">
                      {room.priceDetails?.deposit !== undefined &&
                      room.priceDetails?.deposit !== null
                        ? formatCurrency(room.priceDetails.deposit)
                        : "Chưa cập nhật"}
                    </div>
                  </div>
                  <div className="landlord-detail-item">
                    <Text strong className="landlord-detail-label">
                      Trạng thái:
                    </Text>
                    <div className="landlord-detail-value">
                      {getStatusTag(room.status)}
                    </div>
                  </div>
                </div>
              </Col>
            </Row>

            {/* Features & Amenities */}
            <Divider className="landlord-divider" />
            <Row gutter={24}>
              <Col span={12}>
                <div className="landlord-detail-section">
                  <Title level={5}>Tính năng phòng</Title>
                  <div className="landlord-detail-item">
                    <div className="landlord-detail-value">
                      <div className="landlord-amenities">
                        {renderFeatures(room.features)}
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div className="landlord-detail-section">
                  <Title level={5}>Tiện ích phòng</Title>
                  <div className="landlord-detail-item">
                    <div className="landlord-detail-value">
                      <div className="landlord-amenities">
                        {renderUtilities(room.utilities)}
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={12}>
                <div className="landlord-detail-section">
                  <Title level={5}>Tiện nghi chung</Title>
                  <div className="landlord-detail-item">
                    <div className="landlord-detail-value">
                      <div className="landlord-amenities">
                        {room.amenities?.map((amenity, index) => (
                          <Tag
                            key={index}
                            color="#4739F0"
                            className="landlord-amenity-tag"
                          >
                            {amenity}
                          </Tag>
                        ))}
                        {building?.amenities?.map((amenity, index) => (
                          <Tag
                            key={`building-${index}`}
                            color="#FAC227"
                            className="landlord-amenity-tag"
                          >
                            {amenity} (Tòa nhà)
                          </Tag>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div className="landlord-detail-section">
                  <Title level={5}>Điểm nổi bật</Title>
                  <div className="landlord-detail-item">
                    <div className="landlord-detail-value">
                      <div className="landlord-amenities">
                        {building?.highlightPoints?.map((point, index) => (
                          <Tag
                            key={index}
                            color="gold"
                            className="landlord-amenity-tag"
                          >
                            ⭐ {point}
                          </Tag>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>

            {/* Statistics */}
            <Divider className="landlord-divider" />
            <Row gutter={24}>
              <Col span={8}>
                <div className="landlord-stat-card">
                  <StarOutlined className="landlord-stat-icon" />
                  <div className="landlord-stat-content">
                    <div className="landlord-stat-value">
                      {room.rating || 0}/5
                    </div>
                    <div className="landlord-stat-label">Đánh giá</div>
                  </div>
                </div>
              </Col>
              <Col span={8}>
                <div className="landlord-stat-card">
                  <EyeOutlined className="landlord-stat-icon" />
                  <div className="landlord-stat-content">
                    <div className="landlord-stat-value">
                      {formatNumber(room.viewCount)}
                    </div>
                    <div className="landlord-stat-label">Lượt xem</div>
                  </div>
                </div>
              </Col>
              <Col span={8}>
                <div className="landlord-stat-card">
                  <HeartOutlined className="landlord-stat-icon" />
                  <div className="landlord-stat-content">
                    <div className="landlord-stat-value">
                      {formatNumber(room.favoriteCount)}
                    </div>
                    <div className="landlord-stat-label">Yêu thích</div>
                  </div>
                </div>
              </Col>
            </Row>

            {/* Images */}
            {room.images && room.images.length > 0 && (
              <>
                <Divider className="landlord-divider" />
                <div className="landlord-detail-section">
                  <Title level={5}>Hình ảnh phòng</Title>
                  <div className="landlord-images-grid">
                    {room.images.map((image, index) => (
                      <div key={index} className="landlord-image-item">
                        <Badge
                          status={image.isVerified ? "success" : "warning"}
                          // text={
                          //   image.isVerified ? "Đã xác thực" : "Chưa xác thực"
                          // }
                        >
                          <Image
                            width={120}
                            height={80}
                            src={image.url}
                            style={{ objectFit: "cover", borderRadius: "4px" }}
                            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN..."
                          />
                        </Badge>
                        <Text type="secondary" style={{ fontSize: "12px" }}>
                          {new Date(image.uploadedAt).toLocaleDateString(
                            "vi-VN"
                          )}
                        </Text>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {room.description && (
              <>
                <Divider className="landlord-divider" />
                <div className="landlord-detail-item">
                  <Text strong className="landlord-detail-label">
                    Mô tả:
                  </Text>
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
            {loadingContract ? (
              <div style={{ textAlign: "center", padding: "40px" }}>
                <Spin size="large" />
                <div style={{ marginTop: "16px" }}>
                  Đang tải thông tin hợp đồng...
                </div>
              </div>
            ) : contractInfo ? (
              <Row gutter={24}>
                <Col span={24}>
                  <div className="landlord-tenant-header">
                    <Avatar
                      size={64}
                      icon={<UserOutlined />}
                      className="landlord-tenant-avatar"
                    />
                    <div className="landlord-tenant-name-section">
                      <Title level={4} className="landlord-tenant-name">
                        {contractInfo.renterId?.name || "N/A"}
                      </Title>
                      <Text
                        type="secondary"
                        className="landlord-tenant-occupation"
                      >
                        {contractInfo.renterId?.occupation || "Chưa cập nhật"}
                      </Text>
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="landlord-detail-section">
                    <div className="landlord-detail-item">
                      <Text strong className="landlord-detail-label">
                        Số điện thoại:
                      </Text>
                      <div className="landlord-detail-value">
                        {contractInfo.renterId?.phone || "N/A"}
                      </div>
                    </div>
                    <div className="landlord-detail-item">
                      <Text strong className="landlord-detail-label">
                        Email:
                      </Text>
                      <div className="landlord-detail-value">
                        {contractInfo.renterId?.email || "N/A"}
                      </div>
                    </div>
                    <div className="landlord-detail-item">
                      <Text strong className="landlord-detail-label">
                        CMND/CCCD:
                      </Text>
                      <div className="landlord-detail-value">
                        {contractInfo.renterId?.idCard || "N/A"}
                      </div>
                    </div>
                    <div className="landlord-detail-item">
                      <Text strong className="landlord-detail-label">
                        Trạng thái hợp đồng:
                      </Text>
                      <div className="landlord-detail-value">
                        <Tag
                          color={
                            contractInfo.status === "active"
                              ? "green"
                              : contractInfo.status === "pending"
                              ? "orange"
                              : "red"
                          }
                        >
                          {contractInfo.status === "active"
                            ? "Đang hoạt động"
                            : contractInfo.status === "pending"
                            ? "Chờ xử lý"
                            : contractInfo.status === "terminated"
                            ? "Đã chấm dứt"
                            : "Hết hạn"}
                        </Tag>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="landlord-detail-section">
                    <div className="landlord-detail-item">
                      <Text strong className="landlord-detail-label">
                        Ngày bắt đầu hợp đồng:
                      </Text>
                      <div className="landlord-detail-value">
                        {contractInfo.startDate
                          ? new Date(contractInfo.startDate).toLocaleDateString(
                              "vi-VN"
                            )
                          : "N/A"}
                      </div>
                    </div>
                    <div className="landlord-detail-item">
                      <Text strong className="landlord-detail-label">
                        Ngày kết thúc hợp đồng:
                      </Text>
                      <div className="landlord-detail-value">
                        {contractInfo.endDate
                          ? new Date(contractInfo.endDate).toLocaleDateString(
                              "vi-VN"
                            )
                          : "N/A"}
                      </div>
                    </div>
                    <div className="landlord-detail-item">
                      <Text strong className="landlord-detail-label">
                        Tiền thuê:
                      </Text>
                      <div className="landlord-detail-value">
                        {formatCurrency(contractInfo.terms?.rentAmount)}
                      </div>
                    </div>
                    <div className="landlord-detail-item">
                      <Text strong className="landlord-detail-label">
                        Tiền cọc:
                      </Text>
                      <div className="landlord-detail-value">
                        {formatCurrency(contractInfo.terms?.depositAmount)}
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            ) : (
              <div className="landlord-empty-state">
                <UserOutlined className="landlord-empty-icon" />
                <div className="landlord-empty-text">
                  Phòng chưa có khách thuê
                </div>
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
                          {new Date(room.dueDate).toLocaleDateString("vi-VN")}
                        </Text>
                        <div
                          className={`landlord-payment-status ${
                            new Date(room.dueDate) < new Date()
                              ? "landlord-overdue"
                              : "landlord-on-time"
                          }`}
                        >
                          {new Date(room.dueDate) < new Date()
                            ? "Quá hạn"
                            : "Còn thời hạn"}
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
                        <div className="landlord-payment-type">
                          Tiền thuê tháng
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            ) : (
              <div className="landlord-empty-state">
                <CalendarOutlined className="landlord-empty-icon" />
                <div className="landlord-empty-text">
                  Không có thông tin thanh toán
                </div>
              </div>
            )}
          </Card>
        </TabPane>

        {/* Tab 4: Building Information */}
        {building && (
          <TabPane
            tab={
              <span className="landlord-tab-title">
                <SettingOutlined /> Thông tin tòa nhà
              </span>
            }
            key="4"
          >
            <Card className="landlord-detail-card">
              {/* Building Basic Info */}
              <Row gutter={24}>
                <Col span={12}>
                  <div className="landlord-detail-section">
                    <Title level={5}>Thông tin cơ bản</Title>
                    <div className="landlord-detail-item">
                      <Text strong className="landlord-detail-label">
                        Tên tòa nhà:
                      </Text>
                      <div className="landlord-detail-value">
                        {building.name}
                      </div>
                    </div>
                    <div className="landlord-detail-item">
                      <Text strong className="landlord-detail-label">
                        Địa chỉ đầy đủ:
                      </Text>
                      <div className="landlord-detail-value">
                        {formatAddress(building.address)}
                      </div>
                    </div>
                    <div className="landlord-detail-item">
                      <Text strong className="landlord-detail-label">
                        Số tầng:
                      </Text>
                      <div className="landlord-detail-value">
                        {building.floors} tầng
                      </div>
                    </div>
                    <div className="landlord-detail-item">
                      <Text strong className="landlord-detail-label">
                        Diện tích tòa nhà:
                      </Text>
                      <div className="landlord-detail-value">
                        {formatNumber(building.area)}m²
                      </div>
                    </div>
                    <div className="landlord-detail-item">
                      <Text strong className="landlord-detail-label">
                        Đánh giá:
                      </Text>
                      <div className="landlord-detail-value">
                        <Rate disabled value={building.rating} allowHalf />
                        <Text style={{ marginLeft: 8 }}>
                          ({building.rating}/5)
                        </Text>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="landlord-detail-section">
                    <Title level={5}>Thông tin phòng</Title>
                    <div className="landlord-detail-item">
                      <Text strong className="landlord-detail-label">
                        Tổng số phòng:
                      </Text>
                      <div className="landlord-detail-value">
                        {building.totalRooms} phòng
                      </div>
                    </div>
                    <div className="landlord-detail-item">
                      <Text strong className="landlord-detail-label">
                        Phòng còn trống:
                      </Text>
                      <div className="landlord-detail-value">
                        {building.availableRooms} phòng
                      </div>
                    </div>
                    <div className="landlord-detail-item">
                      <Text strong className="landlord-detail-label">
                        Tỷ lệ lấp đầy:
                      </Text>
                      <div className="landlord-detail-value">
                        <Progress
                          percent={Math.round(
                            ((building.totalRooms - building.availableRooms) /
                              building.totalRooms) *
                              100
                          )}
                          size="small"
                          status="active"
                        />
                      </div>
                    </div>
                    <div className="landlord-detail-item">
                      <Text strong className="landlord-detail-label">
                        Giá trung bình:
                      </Text>
                      <div className="landlord-detail-value landlord-price-highlight">
                        {formatCurrency(building.avgPrice)}/tháng
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>

              {/* Building Description */}
              {building.description && (
                <>
                  <Divider className="landlord-divider" />
                  <div className="landlord-detail-item">
                    <Text strong className="landlord-detail-label">
                      Mô tả tòa nhà:
                    </Text>
                    <div className="landlord-detail-value landlord-description">
                      {building.description}
                    </div>
                  </div>
                </>
              )}

              {/* Nearby Places */}
              {building.nearbyPlaces && building.nearbyPlaces.length > 0 && (
                <>
                  <Divider className="landlord-divider" />
                  <div className="landlord-detail-section">
                    <Title level={5}>Địa điểm lân cận</Title>
                    <Row gutter={16}>
                      {building.nearbyPlaces.map((place, index) => (
                        <Col span={8} key={index}>
                          <div className="landlord-nearby-place">
                            <Text strong>{place.name}</Text>
                            <div>
                              <Tag color="blue">{place.type}</Tag>
                              <Text type="secondary">{place.distance}km</Text>
                            </div>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </div>
                </>
              )}

              {/* Building Images */}
              {building.images && building.images.length > 0 && (
                <>
                  <Divider className="landlord-divider" />
                  <div className="landlord-detail-section">
                    <Title level={5}>Hình ảnh tòa nhà</Title>
                    <div className="landlord-images-grid">
                      {building.images.map((image, index) => (
                        <div key={index} className="landlord-image-item">
                          <Image
                            width={120}
                            height={80}
                            src={image.url || image}
                            style={{ objectFit: "cover", borderRadius: "4px" }}
                            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN..."
                          />
                          <Text type="secondary" style={{ fontSize: "12px" }}>
                            Ảnh tòa nhà
                          </Text>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </Card>
          </TabPane>
        )}
      </Tabs>
    </Modal>
  );
};

RoomDetailModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  room: PropTypes.object,
  activeTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
};

export default RoomDetailModal;
