import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, Tabs, Select, Row, Col } from 'antd';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import './RevenueChart.css';

const { TabPane } = Tabs;
const { Option } = Select;

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value);
  };

  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="tooltip-label">{`${label}`}</p>
        {payload.map((entry, index) => (
          <p key={index} className="tooltip-value" style={{ color: entry.color }}>
            {`${entry.name}: ${formatCurrency(entry.value)}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

CustomTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.number,
      color: PropTypes.string
    })
  ),
  label: PropTypes.string
};

const RevenueChart = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [activeTab, setActiveTab] = useState('overview');

  // Mock revenue data
  const monthlyRevenueData = [
    { name: 'T1', revenue: 45000000, expenses: 25000000, profit: 20000000 },
    { name: 'T2', revenue: 52000000, expenses: 28000000, profit: 24000000 },
    { name: 'T3', revenue: 48000000, expenses: 26000000, profit: 22000000 },
    { name: 'T4', revenue: 58000000, expenses: 32000000, profit: 26000000 },
    { name: 'T5', revenue: 62000000, expenses: 35000000, profit: 27000000 },
    { name: 'T6', revenue: 55000000, expenses: 30000000, profit: 25000000 },
    { name: 'T7', revenue: 68000000, expenses: 38000000, profit: 30000000 },
    { name: 'T8', revenue: 72000000, expenses: 40000000, profit: 32000000 },
    { name: 'T9', revenue: 65000000, expenses: 36000000, profit: 29000000 },
    { name: 'T10', revenue: 70000000, expenses: 39000000, profit: 31000000 },
    { name: 'T11', revenue: 75000000, expenses: 42000000, profit: 33000000 },
    { name: 'T12', revenue: 78000000, expenses: 45000000, profit: 33000000 }
  ];

  const weeklyRevenueData = [
    { name: 'Tuần 1', revenue: 15000000, expenses: 8000000, profit: 7000000 },
    { name: 'Tuần 2', revenue: 18000000, expenses: 10000000, profit: 8000000 },
    { name: 'Tuần 3', revenue: 16000000, expenses: 9000000, profit: 7000000 },
    { name: 'Tuần 4', revenue: 22000000, expenses: 12000000, profit: 10000000 }
  ];

  const yearlyRevenueData = [
    { name: '2022', revenue: 580000000, expenses: 320000000, profit: 260000000 },
    { name: '2023', revenue: 720000000, expenses: 400000000, profit: 320000000 },
    { name: '2024', revenue: 850000000, expenses: 480000000, profit: 370000000 }
  ];

  const roomTypeRevenueData = [
    { name: 'Phòng đơn', value: 35, color: '#4739F0' },
    { name: 'Phòng đôi', value: 45, color: '#34D399' },
    { name: 'Phòng VIP', value: 20, color: '#FAC227' }
  ];

  const getCurrentData = () => {
    switch (selectedPeriod) {
      case 'week':
        return weeklyRevenueData;
      case 'year':
        return yearlyRevenueData;
      default:
        return monthlyRevenueData;
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value);
  };

  const totalRevenue = getCurrentData().reduce((sum, item) => sum + item.revenue, 0);
  const totalProfit = getCurrentData().reduce((sum, item) => sum + item.profit, 0);
  const profitMargin = ((totalProfit / totalRevenue) * 100).toFixed(1);

  return (
    <div className="revenue-chart-container">
      <Card className="revenue-card">
        <div className="revenue-header">
          <h2 className="revenue-title">Báo cáo Doanh thu</h2>
          <Select
            value={selectedPeriod}
            onChange={setSelectedPeriod}
            className="period-select"
          >
            <Option value="week">Theo tuần</Option>
            <Option value="month">Theo tháng</Option>
            <Option value="year">Theo năm</Option>
          </Select>
        </div>

        <Row gutter={16} className="revenue-stats">
          <Col span={8}>
            <div className="stat-card">
              <div className="stat-title">Tổng doanh thu</div>
              <div className="stat-value primary">{formatCurrency(totalRevenue)}</div>
            </div>
          </Col>
          <Col span={8}>
            <div className="stat-card">
              <div className="stat-title">Lợi nhuận</div>
              <div className="stat-value success">{formatCurrency(totalProfit)}</div>
            </div>
          </Col>
          <Col span={8}>
            <div className="stat-card">
              <div className="stat-title">Tỷ suất lợi nhuận</div>
              <div className="stat-value warning">{profitMargin}%</div>
            </div>
          </Col>
        </Row>
        <Tabs activeKey={activeTab} onChange={setActiveTab} className="revenue-tabs" style={{ width: '100%' }}>
          <TabPane tab="Tổng quan" key="overview">
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={getCurrentData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#666666"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#666666"
                    fontSize={12}
                    tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#4739F0" 
                    strokeWidth={3}
                    name="Doanh thu"
                    dot={{ r: 6, fill: '#4739F0' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="profit" 
                    stroke="#34D399" 
                    strokeWidth={3}
                    name="Lợi nhuận"
                    dot={{ r: 6, fill: '#34D399' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabPane>

          <TabPane tab="So sánh chi phí" key="comparison">
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={getCurrentData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#666666"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#666666"
                    fontSize={12}
                    tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="revenue" fill="#4739F0" name="Doanh thu" />
                  <Bar dataKey="expenses" fill="#FAC227" name="Chi phí" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabPane>

          <TabPane tab="Theo loại phòng" key="roomType">
            <div className="chart-container">
              <Row>
                <Col span={12}>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={roomTypeRevenueData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                      >
                        {roomTypeRevenueData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                </Col>
                <Col span={12}>
                  <div className="legend-container">
                    {roomTypeRevenueData.map((item, index) => (
                      <div key={index} className="legend-item">
                        <div 
                          className="legend-color" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="legend-label">{item.name}</span>
                        <span className="legend-value">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </Col>
              </Row>
            </div>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default RevenueChart;