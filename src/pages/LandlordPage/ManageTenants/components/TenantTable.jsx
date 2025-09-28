import React from 'react';
import PropTypes from 'prop-types';
import { Table, Avatar, Tag, Button, Tooltip, Typography } from 'antd';
import { 
  UserOutlined, 
  PhoneOutlined, 
  NotificationOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import './TenantTable.css';

const { Text } = Typography;

const TenantTable = ({ tenants, loading, onRemindPayment }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getStatusTag = (status) => {
    const statusConfig = {
      paid: { 
        label: 'Đã thanh toán', 
        color: 'success', 
        icon: <CheckCircleOutlined />,
        className: 'landlords-status-paid'
      },
      pending: { 
        label: 'Chưa thanh toán', 
        color: 'warning', 
        icon: <ExclamationCircleOutlined />,
        className: 'landlords-status-pending'
      },
      overdue: { 
        label: 'Quá hạn', 
        color: 'error', 
        icon: <ExclamationCircleOutlined />,
        className: 'landlords-status-overdue'
      },
      partial: { 
        label: 'Thanh toán một phần', 
        color: 'processing', 
        icon: <ExclamationCircleOutlined />,
        className: 'landlords-status-partial'
      }
    };
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <Tag 
        color={config.color} 
        icon={config.icon} 
        className={`landlords-status-tag ${config.className}`}
      >
        {config.label}
      </Tag>
    );
  };

  const columns = [
    {
      title: 'STT',
      dataIndex: 'serialNumber',
      key: 'serialNumber',
      width: 60,
      align: 'center',
      className: 'landlords-table-cell',
      render: (text, record, index) => (
        <span className="landlords-serial-number">{index + 1}</span>
      )
    },
    {
      title: 'Khách thuê',
      dataIndex: 'tenant',
      key: 'tenant',
      width: 200,
      className: 'landlords-table-cell',
      render: (_, record) => (
        <div className="landlords-tenant-info">
          <div className="landlords-tenant-header">
            <Avatar 
              size={40}
              src={record.tenant.avatar} 
              icon={<UserOutlined />}
              className="landlords-tenant-avatar"
            />
            <div className="landlords-tenant-details">
              <div className="landlords-tenant-name">{record.tenant.name}</div>
              <div className="landlords-tenant-phone">
                <PhoneOutlined className="landlords-phone-icon" />
                {record.tenant.phone}
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Phòng',
      dataIndex: 'roomNumber',
      key: 'roomNumber',
      width: 100,
      align: 'center',
      className: 'landlords-table-cell',
      render: (text) => (
        <div className="landlords-room-number">
          <Text strong className="landlords-room-code">{text}</Text>
        </div>
      )
    },
    {
      title: 'Tiền thuê/Tháng',
      dataIndex: 'rentAmount',
      key: 'rentAmount',
      width: 140,
      align: 'right',
      className: 'landlords-table-cell',
      render: (amount) => (
        <div className="landlords-rent-amount">
          {formatCurrency(amount)}
        </div>
      )
    },
    {
      title: 'Kỳ hạn',
      dataIndex: 'term',
      key: 'term',
      width: 120,
      align: 'center',
      className: 'landlords-table-cell',
      render: (term) => (
        <div className="landlords-term">
          <Text className="landlords-term-text">{term} tháng</Text>
        </div>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      width: 150,
      align: 'center',
      className: 'landlords-table-cell',
      render: (status) => getStatusTag(status)
    },
    {
      title: 'Hợp đồng',
      dataIndex: 'contract',
      key: 'contract',
      width: 180,
      className: 'landlords-table-cell',
      render: (_, record) => (
        <div className="landlords-contract-info">
          <div className="landlords-contract-dates">
            <div className="landlords-contract-start">
              Từ: {new Date(record.contract.startDate).toLocaleDateString('vi-VN')}
            </div>
            <div className="landlords-contract-end">
              Đến: {new Date(record.contract.endDate).toLocaleDateString('vi-VN')}
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 120,
      align: 'center',
      className: 'landlords-table-cell',
      render: (_, record) => {
        const canRemind = record.paymentStatus === 'pending' || record.paymentStatus === 'overdue';
        
        return (
          <div className="landlords-action-buttons">
            <Tooltip title={canRemind ? "Nhắc nhở thanh toán" : "Đã thanh toán"}>
              <Button
                type="primary"
                icon={<NotificationOutlined />}
                size="small"
                disabled={!canRemind}
                onClick={() => onRemindPayment(record)}
                className={`landlords-remind-btn ${canRemind ? 'landlords-remind-enabled' : 'landlords-remind-disabled'}`}
              >
                Nhắc nhở
              </Button>
            </Tooltip>
          </div>
        );
      }
    }
  ];

  return (
    <div className="landlords-tenant-table-container">
      <Table
        columns={columns}
        dataSource={tenants}
        loading={loading}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} của ${total} khách thuê`,
          className: 'landlords-pagination'
        }}
        className="landlords-tenant-table"
        scroll={{ x: 1000 }}
        rowClassName={(record) => {
          if (record.paymentStatus === 'overdue') return 'landlords-row-overdue';
          if (record.paymentStatus === 'pending') return 'landlords-row-pending';
          return 'landlords-row-normal';
        }}
      />
    </div>
  );
};

TenantTable.propTypes = {
  tenants: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  onRemindPayment: PropTypes.func.isRequired
};

export default TenantTable;