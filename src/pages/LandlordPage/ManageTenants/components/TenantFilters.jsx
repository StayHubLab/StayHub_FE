import React from 'react';
import PropTypes from 'prop-types';
import { Card, Row, Col, Input, Select, Button, Space } from 'antd';
import { SearchOutlined, FilterOutlined, UserOutlined } from '@ant-design/icons';
import './TenantFilters.css';

const { Search } = Input;
const { Option } = Select;

const TenantFilters = ({
  searchText,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  roomFilter,
  onRoomFilterChange,
  sortBy,
  onSortChange,
  onResetFilters,
  availableRooms
}) => {
  return (
    <Card className="landlords-filters-card" bodyStyle={{ padding: '16px 20px' }}>
      <div className="landlords-filters-header">
        <div className="landlords-filters-title">
          <UserOutlined className="landlords-filters-icon" />
          <span>Tìm kiếm và lọc khách thuê</span>
        </div>
      </div>
      
      <Row gutter={16} align="middle" className="landlords-filters-row">
        <Col xs={24} sm={24} md={8} lg={8}>
          <Search
            placeholder="Tìm kiếm theo tên, số điện thoại, phòng..."
            value={searchText}
            onChange={(e) => onSearchChange(e.target.value)}
            className="landlords-search"
            size="large"
            prefix={<SearchOutlined />}
            allowClear
          />
        </Col>
        
        <Col xs={12} sm={8} md={4} lg={4}>
          <Select
            placeholder="Trạng thái"
            value={statusFilter}
            onChange={onStatusFilterChange}
            className="landlords-filter-select"
            size="large"
            allowClear
          >
            <Option value="">Tất cả trạng thái</Option>
            <Option value="paid">Đã thanh toán</Option>
            <Option value="pending">Chưa thanh toán</Option>
            <Option value="overdue">Quá hạn</Option>
            <Option value="partial">Thanh toán một phần</Option>
          </Select>
        </Col>
        
        <Col xs={12} sm={8} md={4} lg={4}>
          <Select
            placeholder="Phòng"
            value={roomFilter}
            onChange={onRoomFilterChange}
            className="landlords-filter-select"
            size="large"
            allowClear
          >
            <Option value="">Tất cả phòng</Option>
            {availableRooms.map(room => (
              <Option key={room} value={room}>{room}</Option>
            ))}
          </Select>
        </Col>
        
        <Col xs={12} sm={8} md={4} lg={4}>
          <Select
            placeholder="Sắp xếp"
            value={sortBy}
            onChange={onSortChange}
            className="landlords-filter-select"
            size="large"
          >
            <Option value="name">Theo tên</Option>
            <Option value="room">Theo phòng</Option>
            <Option value="rent">Theo tiền thuê</Option>
            <Option value="status">Theo trạng thái</Option>
            <Option value="contractEnd">Theo hạn hợp đồng</Option>
          </Select>
        </Col>
        
        <Col xs={12} sm={24} md={4} lg={4}>
          <Space className="landlords-filter-actions">
            <Button
              icon={<FilterOutlined />}
              onClick={onResetFilters}
              className="landlords-reset-btn"
              size="large"
            >
              Đặt lại
            </Button>
          </Space>
        </Col>
      </Row>
    </Card>
  );
};

TenantFilters.propTypes = {
  searchText: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  statusFilter: PropTypes.string,
  onStatusFilterChange: PropTypes.func.isRequired,
  roomFilter: PropTypes.string,
  onRoomFilterChange: PropTypes.func.isRequired,
  sortBy: PropTypes.string.isRequired,
  onSortChange: PropTypes.func.isRequired,
  onResetFilters: PropTypes.func.isRequired,
  availableRooms: PropTypes.array.isRequired
};

export default TenantFilters;