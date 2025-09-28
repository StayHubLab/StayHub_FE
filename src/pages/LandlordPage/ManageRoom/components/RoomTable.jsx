import React from "react";
import PropTypes from "prop-types";
import { Table, Space, Button, Tooltip, Tag, Typography } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import "./RoomTable.css";

const { Text } = Typography;

const RoomTable = ({
  rooms,
  loading,
  onView,
  onEdit,
  onDelete,
  pagination,
  onPaginationChange,
}) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getStatusTag = (status) => {
    const statusConfig = {
      available: { label: "Còn trống", color: "green" },
      occupied: { label: "Đã thuê", color: "#4739F0" },
      maintenance: { label: "Bảo trì", color: "#FAC227" },
    };
    const config = statusConfig[status] || statusConfig.available;
    return (
      <Tag color={config.color} className="landlord-status-tag">
        {config.label}
      </Tag>
    );
  };

  const columns = [
    {
      title: "Mã phòng",
      dataIndex: "roomCode",
      key: "roomCode",
      width: 100,
      className: "landlord-table-cell",
      render: (text) => (
        <Text strong className="landlord-room-code">
          {text}
        </Text>
      ),
    },
    {
      title: "Tên phòng",
      dataIndex: "name",
      key: "name",
      className: "landlord-table-cell",
      render: (text, record) => (
        <div className="landlord-room-info">
          <div className="landlord-room-name">{text}</div>
          <div className="landlord-room-address">{record.address}</div>
        </div>
      ),
    },
    {
      title: "Loại phòng",
      dataIndex: "type",
      key: "type",
      width: 120,
      className: "landlord-table-cell",
    },
    {
      title: "Diện tích",
      dataIndex: "area",
      key: "area",
      width: 100,
      className: "landlord-table-cell",
      render: (area) => `${area}m²`,
    },
    {
      title: "Giá/Tháng",
      dataIndex: "price",
      key: "price",
      width: 150,
      className: "landlord-table-cell",
      render: (price) => (
        <span className="landlord-price">{formatCurrency(price)}</span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      className: "landlord-table-cell",
      render: (status) => getStatusTag(status),
    },
    {
      title: "Người thuê",
      key: "tenant",
      width: 150,
      className: "landlord-table-cell",
      render: (_, record) =>
        record.tenant ? (
          <div className="landlord-tenant-info">
            <div className="landlord-tenant-name">{record.tenant.name}</div>
            <div className="landlord-tenant-phone">{record.tenant.phone}</div>
          </div>
        ) : (
          <Text type="secondary">Chưa có</Text>
        ),
    },
    {
      title: "Hạn thanh toán",
      dataIndex: "dueDate",
      key: "dueDate",
      width: 130,
      className: "landlord-table-cell",
      render: (date) =>
        date ? (
          <Text
            type={new Date(date) < new Date() ? "danger" : "default"}
            className="landlord-due-date"
          >
            {new Date(date).toLocaleDateString("vi-VN")}
          </Text>
        ) : (
          <Text type="secondary">--</Text>
        ),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 120,
      className: "landlord-table-cell",
      render: (_, record) => (
        <Space size="small" className="landlord-action-buttons">
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                onView(record);
              }}
              className="landlord-action-btn landlord-view-btn"
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                onEdit(record);
              }}
              className="landlord-action-btn landlord-edit-btn"
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button
              type="text"
              icon={<DeleteOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                onDelete(record._id || record.id);
              }}
              className="landlord-action-btn landlord-delete-btn"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="landlord-room-table-container">
      <Table
        columns={columns}
        dataSource={rooms}
        loading={loading}
        rowKey={(record) => record._id || record.id}
        pagination={{
          current: pagination?.current || 1,
          pageSize: pagination?.pageSize || 10,
          total: pagination?.total || 0,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} của ${total} phòng`,
          className: "landlord-pagination",
          onChange: onPaginationChange,
          onShowSizeChange: onPaginationChange,
        }}
        onRow={(record) => ({
          onClick: () => onView(record),
          className: "landlord-table-row",
        })}
        className="landlord-room-table"
      />
    </div>
  );
};

RoomTable.propTypes = {
  rooms: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  onView: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  pagination: PropTypes.object,
  onPaginationChange: PropTypes.func,
};

export default RoomTable;
