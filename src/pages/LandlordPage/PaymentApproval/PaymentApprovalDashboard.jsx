import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Tag,
  Button,
  Space,
  Tabs,
  Modal,
  Input,
  message,
  Image,
  Descriptions,
  Badge,
  Typography,
} from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  FileImageOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import billApi from '../../../services/api/billApi';
import { useAuth } from '../../../contexts/AuthContext';

const { TabPane } = Tabs;
const { TextArea } = Input;
const { Text } = Typography;

const PaymentApprovalDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('pending_approval');
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [approveModalVisible, setApproveModalVisible] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [approvalNotes, setApprovalNotes] = useState('');
  const [evidencePreview, setEvidencePreview] = useState(null);

  useEffect(() => {
    fetchPayments(activeTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const fetchPayments = async (status) => {
    if (!user?._id) return;
    setLoading(true);
    try {
      const result = await billApi.getPaymentsByStatus(status);
      setPayments(result.data || []);
    } catch (error) {
      message.error('Không thể tải danh sách thanh toán');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedPayment) return;

    try {
      await billApi.approvePayment(selectedPayment._id, approvalNotes);
      message.success('Đã duyệt thanh toán thành công!');
      setApproveModalVisible(false);
      setApprovalNotes('');
      setSelectedPayment(null);
      fetchPayments(activeTab);
    } catch (error) {
      message.error(error.response?.data?.message || 'Duyệt thanh toán thất bại');
    }
  };

  const handleReject = async () => {
    if (!selectedPayment) return;

    if (!rejectionReason.trim()) {
      message.error('Vui lòng nhập lý do từ chối');
      return;
    }

    try {
      await billApi.rejectPayment(selectedPayment._id, rejectionReason);
      message.success('Đã từ chối thanh toán');
      setRejectModalVisible(false);
      setRejectionReason('');
      setSelectedPayment(null);
      fetchPayments(activeTab);
    } catch (error) {
      message.error(error.response?.data?.message || 'Từ chối thanh toán thất bại');
    }
  };

  const showApproveConfirm = (record) => {
    setSelectedPayment(record);
    setApproveModalVisible(true);
  };

  const showRejectModal = (record) => {
    setSelectedPayment(record);
    setRejectModalVisible(true);
  };

  const columns = [
    {
      title: 'Thông tin người thuê',
      key: 'renter',
      render: (_, record) => (
        <div>
          <div><strong>{record.renterId?.name || 'N/A'}</strong></div>
          <div style={{ fontSize: '12px', color: '#666' }}>{record.renterId?.email || 'N/A'}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>{record.renterId?.phone || 'N/A'}</div>
        </div>
      ),
    },
    {
      title: 'Phòng',
      dataIndex: ['contractId', 'roomId', 'name'],
      key: 'room',
      render: (name) => name || 'N/A',
    },
    {
      title: 'Số tiền',
      dataIndex: 'totalAmount',
      key: 'amount',
      render: (amount) => (
        <span style={{ fontWeight: 'bold', color: '#1890ff' }}>
          {amount?.toLocaleString('vi-VN')} VNĐ
        </span>
      ),
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      render: (type) => <Tag color={type === 'deposit' ? 'gold' : 'blue'}>{type}</Tag>,
    },
    {
      title: 'Thời gian tải lên',
      dataIndex: 'evidenceUploadedAt',
      key: 'uploadedAt',
      render: (date) => date ? moment(date).format('DD/MM/YYYY HH:mm') : 'N/A',
    },
    {
      title: 'Chứng từ',
      dataIndex: 'paymentEvidence',
      key: 'evidence',
      render: (url) => url ? (
        <Button
          type="link"
          icon={<FileImageOutlined />}
          onClick={() => setEvidencePreview(url)}
        >
          Xem chứng từ
        </Button>
      ) : (
        <Text type="secondary">Chưa có</Text>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => {
        if (activeTab === 'pending_approval') {
          return (
            <Space>
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={() => showApproveConfirm(record)}
              >
                Duyệt
              </Button>
              <Button
                danger
                icon={<CloseCircleOutlined />}
                onClick={() => showRejectModal(record)}
              >
                Từ chối
              </Button>
            </Space>
          );
        }
        if (activeTab === 'rejected' && record.rejectionReason) {
          return (
            <Button
              type="text"
              onClick={() => {
                Modal.info({
                  title: 'Lý do từ chối',
                  content: record.rejectionReason,
                });
              }}
            >
              Xem lý do
            </Button>
          );
        }
        return null;
      },
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ color: '#4739f0', fontSize: '32px', fontWeight: '700', margin: 0 }}>
            Quản lý thanh toán
          </h2>
          <Button icon={<ReloadOutlined />} onClick={() => fetchPayments(activeTab)}>
            Tải lại
          </Button>
        </div>

        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane
            tab={
              <Badge count={activeTab === 'pending_approval' ? payments.length : 0} offset={[10, 0]}>
                Chờ duyệt
              </Badge>
            }
            key="pending_approval"
          />
          <TabPane tab="Đã duyệt" key="approved" />
          <TabPane tab="Đã từ chối" key="rejected" />
        </Tabs>

        <Table
          columns={columns}
          dataSource={payments}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* Approve Modal */}
      <Modal
        title="Duyệt thanh toán"
        open={approveModalVisible}
        onOk={handleApprove}
        onCancel={() => {
          setApproveModalVisible(false);
          setApprovalNotes('');
          setSelectedPayment(null);
        }}
        okText="Duyệt"
        okButtonProps={{ icon: <CheckCircleOutlined /> }}
      >
        {selectedPayment && (
          <>
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Người thuê">
                {selectedPayment.renterId?.name}
              </Descriptions.Item>
              <Descriptions.Item label="Số tiền">
                {selectedPayment.totalAmount?.toLocaleString('vi-VN')} VNĐ
              </Descriptions.Item>
              <Descriptions.Item label="Loại">
                {selectedPayment.type}
              </Descriptions.Item>
            </Descriptions>
            <div style={{ marginTop: 16 }}>
              <label>Ghi chú (tùy chọn):</label>
              <TextArea
                rows={3}
                placeholder="Nhập ghi chú duyệt thanh toán..."
                value={approvalNotes}
                onChange={(e) => setApprovalNotes(e.target.value)}
              />
            </div>
          </>
        )}
      </Modal>

      {/* Reject Modal */}
      <Modal
        title="Từ chối thanh toán"
        open={rejectModalVisible}
        onOk={handleReject}
        onCancel={() => {
          setRejectModalVisible(false);
          setRejectionReason('');
          setSelectedPayment(null);
        }}
        okText="Từ chối"
        okButtonProps={{ danger: true, icon: <CloseCircleOutlined /> }}
      >
        {selectedPayment && (
          <>
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Người thuê">
                {selectedPayment.renterId?.name}
              </Descriptions.Item>
              <Descriptions.Item label="Số tiền">
                {selectedPayment.totalAmount?.toLocaleString('vi-VN')} VNĐ
              </Descriptions.Item>
            </Descriptions>
            <div style={{ marginTop: 16 }}>
              <label>
                Lý do từ chối <span style={{ color: 'red' }}>*</span>:
              </label>
              <TextArea
                rows={4}
                placeholder="Vui lòng nhập lý do từ chối thanh toán..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                required
              />
            </div>
          </>
        )}
      </Modal>

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

export default PaymentApprovalDashboard;
