import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  Table,
  Tag,
  message,
  Button,
  Empty,
  Spin,
  Modal,
  Space,
  Typography,
  Tooltip,
  Input,
} from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  HomeOutlined,
  PhoneOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
  CheckCircleOutlined,
  UserOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../../contexts/AuthContext";
import viewingApi from "../../../services/api/viewingApi";
import "./BookingCalendar.css";

const { Title } = Typography;
const { TextArea } = Input;

const BookingCalendar = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [modalConfig, setModalConfig] = useState({
    visible: false,
    type: "",
    title: "",
    appointmentId: "",
    message: "",
  });
  const { user } = useAuth();

  // Helper function to format address object to string
  const formatAddress = (address) => {
    if (!address || typeof address !== "object") return "N/A";

    const parts = [
      address.street,
      address.ward,
      address.district,
      address.city,
    ].filter((part) => part && part.trim());

    return parts.length > 0 ? parts.join(", ") : "N/A";
  };

  // Memoized fetch function to avoid dependency issues
  const fetchAppointments = useCallback(async () => {
    if (!user?._id) return;

    try {
      setLoading(true);
      const response = await viewingApi.getViewingsByLandlord(user._id);

      if (response.success) {
        setAppointments(response.data || []);
      } else {
        message.error("Không thể tải danh sách lịch hẹn");
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      message.error("Có lỗi xảy ra khi tải danh sách lịch hẹn");
    } finally {
      setLoading(false);
    }
  }, [user?._id]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const setButtonLoading = (appointmentId, action, isLoading) => {
    setActionLoading((prev) => ({
      ...prev,
      [`${appointmentId}-${action}`]: isLoading,
    }));
  };

  const getStatusColor = (status) => {
    const statusColors = {
      pending: "orange",
      confirmed: "green",
      cancelled: "red",
      canceled: "red",
      completed: "blue",
    };
    return statusColors[status] || "default";
  };

  const getStatusText = (status) => {
    const statusTexts = {
      pending: "Chờ xác nhận",
      confirmed: "Đã xác nhận",
      cancelled: "Đã hủy",
      canceled: "Đã hủy",
      completed: "Hoàn thành",
    };
    return statusTexts[status] || status;
  };

  const showActionModal = (type, appointmentId, title) => {
    setModalConfig({
      visible: true,
      type,
      title,
      appointmentId,
      message: "",
    });
  };

  const hideModal = () => {
    setModalConfig({
      visible: false,
      type: "",
      title: "",
      appointmentId: "",
      message: "",
    });
  };

  const handleModalMessageChange = (e) => {
    setModalConfig((prev) => ({
      ...prev,
      message: e.target.value,
    }));
  };

  const executeAction = async () => {
    const { type, appointmentId, message: actionMessage } = modalConfig;
    
    try {
      setButtonLoading(appointmentId, type, true);
      let response;

      switch (type) {
        case "confirm":
          response = await viewingApi.confirmViewing(appointmentId, actionMessage);
          break;
        case "cancel":
          response = await viewingApi.cancelViewing(appointmentId, actionMessage);
          break;
        case "complete":
          response = await viewingApi.completeViewing(appointmentId);
          break;
        case "delete":
          response = await viewingApi.deleteViewing(appointmentId);
          break;
        default:
          throw new Error("Invalid action type");
      }

      if (response.success) {
        const actionMessages = {
          confirm: "Xác nhận lịch hẹn thành công",
          cancel: "Hủy lịch hẹn thành công",
          complete: "Hoàn thành lịch hẹn thành công",
          delete: "Xóa lịch hẹn thành công",
        };
        message.success(actionMessages[type]);
        await fetchAppointments(); // Refresh the list
        hideModal();
      } else {
        message.error(`Không thể ${type === "confirm" ? "xác nhận" : type === "cancel" ? "hủy" : type === "complete" ? "hoàn thành" : "xóa"} lịch hẹn`);
      }
    } catch (error) {
      console.error(`Error ${type} appointment:`, error);
      message.error(`Có lỗi xảy ra khi ${type === "confirm" ? "xác nhận" : type === "cancel" ? "hủy" : type === "complete" ? "hoàn thành" : "xóa"} lịch hẹn`);
    } finally {
      setButtonLoading(appointmentId, type, false);
    }
  };

  const renderActionButtons = (record) => {
    const appointmentId = record._id;
    const status = record.status;

    if (status === "pending") {
      return (
        <Space size="small">
          <Tooltip title="Xác nhận lịch hẹn">
            <Button
              type="text"
              size="small"
              icon={
                <CheckOutlined 
                  style={{ color: '#52c41a', fontSize: '16px' }} 
                />
              }
              loading={actionLoading[`${appointmentId}-confirm`]}
              onClick={() =>
                showActionModal("confirm", appointmentId, "Xác nhận lịch hẹn")
              }
              className="action-btn accept-btn"
            />
          </Tooltip>
          <Tooltip title="Hủy lịch hẹn">
            <Button
              type="text"
              size="small"
              icon={
                <CloseOutlined 
                  style={{ color: '#ff4d4f', fontSize: '16px' }} 
                />
              }
              loading={actionLoading[`${appointmentId}-cancel`]}
              onClick={() =>
                showActionModal("cancel", appointmentId, "Xác nhận hủy lịch hẹn")
              }
              className="action-btn cancel-btn"
            />
          </Tooltip>
        </Space>
      );
    }

    if (status === "confirmed") {
      return (
        <Space size="small">
          <Tooltip title="Hoàn thành lịch hẹn">
            <Button
              type="text"
              size="small"
              icon={
                <CheckCircleOutlined 
                  style={{ color: '#1890ff', fontSize: '16px' }} 
                />
              }
              loading={actionLoading[`${appointmentId}-complete`]}
              onClick={() =>
                showActionModal("complete", appointmentId, "Xác nhận hoàn thành lịch hẹn")
              }
              className="action-btn complete-btn"
            />
          </Tooltip>
          <Tooltip title="Hủy lịch hẹn">
            <Button
              type="text"
              size="small"
              icon={
                <CloseOutlined 
                  style={{ color: '#ff4d4f', fontSize: '16px' }} 
                />
              }
              loading={actionLoading[`${appointmentId}-cancel`]}
              onClick={() =>
                showActionModal("cancel", appointmentId, "Xác nhận hủy lịch hẹn")
              }
              className="action-btn cancel-btn"
            />
          </Tooltip>
          <Tooltip title="Liên hệ khách hàng">
            <Button
              type="text"
              size="small"
              icon={
                <PhoneOutlined 
                  style={{ color: '#722ed1', fontSize: '16px' }} 
                />
              }
              onClick={() => {
                const phone = record.userId?.phone;
                if (phone) {
                  window.open(`tel:${phone}`);
                } else {
                  message.warning("Không có số điện thoại");
                }
              }}
              className="action-btn phone-btn"
            />
          </Tooltip>
        </Space>
      );
    }

    if (
      status === "cancelled" ||
      status === "canceled" ||
      status === "completed"
    ) {
      return (
        <Tooltip title="Xóa lịch hẹn">
          <Button
            type="text"
            size="small"
            icon={
              <DeleteOutlined 
                style={{ color: '#ff4d4f', fontSize: '16px' }} 
              />
            }
            loading={actionLoading[`${appointmentId}-delete`]}
            onClick={() =>
              showActionModal("delete", appointmentId, "Xác nhận xóa lịch hẹn")
            }
            className="action-btn delete-btn"
          />
        </Tooltip>
      );
    }

    return null;
  };

  const columns = [
    {
      title: "Phòng",
      key: "room",
      width: "25%",
      render: (_, record) => (
        <div className="room-info">
          <div className="room-name">
            <HomeOutlined className="icon" />
            <span>{record.roomId?.name || "N/A"}</span>
          </div>
          <div className="building-name">
            {record.buildingId?.name || "N/A"}
          </div>
          <div className="address">
            {formatAddress(record.buildingId?.address)}
          </div>
        </div>
      ),
    },
    {
      title: "Ngày & Giờ",
      key: "datetime",
      width: "20%",
      render: (_, record) => (
        <div className="datetime-info">
          <div className="date">
            <CalendarOutlined className="icon" />
            {new Date(record.viewingDate).toLocaleDateString("vi-VN", {
              weekday: "short",
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </div>
          <div className="time">
            <ClockCircleOutlined className="icon" />
            {record.viewingTime}
          </div>
        </div>
      ),
    },
    {
      title: "Người thuê",
      key: "tenant",
      width: "18%",
      render: (_, record) => (
        <div className="tenant-info">
          <div className="tenant-name">
            <UserOutlined className="icon" />
            <span>{record.userId?.name || "N/A"}</span>
          </div>
          <div className="tenant-phone">
            <PhoneOutlined className="icon" />
            <span>{record.userId?.phone || "N/A"}</span>
          </div>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: "12%",
      render: (status) => (
        <Tag color={getStatusColor(status)} className="status-tag">
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: "15%",
      render: (date) => (
        <div className="created-date">
          {new Date(date).toLocaleDateString("vi-VN")}
        </div>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: "10%",
      render: (_, record) => renderActionButtons(record),
    },
  ];

  const renderConfirmationModal = () => {
    const { visible, title, type, message: modalMessage } = modalConfig;
    
    const getModalDescription = (actionType) => {
      switch(actionType) {
        case "confirm":
          return "Bạn có chắc chắn muốn chấp nhận lịch hẹn này không?";
        case "cancel":
          return "Bạn có chắc chắn muốn hủy lịch hẹn này không?";
        case "complete":
          return "Bạn có chắc chắn lịch hẹn này đã hoàn thành chưa?";
        case "delete":
          return "Bạn có chắc chắn muốn xóa lịch hẹn này không?";
        default:
          return "Bạn có chắc chắn muốn thực hiện hành động này không?";
      }
    };

    const getConfirmIcon = (actionType) => {
      switch(actionType) {
        case "confirm":
          return <CheckOutlined />;
        case "cancel":
          return <CloseOutlined />;
        case "complete":
          return <CheckCircleOutlined />;
        case "delete":
          return <DeleteOutlined />;
        default:
          return null;
      }
    };

    const getModalTheme = (actionType) => {
      switch(actionType) {
        case "confirm":
          return {
            color: "#52c41a",
            bgColor: "#f6ffed",
            borderColor: "#52c41a"
          };
        case "cancel":
          return {
            color: "#ff4d4f",
            bgColor: "#fff2f0",
            borderColor: "#ff4d4f"
          };
        case "complete":
          return {
            color: "#1890ff",
            bgColor: "#e6f7ff",
            borderColor: "#1890ff"
          };
        case "delete":
          return {
            color: "#ff4d4f",
            bgColor: "#fff2f0",
            borderColor: "#ff4d4f"
          };
        default:
          return {
            color: "#1890ff",
            bgColor: "#f0f9ff",
            borderColor: "#1890ff"
          };
      }
    };

    const theme = getModalTheme(type);

    return (
      <Modal
        open={visible}
        onOk={executeAction}
        onCancel={hideModal}
        width={480}
        centered
        footer={null}
        closable={false}
        className="modern-booking-modal"
        bodyStyle={{ padding: 0 }}
      >
        <div className="modal-content">
          {/* Custom Header */}
          <div 
            className="modal-header" 
            style={{ 
              backgroundColor: theme.bgColor,
              borderBottom: `2px solid ${theme.borderColor}`
            }}
          >
            <div className="modal-icon" style={{ color: theme.color }}>
              {getConfirmIcon(type)}
            </div>
            <h3 className="modal-title">{title}</h3>
          </div>

          {/* Body Content */}
          <div className="modal-body">
            <div className="description-section">
              <p className="modal-description">
                {getModalDescription(type)}
              </p>
            </div>

            <div className="message-section">
              <label className="message-label">
                <span className="label-text">Tin nhắn đến người đặt lịch</span>
                <span className="label-optional">(Tùy chọn)</span>
              </label>
              <TextArea
                rows={4}
                placeholder="Nhập tin nhắn để gửi đến người đặt lịch..."
                value={modalMessage}
                onChange={handleModalMessageChange}
                maxLength={300}
                showCount
                className="message-textarea"
              />
            </div>
          </div>

          {/* Custom Footer */}
          <div className="modal-footer">
            <Button
              size="large"
              onClick={hideModal}
              className="cancel-button"
            >
              Cancel
            </Button>
            <Button
              size="large"
              type="primary"
              icon={getConfirmIcon(type)}
              onClick={executeAction}
              loading={actionLoading[`${modalConfig.appointmentId}-${type}`]}
              className={`confirm-button ${type}-action`}
              style={{
                backgroundColor: theme.color,
                borderColor: theme.color
              }}
            >
              {type === "confirm" && "Accept Booking"}
              {type === "cancel" && "Cancel Booking"}
              {type === "complete" && "Mark Complete"}
              {type === "delete" && "Delete Booking"}
            </Button>
          </div>
        </div>
      </Modal>
    );
  };

  if (loading) {
    return (
      <div className="booking-calendar-container">
        <Card>
          <div className="loading-container">
            <Spin size="large" />
            <div className="loading-text">Đang tải lịch hẹn...</div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="booking-calendar-container">
      <Card
        className="main-card"
        title={
          <div className="card-title">
            <CalendarOutlined className="title-icon" />
            <Title level={4} className="title-text" style={{ color: '#ffffffff'}}>
              Quản lý lịch hẹn xem phòng
            </Title>
          </div>
        }
        extra={
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            onClick={fetchAppointments}
            loading={loading}
          >
            Làm mới
          </Button>
        }
      >
        {appointments.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Chưa có lịch hẹn xem phòng nào"
            className="empty-state"
          />
        ) : (
          <Table
            columns={columns}
            dataSource={appointments}
            rowKey="_id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} của ${total} lịch hẹn`,
            }}
            scroll={{ x: 1200 }}
            className="appointments-table"
          />
        )}
      </Card>

      {renderConfirmationModal()}
    </div>
  );
};

export default BookingCalendar;
