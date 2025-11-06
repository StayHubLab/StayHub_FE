/**
 * @fileoverview Admin Dashboard Page
 * @created 2025-11-06
 * @file Dashboard.jsx
 * @description Admin dashboard displaying key metrics and statistics
 */

import React, { useState, useEffect } from "react";
import { getDashboardData } from "../../../services/api/adminApi";
import "./Dashboard.css";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await getDashboardData();
      setDashboardData(response.data);
      setError(null);
    } catch (err) {
      setError(
        err.response?.data?.message || "Không thể tải dữ liệu dashboard"
      );
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard">
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={fetchDashboardData} className="retry-button">
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  const { stats, userStats, engagement, mauTrend } = dashboardData || {};

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Dashboard Quản Trị</h1>
        <p className="dashboard-subtitle">Tổng quan hệ thống StayHub</p>
      </div>

      {/* User Traction Section */}
      <section className="dashboard-section">
        <h2 className="section-title">User Traction</h2>
        <div className="stats-grid">
          <div className="stat-card stat-card-primary">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <h3 style={{ color: "white" }}>Tổng số người dùng</h3>
              <p className="stat-number" style={{ color: "white" }}>
                {userStats?.totalUsers || 0}
              </p>
              <div className="stat-details">
                <span
                  className="stat-badge tenant"
                  style={{ color: "#1a5490", fontWeight: "700" }}
                >
                  Tenant: {userStats?.tenants || 0}
                </span>
                <span
                  className="stat-badge landlord"
                  style={{ color: "#1e6b3f", fontWeight: "700" }}
                >
                  Landlord: {userStats?.landlords || 0}
                </span>
              </div>
            </div>
          </div>

          <div className="stat-card stat-card-success">
            <div className="stat-icon">📈</div>
            <div className="stat-content">
              <h3 style={{ color: "white" }}>Người dùng mới tháng này</h3>
              <p className="stat-number" style={{ color: "white" }}>
                {userStats?.newUsersThisMonth || 0}
              </p>
              <span
                className="stat-growth positive"
                style={{ color: "#1e6b3f", fontWeight: "700" }}
              >
                {userStats?.growthRate || "0%"}
              </span>
            </div>
          </div>

          <div className="stat-card stat-card-warning">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <h3 style={{ color: "white" }}>Người dùng mới tháng trước</h3>
              <p className="stat-number" style={{ color: "white" }}>
                {userStats?.newUsersLastMonth || 0}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Engagement Traction Section */}
      {/* <section className="dashboard-section">
        <h2 className="section-title">Engagement Traction</h2>
        <div className="stats-grid">
          <div className="stat-card stat-card-success">
            <div className="stat-icon">🔥</div>
            <div className="stat-content">
              <h3 style={{ color: "white" }}>MAU (Monthly Active Users)</h3>
              <p className="stat-number" style={{ color: "white" }}>
                {engagement?.mau || 0}
              </p>
              <p className="stat-description" style={{ color: "white" }}>
                Người dùng hoạt động hàng tháng
              </p>
            </div>
          </div>

          <div className="stat-card stat-card-primary">
            <div className="stat-icon">🎯</div>
            <div className="stat-content">
              <h3 style={{ color: "white" }}>Retention Rate</h3>
              <p className="stat-number" style={{ color: "white" }}>
                {engagement?.retentionRate || "0%"}
              </p>
              <p className="stat-description" style={{ color: "white" }}>
                Tỷ lệ giữ chân người dùng
              </p>
            </div>
          </div>

          <div className="stat-card stat-card-warning">
            <div className="stat-icon">📱</div>
            <div className="stat-content">
              <h3 style={{ color: "white" }}>Số lượt truy cập website</h3>
              <p className="stat-number" style={{ color: "white" }}>
                {engagement?.pageViewsPerSession || 0}
              </p>
              <p className="stat-description" style={{ color: "white" }}>
                Trung bình mỗi phiên
              </p>
            </div>
          </div>

          <div className="stat-card stat-card-primary">
            <div className="stat-icon">⏱️</div>
            <div className="stat-content">
              <h3 style={{ color: "white" }}>Thời gian sử dụng trung bình</h3>
              <p className="stat-number" style={{ color: "white" }}>
                {engagement?.avgSessionDuration || "0m"}
              </p>
              <p className="stat-description" style={{ color: "white" }}>
                Mỗi phiên truy cập
              </p>
            </div>
          </div>

          <div className="stat-card stat-card-success">
            <div className="stat-icon">📅</div>
            <div className="stat-content">
              <h3 style={{ color: "white" }}>Daily Active Users</h3>
              <p className="stat-number" style={{ color: "white" }}>
                {engagement?.dailyActiveUsers || 0}
              </p>
              <p className="stat-description" style={{ color: "white" }}>
                Người dùng hoạt động hàng ngày
              </p>
            </div>
          </div>

          <div className="stat-card stat-card-warning">
            <div className="stat-icon">📆</div>
            <div className="stat-content">
              <h3 style={{ color: "white" }}>Weekly Active Users</h3>
              <p className="stat-number" style={{ color: "white" }}>
                {engagement?.weeklyActiveUsers || 0}
              </p>
              <p className="stat-description" style={{ color: "white" }}>
                Người dùng hoạt động hàng tuần
              </p>
            </div>
          </div>
        </div>
      </section> */}

      {/* MAU Trend Chart */}
      <section className="dashboard-section">
        <h2 className="section-title">Xu hướng MAU (6 tháng gần đây)</h2>
        <div className="chart-container">
          <div className="bar-chart">
            {mauTrend &&
              mauTrend.map((item, index) => (
                <div key={index} className="bar-item">
                  <div className="bar-wrapper">
                    <div
                      className="bar"
                      style={{
                        height: `${
                          (item.mau / Math.max(...mauTrend.map((i) => i.mau))) *
                          100
                        }%`,
                      }}
                    >
                      <span className="bar-value">{item.mau}</span>
                    </div>
                  </div>
                  <span className="bar-label">{item.month}</span>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* System Statistics */}
      <section className="dashboard-section">
        <h2 className="section-title">Thống kê hệ thống</h2>
        <div className="stats-grid">
          <div className="stat-card stat-card-primary">
            <div className="stat-icon">🏢</div>
            <div className="stat-content">
              <h3 style={{ color: "white" }}>Tòa nhà</h3>
              <p className="stat-number" style={{ color: "white" }}>
                {stats?.buildings?.total || 0}
              </p>
              <p className="stat-description" style={{ color: "white" }}>
                Mới tháng này: {stats?.buildings?.newThisMonth || 0}
              </p>
            </div>
          </div>

          <div className="stat-card stat-card-success">
            <div className="stat-icon">🚪</div>
            <div className="stat-content">
              <h3 style={{ color: "white" }}>Phòng trọ</h3>
              <p className="stat-number" style={{ color: "white" }}>
                {stats?.rooms?.total || 0}
              </p>
              <div className="stat-details">
                <span
                  className="stat-badge available"
                  style={{ color: "#1e6b3f", fontWeight: "700" }}
                >
                  Trống: {stats?.rooms?.available || 0}
                </span>
                <span
                  className="stat-badge occupied"
                  style={{ color: "#a32012", fontWeight: "700" }}
                >
                  Đã thuê: {stats?.rooms?.occupied || 0}
                </span>
              </div>
              <p className="stat-description" style={{ color: "white" }}>
                Tỷ lệ lấp đầy: {stats?.rooms?.occupancyRate || "0%"}
              </p>
            </div>
          </div>

          <div className="stat-card stat-card-warning">
            <div className="stat-icon">📅</div>
            <div className="stat-content">
              <h3 style={{ color: "white" }}>Đặt lịch xem phòng</h3>
              <p className="stat-number" style={{ color: "white" }}>
                {stats?.bookings?.total || 0}
              </p>
              <div className="stat-details">
                <span
                  className="stat-badge confirmed"
                  style={{ color: "#1e6b3f", fontWeight: "700" }}
                >
                  Xác nhận: {stats?.bookings?.confirmed || 0}
                </span>
                <span
                  className="stat-badge pending"
                  style={{ color: "#806b0a", fontWeight: "700" }}
                >
                  Chờ: {stats?.bookings?.pending || 0}
                </span>
              </div>
            </div>
          </div>

          <div className="stat-card stat-card-primary">
            <div className="stat-icon">📝</div>
            <div className="stat-content">
              <h3 style={{ color: "white" }}>Hợp đồng</h3>
              <p className="stat-number" style={{ color: "white" }}>
                {stats?.contracts?.total || 0}
              </p>
              <div className="stat-details">
                <span
                  className="stat-badge active"
                  style={{ color: "#1e6b3f", fontWeight: "700" }}
                >
                  Đang hoạt động: {stats?.contracts?.active || 0}
                </span>
              </div>
            </div>
          </div>

          <div className="stat-card stat-card-success">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <h3 style={{ color: "white" }}>Hóa đơn</h3>
              <p className="stat-number" style={{ color: "white" }}>
                {stats?.bills?.total || 0}
              </p>
              <div className="stat-details">
                <span
                  className="stat-badge paid"
                  style={{ color: "#1e6b3f", fontWeight: "700" }}
                >
                  Đã thanh toán: {stats?.bills?.paid || 0}
                </span>
                <span
                  className="stat-badge pending"
                  style={{ color: "#806b0a", fontWeight: "700" }}
                >
                  Chờ: {stats?.bills?.pending || 0}
                </span>
                <span
                  className="stat-badge overdue"
                  style={{ color: "#a32012", fontWeight: "700" }}
                >
                  Quá hạn: {stats?.bills?.overdue || 0}
                </span>
              </div>
              <p className="stat-description" style={{ color: "white" }}>
                Tỷ lệ thanh toán: {stats?.bills?.paymentRate || "0"}%
              </p>
            </div>
          </div>

          <div className="stat-card stat-card-warning">
            <div className="stat-icon">💵</div>
            <div className="stat-content">
              <h3 style={{ color: "white" }}>Doanh thu</h3>
              <p className="stat-number" style={{ color: "white" }}>
                {stats?.revenue?.total?.toLocaleString("vi-VN") || 0} đ
              </p>
              <p className="stat-description" style={{ color: "white" }}>
                Tháng này:{" "}
                {stats?.revenue?.thisMonth?.toLocaleString("vi-VN") || 0} đ
              </p>
            </div>
          </div>

          <div className="stat-card stat-card-primary">
            <div className="stat-icon">⭐</div>
            <div className="stat-content">
              <h3 style={{ color: "white" }}>Đánh giá</h3>
              <p className="stat-number" style={{ color: "white" }}>
                {stats?.reviews?.total || 0}
              </p>
              <p className="stat-description" style={{ color: "white" }}>
                Đánh giá trung bình: {stats?.reviews?.avgRating || 0} ⭐
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
