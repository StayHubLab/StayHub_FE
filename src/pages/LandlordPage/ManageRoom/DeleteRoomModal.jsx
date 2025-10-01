import React from "react";
import { Modal, Button, Alert, Typography, Space } from "antd";
import {
  DeleteOutlined,
  ExclamationCircleOutlined,
  UserOutlined,
  StopOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

const DeleteRoomModal = ({ visible, onClose, onConfirm, room, loading }) => {
  const hasTenant = room?.tenant || room?.status === "occupied" || room?.status === "rented";

  const handleConfirm = () => {
    if (!hasTenant) {
      onConfirm(room?._id || room?.key);
    }
  };

  return (
    <Modal
      title={
        <Space>
          <DeleteOutlined style={{ color: "#ff4d4f" }} />
          <span>Xác nhận xóa phòng</span>
        </Space>
      }
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Hủy
        </Button>,
        <Button
          key="confirm"
          type="primary"
          danger
          onClick={handleConfirm}
          loading={loading}
          disabled={hasTenant}
        >
          Xóa phòng
        </Button>,
      ]}
      width={500}
      centered
    >
      <div style={{ padding: "16px 0" }}>
        {hasTenant ? (
          <>
            <Alert
              message="Không thể xóa phòng"
              description="Phòng này hiện đang có người thuê. Bạn cần kết thúc hợp đồng trước khi có thể xóa phòng."
              type="error"
              icon={<StopOutlined />}
              showIcon
              style={{ marginBottom: 16 }}
            />
            {room?.tenant && (
              <div style={{ background: "#f5f5f5", padding: 12, borderRadius: 6 }}>
                <Text strong>
                  <UserOutlined /> Thông tin người thuê:
                </Text>
                <br />
                <Text>Tên: {room.tenant.name}</Text>
                <br />
                <Text>Điện thoại: {room.tenant.phone}</Text>
                <br />
                {room.tenant.contractEnd && (
                  <Text>Hợp đồng kết thúc: {new Date(room.tenant.contractEnd).toLocaleDateString("vi-VN")}</Text>
                )}
              </div>
            )}
          </>
        ) : (
          <>
            <Alert
              message="Cảnh báo"
              description="Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa phòng này không?"
              type="warning"
              icon={<ExclamationCircleOutlined />}
              showIcon
              style={{ marginBottom: 16 }}
            />
            <div style={{ background: "#f5f5f5", padding: 12, borderRadius: 6 }}>
              <Text strong>Thông tin phòng:</Text>
              <br />
              <Text>Tên phòng: {room?.name}</Text>
              <br />
              <Text>Mã phòng: {room?.roomCode}</Text>
              <br />
              <Text>Địa chỉ: {room?.address}</Text>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default DeleteRoomModal;