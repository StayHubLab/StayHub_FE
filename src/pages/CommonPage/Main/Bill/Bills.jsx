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
  Image,
} from "antd";
import { UploadOutlined, FileImageOutlined, ReloadOutlined } from "@ant-design/icons";
import { useAuth } from "../../../../contexts/AuthContext";
import billApi from "../../../../services/api/billApi";
import UploadPaymentEvidenceModal from "../../../../components/UploadPaymentEvidenceModal";

const DEFAULT_PAGE_SIZE = 10;

const statusMap = {
  pending: { color: "gold", text: "Chờ thanh toán" },
  pending_approval: { color: "blue", text: "Chờ duyệt" },
  paid: { color: "green", text: "Đã thanh toán" },
  overdue: { color: "red", text: "Quá hạn" },
  failed: { color: "volcano", text: "Thất bại" },
  rejected: { color: "volcano", text: "Bị từ chối" },
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
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [selectedBillId, setSelectedBillId] = useState(null);
  const [evidencePreview, setEvidencePreview] = useState(null);

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
            {(r.status === "pending" || r.status === "rejected") && !r.paymentEvidence && (
              <Button
                type="primary"
                size="small"
                icon={<UploadOutlined />}
                onClick={() => {
                  setSelectedBillId(r._id || r.id);
                  setUploadModalVisible(true);
                }}
              >
                Tải lên chứng từ
              </Button>
            )}
            {r.status === "pending_approval" && r.paymentEvidence && (
              <Tag color="blue" icon={<FileImageOutlined />}>
                Chờ duyệt
              </Tag>
            )}
            {r.paymentEvidence && (
              <Button
                size="small"
                icon={<FileImageOutlined />}
                onClick={() => setEvidencePreview(r.paymentEvidence)}
              >
                Xem chứng từ
              </Button>
            )}
            {r.status === "rejected" && r.rejectionReason && (
              <Tooltip title={r.rejectionReason}>
                <Button size="small" danger>
                  Lý do từ chối
                </Button>
              </Tooltip>
            )}
            <Button 
              size="small" 
              onClick={() => setDetail(r)}
            >
              Xem chi tiết
            </Button>
            <Tooltip title="Tải lại">
              <Button size="small" icon={<ReloadOutlined />} onClick={() => load(activeKey)}>
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
          { key: "pending_approval", label: "Chờ duyệt" },
          { key: "paid", label: "Đã thanh toán" },
          { key: "rejected", label: "Bị từ chối" },
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
        {detail && (() => {
          console.log('Detail object:', detail);
          console.log('Created by (landlord):', detail.createdBy);
          console.log('Bank Info:', detail.createdBy?.bankInfo);
          return null;
        })()}
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
            
            {/* Landlord Bank Information */}
            <Descriptions.Item 
              label={
                <span style={{ fontWeight: 600, color: '#4739F0' }}>
                  Thông tin chuyển khoản
                </span>
              }
            >
              <div style={{ 
                backgroundColor: '#f5f5f5', 
                padding: '12px', 
                borderRadius: '8px',
                border: '1px solid #d9d9d9'
              }}>
                {detail.createdBy?.bankInfo ? (
                  <>
                    <div style={{ marginBottom: '8px' }}>
                      <strong>Ngân hàng:</strong>{' '}
                      {detail.createdBy.bankInfo.bankName || '-'}
                    </div>
                    <div>
                      <strong>Số tài khoản:</strong>{' '}
                      <span style={{ 
                        fontFamily: 'monospace', 
                        fontSize: '15px',
                        color: '#4739F0',
                        fontWeight: 600
                      }}>
                        {detail.createdBy.bankInfo.accountNumber || '-'}
                      </span>
                    </div>
                    <div style={{ marginTop: '8px' }}>
                      <strong>Chủ tài khoản:</strong>{' '}
                      {detail.createdBy.bankInfo.accountHolder || detail.createdBy.name || detail.createdBy.fullName || '-'}
                    </div>
                    <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #d9d9d9' }}>
                      <strong>Người tạo hóa đơn:</strong>{' '}
                      {detail.createdBy.name || '-'}
                    </div>
                    <div>
                      <strong>Số điện thoại:</strong>{' '}
                      {detail.createdBy.phone || '-'}
                    </div>
                    <div>
                      <strong>Email:</strong>{' '}
                      {detail.createdBy.email || '-'}
                    </div>
                  </>
                ) : (
                  <span style={{ color: '#999' }}>Chưa có thông tin ngân hàng</span>
                )}
              </div>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* Upload Evidence Modal */}
      <UploadPaymentEvidenceModal
        visible={uploadModalVisible}
        onClose={() => {
          setUploadModalVisible(false);
          setSelectedBillId(null);
        }}
        billId={selectedBillId}
        onSuccess={() => {
          load(activeKey);
          message.success('Chứng từ thanh toán đã được tải lên. Đang chờ chủ nhà duyệt.');
        }}
      />

      {/* Evidence Preview Modal */}
      <Modal
        title="Chứng từ thanh toán"
        open={!!evidencePreview}
        onCancel={() => setEvidencePreview(null)}
        footer={null}
        width={800}
      >
        {evidencePreview && (
          <Image 
            src={evidencePreview} 
            alt="Payment Evidence" 
            style={{ width: '100%' }}
            fallback="data:image/png;base64,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"
          />
        )}
      </Modal>
    </div>
  );
};

export default Bills;
