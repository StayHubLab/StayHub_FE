import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Select, Row, Col, message, Space } from 'antd';
import { PlusOutlined, SearchOutlined, FilterOutlined } from '@ant-design/icons';
import RoomTable from './components/RoomTable';
import AddRoomModal from './components/AddRoomModal';
import RoomDetailModal from './components/RoomDetailModal';
import './ManageRoom.css';

const { Option } = Select;
const { Search } = Input;

const ManageRoom = () => {
  // State management
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  
  // Modal states
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [detailActiveTab, setDetailActiveTab] = useState('1');

  // Mock data for demonstration
  const mockRooms = [
    {
      key: '1',
      roomCode: 'P101',
      name: 'Phòng cao cấp view biển',
      address: '123 Nguyễn Văn Linh, Quận 7, TP.HCM',
      type: 'Phòng trọ',
      area: 25,
      price: 3500000,
      status: 'available',
      amenities: ['Wi-Fi miễn phí', 'Điều hòa', 'Tủ lạnh', 'Máy giặt'],
      description: 'Phòng đẹp, thoáng mát, gần trường đại học',
      tenant: null,
      dueDate: null,
      images: ['/api/placeholder/300/200']
    },
    {
      key: '2',
      roomCode: 'A201',
      name: 'Studio hiện đại',
      address: '456 Lê Văn Việt, Quận 9, TP.HCM',
      type: 'Chung cư mini',
      area: 35,
      price: 4200000,
      status: 'occupied',
      amenities: ['Wi-Fi miễn phí', 'Điều hòa', 'Bếp', 'WC riêng', 'Ban công'],
      description: 'Studio đầy đủ tiện nghi, an ninh tốt',
      tenant: {
        name: 'Nguyễn Văn An',
        phone: '0901234567',
        email: 'an.nguyen@email.com',
        idCard: '123456789',
        occupation: 'Kỹ sư phần mềm',
        contractStart: '2024-01-15',
        contractEnd: '2024-12-31'
      },
      dueDate: '2025-02-15',
      images: ['/api/placeholder/300/200', '/api/placeholder/300/200']
    },
    {
      key: '3',
      roomCode: 'B102',
      name: 'Phòng gia đình',
      address: '789 Võ Văn Ngân, Thủ Đức, TP.HCM',
      type: 'Căn hộ',
      area: 45,
      price: 5800000,
      status: 'maintenance',
      amenities: ['Wi-Fi miễn phí', 'Điều hòa', 'Tủ lạnh', 'Máy giặt', 'Thang máy', 'Chỗ để xe'],
      description: 'Căn hộ 2 phòng ngủ, phù hợp gia đình nhỏ',
      tenant: null,
      dueDate: null,
      images: ['/api/placeholder/300/200']
    }
  ];

  // Initialize rooms data
  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setRooms(mockRooms);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter and search logic
  const filteredRooms = rooms.filter(room => {
    const matchesSearch = 
      room.name.toLowerCase().includes(searchText.toLowerCase()) ||
      room.roomCode.toLowerCase().includes(searchText.toLowerCase()) ||
      room.address.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || room.status === filterStatus;
    const matchesType = filterType === 'all' || room.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Sort rooms
  const sortedRooms = [...filteredRooms].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'price':
        return a.price - b.price;
      case 'area':
        return a.area - b.area;
      case 'roomCode':
        return a.roomCode.localeCompare(b.roomCode);
      default:
        return 0;
    }
  });

  // Event handlers
  const handleAddRoom = async (roomData) => {
    try {
      // Generate unique key
      const newKey = (rooms.length + 1).toString();
      const newRoom = {
        ...roomData,
        key: newKey,
        tenant: null,
        dueDate: null
      };
      
      // Add to rooms list
      setRooms([...rooms, newRoom]);
      message.success('Thêm phòng thành công!');
    } catch (error) {
      message.error('Có lỗi xảy ra khi thêm phòng!');
      throw error;
    }
  };

  const handleViewRoom = (room) => {
    setSelectedRoom(room);
    setDetailActiveTab('1');
    setDetailModalVisible(true);
  };

  const handleEditRoom = (room) => {
    // For now, just show detail modal in edit mode
    setSelectedRoom(room);
    setDetailActiveTab('1');
    setDetailModalVisible(true);
    message.info('Chức năng chỉnh sửa đang được phát triển...');
  };

  const handleDeleteRoom = (roomKey) => {
    setRooms(rooms.filter(room => room.key !== roomKey));
    message.success('Xóa phòng thành công!');
  };

  const handleResetFilters = () => {
    setSearchText('');
    setFilterStatus('all');
    setFilterType('all');
    setSortBy('name');
  };

  const roomTypes = ['Phòng trọ', 'Chung cư mini', 'Homestay', 'Căn hộ', 'Nhà nguyên căn', 'Phòng trong nhà'];

  return (
    <div className="landlord-manage-room">
      {/* Header Section */}
      <Card className="landlord-room-header" bodyStyle={{ padding: '20px' }}>
        <Row justify="space-between" align="middle" className="landlord-header-row">
          <Col>
            <div className="landlord-header-title">
              <h2>Quản lý phòng</h2>
              <p className="landlord-header-subtitle">
                Tổng cộng: <strong>{rooms.length}</strong> phòng |{' '}
                Còn trống: <strong>{rooms.filter(r => r.status === 'available').length}</strong> |{' '}
                Đã thuê: <strong>{rooms.filter(r => r.status === 'occupied').length}</strong>
              </p>
            </div>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              size="large"
              onClick={() => setAddModalVisible(true)}
              className="landlord-add-room-btn"
            >
              Thêm phòng mới
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Filters Section */}
      <Card className="landlord-filters-card" bodyStyle={{ padding: '16px 20px' }}>
        <Row gutter={16} align="middle">
          <Col flex="auto">
            <Search
              placeholder="Tìm kiếm theo tên phòng, mã phòng, địa chỉ..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="landlord-search"
              size="large"
              prefix={<SearchOutlined />}
            />
          </Col>
          <Col>
            <Select
              placeholder="Trạng thái"
              value={filterStatus}
              onChange={setFilterStatus}
              className="landlord-filter-select"
              size="large"
            >
              <Option value="all">Tất cả trạng thái</Option>
              <Option value="available">Còn trống</Option>
              <Option value="occupied">Đã thuê</Option>
              <Option value="maintenance">Bảo trì</Option>
            </Select>
          </Col>
          <Col>
            <Select
              placeholder="Loại phòng"
              value={filterType}
              onChange={setFilterType}
              className="landlord-filter-select"
              size="large"
            >
              <Option value="all">Tất cả loại</Option>
              {roomTypes.map(type => (
                <Option key={type} value={type}>{type}</Option>
              ))}
            </Select>
          </Col>
          <Col>
            <Select
              placeholder="Sắp xếp"
              value={sortBy}
              onChange={setSortBy}
              className="landlord-filter-select"
              size="large"
            >
              <Option value="name">Theo tên</Option>
              <Option value="roomCode">Theo mã phòng</Option>
              <Option value="price">Theo giá</Option>
              <Option value="area">Theo diện tích</Option>
            </Select>
          </Col>
          <Col>
            <Space>
              <Button
                icon={<FilterOutlined />}
                onClick={handleResetFilters}
                className="landlord-reset-btn"
                size="large"
              >
                Đặt lại
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Room Table */}
      <Card className="landlord-table-card">
        <RoomTable
          rooms={sortedRooms}
          loading={loading}
          onView={handleViewRoom}
          onEdit={handleEditRoom}
          onDelete={handleDeleteRoom}
        />
      </Card>

      {/* Add Room Modal */}
      <AddRoomModal
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
        onSubmit={handleAddRoom}
      />

      {/* Room Detail Modal */}
      <RoomDetailModal
        visible={detailModalVisible}
        onClose={() => {
          setDetailModalVisible(false);
          setSelectedRoom(null);
        }}
        room={selectedRoom}
        activeTab={detailActiveTab}
        onTabChange={setDetailActiveTab}
      />
    </div>
  );
};

export default ManageRoom;
