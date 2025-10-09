import React, { useState, useEffect } from "react";
import { Card, Table, Tag, message, Button, Empty, Spin, Modal } from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  HomeOutlined,
  PhoneOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../../../contexts/AuthContext";
import viewingApi from "../../../../services/api/viewingApi";
import "./ViewingAppointments.css";

const ViewingAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Helper function to format address object to string
  const formatAddress = (address) => {
    if (!address || typeof address !== "object") return "N/A";

    const parts = [
      address.street,
      address.ward,
      address.district,
      address.city,
    ].filter((part) => part && part.trim()); // Remove empty/null parts

    return parts.length > 0 ? parts.join(", ") : "N/A";
  };

  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await viewingApi.getMyViewings();

      if (response.success) {
        setAppointments(response.data || []);
      } else {
        message.error("Không thể tải danh sách lịch hẹn");
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi tải danh sách lịch hẹn");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const statusColors = {
      pending: "orange",
      confirmed: "green",
      cancelled: "red",
      completed: "blue",
    };
    return statusColors[status] || "default";
  };

  const getStatusText = (status) => {
    const statusTexts = {
      pending: "Chờ xác nhận",
      confirmed: "Đã xác nhận",
      cancelled: "Đã hủy",
      completed: "Hoàn thành",
    };
    return statusTexts[status] || status;
  };

  const handleCancelAppointment = (appointmentId) => {
    Modal.confirm({
      title: "Xác nhận hủy lịch hẹn",
      content: "Bạn có chắc chắn muốn hủy lịch hẹn này không?",
      okText: "Hủy lịch hẹn",
      cancelText: "Đóng",
      okType: "danger",
      onOk: async () => {
        try {
          const response = await viewingApi.cancelViewing(appointmentId);
          if (response.success) {
            message.success("Hủy lịch hẹn thành công");
            fetchAppointments(); // Refresh the list
          } else {
            message.error("Không thể hủy lịch hẹn");
          }
        } catch (error) {
          message.error("Có lỗi xảy ra khi hủy lịch hẹn");
        }
      },
    });
  };

  const columns = [
    {
      title: "Phòng",
      dataIndex: ["roomId", "name"],
      key: "roomName",
      render: (name, record) => (
        <div>
          <div style={{ fontWeight: "bold", marginBottom: 4 }}>
            <HomeOutlined style={{ marginRight: 8 }} />
            {name || "N/A"}
          </div>
          <div style={{ fontSize: "12px", color: "#666" }}>
            {record.buildingId?.name || "N/A"}
          </div>
          <div style={{ fontSize: "11px", color: "#999" }}>
            {formatAddress(record.buildingId?.address)}
          </div>
        </div>
      ),
    },
    {
      title: "Ngày & Giờ",
      key: "datetime",
      render: (_, record) => (
        <div>
          <div style={{ marginBottom: 4 }}>
            <CalendarOutlined style={{ marginRight: 8, color: "#1890ff" }} />
            {new Date(record.viewingDate).toLocaleDateString("vi-VN", {
              weekday: "short",
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </div>
          <div>
            <ClockCircleOutlined style={{ marginRight: 8, color: "#52c41a" }} />
            {record.viewingTime}
          </div>
        </div>
      ),
    },
    {
      title: "Chủ nhà",
      key: "landlord",
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: "bold", marginBottom: 4 }}>
            {record.landlordId?.name || "N/A"}
          </div>
          <div style={{ fontSize: "12px", color: "#666" }}>
            <PhoneOutlined style={{ marginRight: 4 }} />
            {record.landlordId?.phone || "N/A"}
          </div>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={getStatusColor(status)} style={{ fontWeight: "bold" }}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => (
        <div style={{ fontSize: "12px" }}>
          {new Date(date).toLocaleDateString("vi-VN")}
        </div>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <div>
          {record.status === "pending" && (
            <Button
              type="text"
              danger
              size="small"
              icon={<DeleteOutlined />}
              onClick={() => handleCancelAppointment(record._id)}
            >
              Hủy
            </Button>
          )}
          {record.status === "confirmed" && (
            <Button
              type="text"
              size="small"
              icon={<PhoneOutlined />}
              onClick={() => window.open(`tel:${record.landlordId?.phone}`)}
            >
              Gọi
            </Button>
          )}
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="viewing-appointments-container">
        <Card>
          <div style={{ textAlign: "center", padding: "50px 0" }}>
            <Spin size="large" />
            <div style={{ marginTop: 16 }}>Đang tải lịch hẹn...</div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="viewing-appointments-container">
      <Card
        title={
          <div style={{ display: "flex", alignItems: "center" }}>
            <CalendarOutlined
              style={{ marginRight: 12, fontSize: "20px", color: "#fac227" }}
            />
            <span>Lịch hẹn xem phòng</span>
          </div>
        }
        extra={
          <Button type="primary" onClick={fetchAppointments}>
            Làm mới
          </Button>
        }
      >
        {appointments.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Bạn chưa có lịch hẹn nào"
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
              showTotal: (total) => `Tổng ${total} lịch hẹn`,
            }}
          />
        )}
      </Card>
    </div>
  );
};

export default ViewingAppointments;
