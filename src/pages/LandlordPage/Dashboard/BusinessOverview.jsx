import React from 'react';
import './BusinessOverview.css';
import { HddOutlined, PieChartOutlined, HolderOutlined, KeyOutlined } from '@ant-design/icons';

const BusinessOverview = () => {
  const overviewData = [
    {
      id: 1,
      title: 'Tổng số phòng',
      value: '15',
      icon: (
        <div className="overview-icon">
          <HddOutlined />
        </div>
      )
    },
    {
      id: 2,
      title: 'Phòng đang thuê',
      value: '12',
      icon: (
        <div className="overview-icon">
          <KeyOutlined />
        </div>
      )
    },
    {
      id: 3,
      title: 'Phòng trống',
      value: '3',
      icon: (
        <div className="overview-icon">
          <HolderOutlined />
        </div>
      )
    },
    {
      id: 4,
      title: 'Tỷ lệ lấp đầy',
      value: '80%',
      icon: (
        <div className="overview-icon">
            <PieChartOutlined />
        </div>
      )
    }
  ];

  return (
    <div className="business-overview">
        <div>
        <h2 className="overview-header">Dashboard</h2>
        </div>
      <div className="overview-title">
        Tổng quan hoạt động kinh doanh của bạn
      </div>
      
      <div className="overview-cards-container">
        {overviewData.map((item) => (
          <div key={item.id} className="overview-card">
            <div className="card-content">
              <div className="card-info">
                <div className="card-title">{item.title}</div>
                <div className="card-value">{item.value}</div>
              </div>
              {item.icon}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BusinessOverview;