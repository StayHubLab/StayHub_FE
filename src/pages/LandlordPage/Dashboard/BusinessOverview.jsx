import React, { useState, useEffect } from "react";
import { message, Spin } from "antd";
import "./BusinessOverview.css";
import {
  HddOutlined,
  PieChartOutlined,
  HolderOutlined,
  KeyOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../../contexts/AuthContext";
import dashboardApi from "../../../services/api/dashboardApi";
import roomApi from "../../../services/api/roomApi";

const BusinessOverview = () => {
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [overviewData, setOverviewData] = useState([
    {
      id: 1,
      title: "Tổng số phòng",
      value: "0",
      icon: (
        <div className="overview-icon">
          <HddOutlined />
        </div>
      ),
    },
    {
      id: 2,
      title: "Phòng đang thuê",
      value: "0",
      icon: (
        <div className="overview-icon">
          <KeyOutlined />
        </div>
      ),
    },
    {
      id: 3,
      title: "Phòng trống",
      value: "0",
      icon: (
        <div className="overview-icon">
          <HolderOutlined />
        </div>
      ),
    },
    {
      id: 4,
      title: "Tỷ lệ lấp đầy",
      value: "0%",
      icon: (
        <div className="overview-icon">
          <PieChartOutlined />
        </div>
      ),
    },
  ]);

  // Load dashboard statistics from API
  useEffect(() => {
    if (isAuthenticated && user && user.role === "landlord") {
      loadDashboardData();
    }
  }, [isAuthenticated, user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      const [businessResponse, roomResponse] = await Promise.allSettled([
        dashboardApi.getBusinessOverview(),
        dashboardApi.getRoomStatistics(),
      ]);

      // Helper to safely extract number from many possible shapes
      const firstNumber = (candidates, fallback = 0) => {
        for (const value of candidates) {
          const num = Number(value);
          if (Number.isFinite(num) && num >= 0) return num;
        }
        return fallback;
      };

      const br =
        businessResponse.status === "fulfilled" &&
        businessResponse.value?.success
          ? businessResponse.value
          : null;
      const rr =
        roomResponse.status === "fulfilled" && roomResponse.value?.success
          ? roomResponse.value
          : null;

      const bd = br?.data || {};
      const rd = rr?.data || {};

      // Try multiple shapes for totalRooms and occupiedRooms
      let totalRooms = firstNumber([
        rd.totalRooms,
        rd.roomsTotal,
        rd.total,
        rd?.stats?.totalRooms,
        bd?.totalRooms,
        bd?.rooms?.total,
      ]);

      let occupiedRooms = firstNumber([
        rd.occupiedRooms,
        rd.rentedRooms,
        rd?.stats?.occupiedRooms,
        rd?.stats?.rentedRooms,
        bd?.occupiedRooms,
        bd?.rooms?.occupied,
      ]);

      // Always use room API with landlordId filter for accurate landlord-specific data
      if (true) {
        // Always use this approach to get landlord's rooms only
        try {
          // 1) Total rooms via pagination total
          const totalResp = await roomApi.getRooms({
            page: 1,
            limit: 1,
            landlordId: user._id,
          });
          totalRooms = firstNumber(
            [
              totalResp?.data?.pagination?.total,
              Array.isArray(totalResp?.data?.rooms)
                ? totalResp.data.rooms.length
                : 0,
            ],
            totalRooms
          );

          // 2) Occupied (status=rented)
          const rentedResp = await roomApi.getRooms({
            page: 1,
            limit: 1,
            landlordId: user._id,
            status: "rented",
          });
          occupiedRooms = firstNumber(
            [
              rentedResp?.data?.pagination?.total,
              Array.isArray(rentedResp?.data?.rooms)
                ? rentedResp.data.rooms.filter((r) => r.status === "rented")
                    .length
                : 0,
            ],
            occupiedRooms
          );
        } catch (fallbackError) {
          try {
            const bulkResp = await roomApi.getRooms({
              page: 1,
              limit: 500,
              landlordId: user._id,
            });
            const list = Array.isArray(bulkResp?.data?.rooms)
              ? bulkResp.data.rooms
              : [];
            totalRooms = list.length || totalRooms;
            occupiedRooms =
              list.filter((r) => r.status === "rented").length || occupiedRooms;
          } catch (_) {
            // keep existing values
          }
        }
      }

      const vacantRooms = Math.max(0, totalRooms - occupiedRooms);
      const occupancyRate =
        totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

      setOverviewData([
        {
          id: 1,
          title: "Tổng số phòng",
          value: totalRooms.toString(),
          icon: (
            <div className="overview-icon">
              <HddOutlined />
            </div>
          ),
        },
        {
          id: 2,
          title: "Phòng đang thuê",
          value: occupiedRooms.toString(),
          icon: (
            <div className="overview-icon">
              <KeyOutlined />
            </div>
          ),
        },
        {
          id: 3,
          title: "Phòng trống",
          value: vacantRooms.toString(),
          icon: (
            <div className="overview-icon">
              <HolderOutlined />
            </div>
          ),
        },
        {
          id: 4,
          title: "Tỷ lệ lấp đầy",
          value: `${occupancyRate}%`,
          icon: (
            <div className="overview-icon">
              <PieChartOutlined />
            </div>
          ),
        },
      ]);
    } catch (error) {
      message.error("Có lỗi xảy ra khi tải dữ liệu dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="business-overview">
        <div>
          <h2 className="overview-header">Dashboard</h2>
        </div>
        <div className="overview-title">
          Tổng quan hoạt động kinh doanh của bạn
        </div>
        <div
          className="overview-cards-container"
          style={{
            justifyContent: "center",
            alignItems: "center",
            minHeight: "200px",
          }}
        >
          <Spin size="large" />
        </div>
      </div>
    );
  }

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
