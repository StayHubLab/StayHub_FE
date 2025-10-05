import React, { useEffect, useMemo, useState } from "react";
import { 
  Table, 
  Typography, 
  Tag, 
  DatePicker, 
  Select, 
  Tabs, 
  Space, 
  Button, 
  Modal, 
  Descriptions, 
  Input, 
  message,
  Image 
} from "antd";
import {
  EyeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  FileImageOutlined,
} from "@ant-design/icons";
import billApi from "../../../services/api/billApi";
import { useAuth } from "../../../contexts/AuthContext";
import "./Transaction.css";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { TabPane } = Tabs;
const { TextArea } = Input;

const Transaction = () => {
  const { user } = useAuth();
  const [allBills, setAllBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeType, setActiveType] = useState("all");
  const [dateRange, setDateRange] = useState([]);
  const [kindFilter, setKindFilter] = useState("all");
  
  // Modal states
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [approveModalVisible, setApproveModalVisible] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [approvalNotes, setApprovalNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [evidencePreview, setEvidencePreview] = useState(null);

  // Handler functions
  const handleViewDetails = (record) => {
    setSelectedTransaction(record);
    setDetailModalVisible(true);
  };

  const handleApprove = async () => {
    if (!selectedTransaction) return;
    try {
      await billApi.approvePayment(selectedTransaction.key, approvalNotes);
      message.success('Đã duyệt thanh toán thành công!');
      setApproveModalVisible(false);
      setApprovalNotes('');
      fetchBills();
    } catch (error) {
      message.error(error.response?.data?.message || 'Không thể duyệt thanh toán');
    }
  };

  const handleReject = async () => {
    if (!selectedTransaction || !rejectionReason.trim()) {
      message.warning('Vui lòng nhập lý do từ chối');
      return;
    }
    try {
      await billApi.rejectPayment(selectedTransaction.key, rejectionReason);
      message.success('Đã từ chối thanh toán');
      setRejectModalVisible(false);
      setRejectionReason('');
      fetchBills();
    } catch (error) {
      message.error(error.response?.data?.message || 'Không thể từ chối thanh toán');
    }
  };

  const handleEvidencePreview = (url) => {
    setEvidencePreview(url);
  };

  const columns = [
    {
      title: "Ngày hóa đơn",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (v) => (v ? new Date(v).toLocaleString("vi-VN") : "-"),
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      render: (t) => {
        const color =
          t === "deposit" ? "orange" : t === "refund" ? "purple" : "blue";
        const text =
          t === "deposit"
            ? "Đặt cọc"
            : t === "refund"
            ? "Hoàn tiền"
            : t === "monthly"
            ? "Hàng tháng"
            : "Khác";
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "Phòng",
      dataIndex: "roomName",
      key: "roomName",
    },
    {
      title: "Người thuê",
      dataIndex: "renterName",
      key: "renterName",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (s) => {
        const map = {
          paid: { c: "green", t: "Đã thanh toán" },
          pending: { c: "gold", t: "Chờ thanh toán" },
          pending_approval: { c: "blue", t: "Chờ duyệt" },
          rejected: { c: "red", t: "Bị từ chối" },
          overdue: { c: "volcano", t: "Quá hạn" },
          failed: { c: "volcano", t: "Thất bại" },
        };
        const m = map[s] || { c: "default", t: s };
        return <Tag color={m.c}>{m.t}</Tag>;
      },
    },
    {
      title: "Tiền thuê",
      dataIndex: "amountRent",
      key: "amountRent",
      render: (v) => (v ? `${v.toLocaleString()} VNĐ` : "0 VNĐ"),
    },
    {
      title: "Điện / Nước / Dịch vụ",
      dataIndex: "amountOthers",
      key: "amountOthers",
      render: (v) => v,
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (v) => <b>{(v || 0).toLocaleString()} VNĐ</b>,
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetails(record)}
          size="small"
        >
          Xem chi tiết
        </Button>
      ),
    },
  ];

  const fetchBills = async () => {
    if (!user?._id) return;
    try {
      setLoading(true);
      // Fetch bills for landlord (all bills from landlord's properties)
      const resp = await billApi.listByHost(user._id);
      const bills = Array.isArray(resp?.data)
        ? resp.data
        : resp?.data?.bills || resp?.data?.items || [];
      setAllBills(bills);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id]);

  const mapped = useMemo(() => {
    const list = (allBills || []).map((b) => {
      const rent = b.amount?.rent || 0;
      const elec = b.amount?.electricity || 0;
      const water = b.amount?.water || 0;
      const service = b.amount?.service || 0;
      const room =
        b.contractId?.roomId?.name ||
        b.contractId?.roomId?.code ||
        b.contractId?.roomId?.roomCode ||
        "N/A";
      const renterName =
        b.contractId?.renterId?.name || b.renterId?.name || "N/A";
      return {
        key: b._id,
        _raw: b,
        createdAt: b.createdAt,
        type: b.type,
        status: b.status,
        roomName: room,
        renterName,
        amountRent: rent,
        amountOthers: `${elec.toLocaleString()} / ${water.toLocaleString()} / ${service.toLocaleString()} VNĐ`,
        totalAmount: b.totalAmount ?? rent + elec + water + service,
      };
    });

    // Filter by date range
    const [start, end] = dateRange || [];
    const filteredByDate =
      start && end
        ? list.filter((row) => {
            const d = row.createdAt ? new Date(row.createdAt).getTime() : 0;
            return (
              d >= start.startOf("day").toDate().getTime() &&
              d <= end.endOf("day").toDate().getTime()
            );
          })
        : list;

    // Filter by kind if needed (income/expense). For bills, treat paid/received as income for landlord; here we keep it neutral.
    const finalList = filteredByDate;
    return finalList;
  }, [allBills, dateRange]);

  const dataByType = useMemo(() => {
    return {
      all: mapped,
      monthly: mapped.filter((r) => r.type === "monthly"),
      deposit: mapped.filter((r) => r.type === "deposit"),
      refund: mapped.filter((r) => r.type === "refund"),
      other: mapped.filter(
        (r) => !["monthly", "deposit", "refund"].includes(r.type)
      ),
    };
  }, [mapped]);

  return (
    <div className="transaction-container">
      <div className="transaction-header">
        <Title
          style={{ color: "#4739f0", fontSize: "40px", fontWeight: 800 }}
          level={2}
        >
          Giao dịch
        </Title>
        <div className="transaction-filters">
          <Space>
            <RangePicker
              placeholder={["Từ ngày", "Đến ngày"]}
              onChange={setDateRange}
            />
            <Select
              value={kindFilter}
              onChange={setKindFilter}
              style={{ width: 140 }}
            >
              <Option value="all">Tất cả</Option>
              <Option value="monthly">Hàng tháng</Option>
              <Option value="deposit">Đặt cọc</Option>
              <Option value="refund">Hoàn tiền</Option>
              <Option value="other">Khác</Option>
            </Select>
          </Space>
        </div>
      </div>

      <Tabs activeKey={activeType} onChange={setActiveType}>
        <TabPane tab="Tất cả" key="all">
          <Table
            loading={loading}
            columns={columns}
            dataSource={dataByType.all}
            pagination={{ pageSize: 10 }}
          />
        </TabPane>
        <TabPane tab="Hàng tháng" key="monthly">
          <Table
            loading={loading}
            columns={columns}
            dataSource={dataByType.monthly}
            pagination={{ pageSize: 10 }}
          />
        </TabPane>
        <TabPane tab="Đặt cọc" key="deposit">
          <Table
            loading={loading}
            columns={columns}
            dataSource={dataByType.deposit}
            pagination={{ pageSize: 10 }}
          />
        </TabPane>
        <TabPane tab="Hoàn tiền" key="refund">
          <Table
            loading={loading}
            columns={columns}
            dataSource={dataByType.refund}
            pagination={{ pageSize: 10 }}
          />
        </TabPane>
        <TabPane tab="Khác" key="other">
          <Table
            loading={loading}
            columns={columns}
            dataSource={dataByType.other}
            pagination={{ pageSize: 10 }}
          />
        </TabPane>
      </Tabs>

      {/* Transaction Detail Modal */}
      <Modal
        title="Chi tiết giao dịch"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        width={800}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            Đóng
          </Button>,
          selectedTransaction?._raw?.status === 'pending_approval' && (
            <Button
              key="reject"
              danger
              icon={<CloseCircleOutlined />}
              onClick={() => {
                setDetailModalVisible(false);
                setRejectModalVisible(true);
              }}
            >
              Từ chối
            </Button>
          ),
          selectedTransaction?._raw?.status === 'pending_approval' && (
            <Button
              key="approve"
              type="primary"
              icon={<CheckCircleOutlined />}
              onClick={() => {
                setDetailModalVisible(false);
                setApproveModalVisible(true);
              }}
            >
              Duyệt thanh toán
            </Button>
          ),
        ]}
      >
        {selectedTransaction && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Phòng" span={2}>
              {selectedTransaction.roomName}
            </Descriptions.Item>
            <Descriptions.Item label="Người thuê" span={2}>
              {selectedTransaction.renterName}
            </Descriptions.Item>
            <Descriptions.Item label="Loại hóa đơn">
              {selectedTransaction.type === 'deposit' ? 'Đặt cọc' :
               selectedTransaction.type === 'refund' ? 'Hoàn tiền' :
               selectedTransaction.type === 'monthly' ? 'Hàng tháng' : 'Khác'}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              {selectedTransaction._raw?.status === 'paid' ? 'Đã thanh toán' :
               selectedTransaction._raw?.status === 'pending' ? 'Chờ thanh toán' :
               selectedTransaction._raw?.status === 'pending_approval' ? 'Chờ duyệt' :
               selectedTransaction._raw?.status === 'rejected' ? 'Bị từ chối' :
               selectedTransaction._raw?.status === 'overdue' ? 'Quá hạn' : 'Khác'}
            </Descriptions.Item>
            <Descriptions.Item label="Tiền thuê">
              {selectedTransaction.amountRent?.toLocaleString()} VNĐ
            </Descriptions.Item>
            <Descriptions.Item label="Điện / Nước / Dịch vụ">
              {selectedTransaction.amountOthers}
            </Descriptions.Item>
            <Descriptions.Item label="Tổng tiền" span={2}>
              <Text strong style={{ fontSize: '18px', color: '#4739f0' }}>
                {selectedTransaction.totalAmount?.toLocaleString()} VNĐ
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tạo" span={2}>
              {selectedTransaction.createdAt ? new Date(selectedTransaction.createdAt).toLocaleString('vi-VN') : '-'}
            </Descriptions.Item>
            {selectedTransaction._raw?.paymentEvidence && (
              <Descriptions.Item label="Bằng chứng thanh toán" span={2}>
                <Button
                  icon={<FileImageOutlined />}
                  onClick={() => handleEvidencePreview(selectedTransaction._raw.paymentEvidence)}
                >
                  Xem bằng chứng
                </Button>
              </Descriptions.Item>
            )}
            {selectedTransaction._raw?.rejectionReason && (
              <Descriptions.Item label="Lý do từ chối" span={2}>
                <Text type="danger">{selectedTransaction._raw.rejectionReason}</Text>
              </Descriptions.Item>
            )}
            {selectedTransaction._raw?.approvalNotes && (
              <Descriptions.Item label="Ghi chú duyệt" span={2}>
                <Text>{selectedTransaction._raw.approvalNotes}</Text>
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>

      {/* Approve Modal */}
      <Modal
        title="Duyệt thanh toán"
        open={approveModalVisible}
        onOk={handleApprove}
        onCancel={() => {
          setApproveModalVisible(false);
          setApprovalNotes('');
        }}
        okText="Xác nhận duyệt"
        cancelText="Hủy"
      >
        <p>Bạn có chắc chắn muốn duyệt thanh toán này?</p>
        <TextArea
          rows={4}
          placeholder="Ghi chú (không bắt buộc)"
          value={approvalNotes}
          onChange={(e) => setApprovalNotes(e.target.value)}
        />
      </Modal>

      {/* Reject Modal */}
      <Modal
        title="Từ chối thanh toán"
        open={rejectModalVisible}
        onOk={handleReject}
        onCancel={() => {
          setRejectModalVisible(false);
          setRejectionReason('');
        }}
        okText="Xác nhận từ chối"
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
      >
        <p>Vui lòng nhập lý do từ chối:</p>
        <TextArea
          rows={4}
          placeholder="Lý do từ chối *"
          value={rejectionReason}
          onChange={(e) => setRejectionReason(e.target.value)}
          required
        />
      </Modal>

      {/* Evidence Preview Modal */}
      <Modal
        title="Bằng chứng thanh toán"
        open={!!evidencePreview}
        onCancel={() => setEvidencePreview(null)}
        footer={null}
        width={800}
      >
        {evidencePreview && (
          evidencePreview.toLowerCase().endsWith('.pdf') ? (
            <iframe
              src={evidencePreview}
              style={{ width: '100%', height: '600px', border: 'none' }}
              title="Payment Evidence PDF"
            />
          ) : (
            <Image
              src={evidencePreview}
              alt="Payment Evidence"
              style={{ width: '100%' }}
            />
          )
        )}
      </Modal>
    </div>
  );
};

export default Transaction;
