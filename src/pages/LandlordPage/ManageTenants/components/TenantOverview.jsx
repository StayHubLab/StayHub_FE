import React from 'react';
import PropTypes from 'prop-types';
import { Card, Row, Col, Statistic } from 'antd';
import { 
  UserOutlined, 
  DollarCircleOutlined, 
  CheckCircleOutlined, 
  ExclamationCircleOutlined 
} from '@ant-design/icons';
import './TenantOverview.css';

const TenantOverview = ({ overviewData }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const statisticsData = [
    {
      title: 'Tổng số khách thuê',
      value: overviewData.totalTenants,
      icon: <UserOutlined className="landlords-overview-icon landlords-icon-primary" />,
      className: 'landlords-stat-primary'
    },
    {
      title: 'Tiền thuê dự kiến tháng này',
      value: formatCurrency(overviewData.expectedRent),
      icon: <DollarCircleOutlined className="landlords-overview-icon landlords-icon-secondary" />,
      className: 'landlords-stat-secondary'
    },
    {
      title: 'Đã thu',
      value: formatCurrency(overviewData.collectedRent),
      icon: <CheckCircleOutlined className="landlords-overview-icon landlords-icon-success" />,
      className: 'landlords-stat-success'
    },
    {
      title: 'Còn lại',
      value: formatCurrency(overviewData.remainingRent),
      icon: <ExclamationCircleOutlined className="landlords-overview-icon landlords-icon-warning" />,
      className: 'landlords-stat-warning'
    }
  ];

  return (
    <div className="landlords-tenant-overview">
      <Row gutter={[24, 24]}>
        {statisticsData.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card className={`landlords-overview-card ${stat.className}`}>
              <div className="landlords-overview-content">
                <div className="landlords-overview-icon-wrapper">
                  {stat.icon}
                </div>
                <div className="landlords-overview-stats">
                  <Statistic
                    title={<span className="landlords-overview-title">{stat.title}</span>}
                    value={stat.value}
                    valueStyle={{ 
                      fontSize: '20px', 
                      fontWeight: '700',
                      color: '#1f1f1f'
                    }}
                    className="landlords-overview-statistic"
                  />
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

TenantOverview.propTypes = {
  overviewData: PropTypes.shape({
    totalTenants: PropTypes.number.isRequired,
    expectedRent: PropTypes.number.isRequired,
    collectedRent: PropTypes.number.isRequired,
    remainingRent: PropTypes.number.isRequired
  }).isRequired
};

export default TenantOverview;