import React from 'react';
import { Table, Typography, Space, Button, Tag } from 'antd';
import { EyeOutlined, EditOutlined } from '@ant-design/icons';
import './ManageTenants.css';

const { Title } = Typography;

const ManageTenants = () => {
  const columns = [
    {
      title: 'Tên người thuê',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Phòng',
      dataIndex: 'room',
      key: 'room',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'startDate',
      key: 'startDate',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'orange'}>
          {status === 'active' ? 'Đang thuê' : 'Sắp hết hạn'}
        </Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: () => (
        <Space size="middle">
          <Button icon={<EyeOutlined />} size="small">Xem</Button>
          <Button icon={<EditOutlined />} size="small">Sửa</Button>
        </Space>
      ),
    },
  ];

  const data = [
    {
      key: '1',
      name: 'Nguyễn Văn A',
      room: 'Phòng 102',
      phone: '0123456789',
      startDate: '2024-01-15',
      status: 'active',
    },
    {
      key: '2',
      name: 'Trần Thị B',
      room: 'Phòng 103',
      phone: '0987654321',
      startDate: '2024-02-01',
      status: 'active',
    },
  ];

  return (
    <div className="manage-tenants-container">
      <div className="manage-tenants-header">
        <Title level={2}>Quản lý thuê trọ</Title>
      </div>
      
      <Table columns={columns} dataSource={data} />
    </div>
  );
};

export default ManageTenants;