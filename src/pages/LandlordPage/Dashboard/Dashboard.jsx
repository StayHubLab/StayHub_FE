import React from 'react';
import { Card, Row, Col, Statistic, Typography } from 'antd';
import { HomeOutlined, TeamOutlined, DollarOutlined, EyeOutlined } from '@ant-design/icons';
import './Dashboard.css';

const { Title } = Typography;

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <Title level={2}>Dashboard</Title>
        <p>Tổng quan hoạt động kinh doanh</p>
      </div>
      
      <Row gutter={[16, 16]} className="dashboard-stats">
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tổng số phòng"
              value={12}
              prefix={<HomeOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Phòng đã thuê"
              value={8}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Doanh thu tháng"
              value={25000000}
              prefix={<DollarOutlined />}
              suffix="VNĐ"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Lượt xem"
              value={1128}
              prefix={<EyeOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;