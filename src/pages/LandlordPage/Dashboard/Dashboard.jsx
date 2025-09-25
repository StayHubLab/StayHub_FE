import React from 'react';
import BusinessOverview from './BusinessOverview';
import RevenueChart from './RevenueChart';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <BusinessOverview />
      <RevenueChart />
      {/* Add more dashboard components here */}
    </div>
  );
};

export default Dashboard;

