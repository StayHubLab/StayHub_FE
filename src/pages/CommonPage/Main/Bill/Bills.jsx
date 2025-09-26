import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Tabs,
  Table,
  Tag,
  Space,
  Button,
  Tooltip,
  message,
  Modal,
  Descriptions,
} from "antd";
import { useAuth } from "../../../../contexts/AuthContext";
import billApi from "../../../../services/api/billApi";

const DEFAULT_PAGE_SIZE = 10;

const statusMap = {
  pending: { color: "gold", text: "Chờ thanh toán" },
  paid: { color: "green", text: "Đã thanh toán" },
  overdue: { color: "red", text: "Quá hạn" },
  failed: { color: "volcano", text: "Thất bại" },
};

const fmtVND = (n) =>
  typeof n === "number"
    ? n.toLocaleString("vi-VN", { style: "currency", currency: "VND" })
    : "-";

const Bills = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [activeKey, setActiveKey] = useState("pending");
  const [detail, setDetail] = useState(null);

  const load = useCallback(
    async (status) => {
      if (!user?._id && !user?.id) return;
      try {
        setLoading(true);
        const res = await billApi.listByRenter(user._id || user.id, {
          status: status === "all" ? undefined : status,
          limit: 100,
          page: 1,
        });
        const list = Array.isArray(res?.data)
          ? res.data
          : res?.bills || res?.items || res || [];
        setRows(list);
      } catch (e) {
        console.error(e);
        message.error("Không thể tải danh sách hoá đơn");
        setRows([]);
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  useEffect(() => {
    load(activeKey);
  }, [load, activeKey]);

  const columns = useMemo(
    () => [
      {
        title: "Mã HĐ",
        key: "code",
        render: (_, r) =>
          r.contractId?.code ||
          (r.contractId?._id || r.contractId || "-")?.toString()?.slice(-6),
        width: 120,
      },
      {
        title: "Phòng",
        key: "room",
        render: (_, r) => r.contractId?.roomId?.name || "-",
      },
      {
        title: "Loại",
        dataIndex: "type",
        key: "type",
      },
      {
        title: "Số tiền",
        key: "amount",
        render: (_, r) => fmtVND(r.totalAmount ?? 0),
      },
      {
        title: "Hạn thanh toán",
        dataIndex: "dueDate",
        key: "dueDate",
        render: (v) => (v ? new Date(v).toLocaleDateString("vi-VN") : "-"),
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        render: (v) => {
          const m = statusMap[v] || { color: "default", text: v || "-" };
          return <Tag color={m.color}>{m.text}</Tag>;
        },
      },
      {
        title: "Thao tác",
        key: "actions",
        render: (_, r) => (
          <Space>
            {r.status === "pending" && (
              <Button
                type="primary"
                size="small"
                onClick={async () => {
                  try {
                    setLoading(true);
                    const res = await billApi.getVnpayUrl(r._id || r.id);
                    const url = res?.data?.paymentUrl || res?.paymentUrl;
                    if (url) {
                      window.location.href = url;
                    } else {
                      message.error("Không tạo được link thanh toán");
                    }
                  } catch (e) {
                    console.error(e);
                    message.error("Không thể thanh toán hoá đơn");
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                Thanh toán
              </Button>
            )}
            <Button size="small" onClick={() => setDetail(r)}>
              Xem chi tiết
            </Button>
            <Tooltip title="Tải lại">
              <Button size="small" onClick={() => load(activeKey)}>
                Tải lại
              </Button>
            </Tooltip>
          </Space>
        ),
      },
    ],
    [activeKey, load]
  );

  return (
    <div style={{ padding: 16, minHeight: "100vh" }}>
      <h2
        style={{
          color: "#4739f0",
          fontSize: "40px",
          fontWeight: "800",
          marginBottom: 12,
        }}
      >
        Hóa đơn của tôi
      </h2>
      <Tabs
        activeKey={activeKey}
        onChange={setActiveKey}
        items={[
          { key: "pending", label: "Chờ thanh toán" },
          { key: "paid", label: "Đã thanh toán" },
          { key: "overdue", label: "Quá hạn" },
          { key: "failed", label: "Thất bại" },
          { key: "all", label: "Tất cả" },
        ]}
      />
      <Table
        rowKey={(r) => r._id || r.id}
        columns={columns}
        dataSource={rows}
        loading={loading}
        pagination={{ pageSize: DEFAULT_PAGE_SIZE }}
      />

      <Modal
        open={!!detail}
        onCancel={() => setDetail(null)}
        footer={<Button onClick={() => setDetail(null)}>Đóng</Button>}
        width={720}
        title="Chi tiết hoá đơn"
      >
        {detail && (
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="Mã hợp đồng">
              {detail.contractId?.code ||
                (detail.contractId?._id || detail.contractId || "-")
                  ?.toString()
                  ?.slice(-6)}
            </Descriptions.Item>
            <Descriptions.Item label="Phòng">
              {detail.contractId?.roomId?.name || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Loại hoá đơn">
              {detail.type}
            </Descriptions.Item>
            <Descriptions.Item label="Số tiền">
              {fmtVND(detail.totalAmount ?? 0)}
            </Descriptions.Item>
            <Descriptions.Item label="Chi tiết khoản">
              {`Tiền thuê: ${fmtVND(detail.amount?.rent || 0)} | Điện: ${fmtVND(
                detail.amount?.electricity || 0
              )} | Nước: ${fmtVND(
                detail.amount?.water || 0
              )} | Dịch vụ: ${fmtVND(detail.amount?.service || 0)}`}
            </Descriptions.Item>
            <Descriptions.Item label="Hạn thanh toán">
              {detail.dueDate
                ? new Date(detail.dueDate).toLocaleDateString("vi-VN")
                : "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag color={statusMap[detail.status]?.color}>
                {statusMap[detail.status]?.text || detail.status}
              </Tag>
            </Descriptions.Item>
            {detail.paidAt && (
              <Descriptions.Item label="Thời gian thanh toán">
                {new Date(detail.paidAt).toLocaleString("vi-VN")}
              </Descriptions.Item>
            )}
            <Descriptions.Item label="Ghi chú">
              {detail.note || "-"}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default Bills;
