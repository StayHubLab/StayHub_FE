import React from 'react';
import { Button, Table, Typography, Space, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import './ManageRoom.css';

const { Title } = Typography;

const ManageRoom = () => {
  const columns = [
    {
      title: 'Tên phòng',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Giá thuê',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `${price.toLocaleString()} VNĐ`,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'available' ? 'green' : 'red'}>
          {status === 'available' ? 'Còn trống' : 'Đã thuê'}
        </Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: () => (
        <Space size="middle">
          <Button icon={<EditOutlined />} size="small">Sửa</Button>
          <Button icon={<DeleteOutlined />} size="small" danger>Xóa</Button>
        </Space>
      ),
    },
  ];

  const data = [
    {
      key: '1',
      name: 'Phòng 101',
      price: 3500000,
      status: 'available',
    },
    {
      key: '2',
      name: 'Phòng 102',
      price: 4000000,
      status: 'rented',
    },
  ];

  return (
    <div className="manage-room-container">
      <div className="manage-room-header">
        <Title level={2}>Quản lý phòng</Title>
        <Button type="primary" icon={<PlusOutlined />}>
          Thêm phòng mới
        </Button>
      </div>
      
      <Table columns={columns} dataSource={data} />
    </div>
  );
};

export default ManageRoom;