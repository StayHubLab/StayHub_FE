import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Card, Tabs, Select, Row, Col } from "antd";
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
  Cell,
} from "recharts";
import "./RevenueChart.css";
import { useAuth } from "../../../contexts/AuthContext";
import billApi from "../../../services/api/billApi";

const { TabPane } = Tabs;
const { Option } = Select;

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="tooltip-label">{`${label}`}</p>
        {payload.map((entry, index) => (
          <p
            key={index}
            className="tooltip-value"
            style={{ color: entry.color }}
          >
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
      color: PropTypes.string,
    })
  ),
  label: PropTypes.string,
};

const RevenueChart = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [activeTab, setActiveTab] = useState("overview");
  const { user } = useAuth();
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!user?._id) return;
      try {
        setLoading(true);
        const res = await billApi.listByHost(user._id);
        const list = Array.isArray(res?.data)
          ? res.data
          : res?.data?.items || [];
        setBills(list || []);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user?._id]);

  const calcAmount = (b) => {
    if (typeof b?.totalAmount === "number") return b.totalAmount;
    const a = b?.amount || {};
    return (
      (a.rent || 0) + (a.electricity || 0) + (a.water || 0) + (a.service || 0)
    );
  };

  const monthlyRevenueData = useMemo(() => {
    const nowYear = new Date().getFullYear();
    const arr = Array.from({ length: 12 }, (_, i) => ({
      name: `T${i + 1}`,
      revenue: 0,
      expenses: 0,
      profit: 0,
    }));
    (bills || []).forEach((b) => {
      const dt = new Date(b.paidAt || b.updatedAt || b.createdAt);
      if (b.status !== "paid" || dt.getFullYear() !== nowYear) return;
      const m = dt.getMonth();
      const amt = calcAmount(b);
      if (b.type === "refund") arr[m].expenses += amt;
      else arr[m].revenue += amt;
    });
    arr.forEach((x) => (x.profit = x.revenue - x.expenses));
    return arr;
  }, [bills]);

  const weeklyRevenueData = useMemo(() => {
    // Simple 4-week split of current month
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const weeks = Array.from({ length: 4 }, (_, i) => ({
      name: `Tuần ${i + 1}`,
      revenue: 0,
      expenses: 0,
      profit: 0,
    }));
    (bills || []).forEach((b) => {
      if (b.status !== "paid") return;
      const dt = new Date(b.paidAt || b.updatedAt || b.createdAt);
      if (
        dt.getMonth() !== now.getMonth() ||
        dt.getFullYear() !== now.getFullYear()
      )
        return;
      const day = Math.floor((dt - start) / (1000 * 60 * 60 * 24));
      const idx = Math.min(3, Math.floor(day / 7));
      const amt = calcAmount(b);
      if (b.type === "refund") weeks[idx].expenses += amt;
      else weeks[idx].revenue += amt;
    });
    weeks.forEach((w) => (w.profit = w.revenue - w.expenses));
    return weeks;
  }, [bills]);

  const yearlyRevenueData = useMemo(() => {
    const map = new Map();
    (bills || []).forEach((b) => {
      if (b.status !== "paid") return;
      const dt = new Date(b.paidAt || b.updatedAt || b.createdAt);
      const y = dt.getFullYear();
      if (!map.has(y))
        map.set(y, { name: String(y), revenue: 0, expenses: 0, profit: 0 });
      const row = map.get(y);
      const amt = calcAmount(b);
      if (b.type === "refund") row.expenses += amt;
      else row.revenue += amt;
      row.profit = row.revenue - row.expenses;
    });
    return Array.from(map.values()).sort(
      (a, b) => Number(a.name) - Number(b.name)
    );
  }, [bills]);

  const roomTypeRevenueData = useMemo(() => {
    // Distribution by bill type for current year
    const nowYear = new Date().getFullYear();
    const counters = { monthly: 0, deposit: 0, refund: 0, other: 0 };
    (bills || []).forEach((b) => {
      const dt = new Date(b.paidAt || b.updatedAt || b.createdAt);
      if (b.status !== "paid" || dt.getFullYear() !== nowYear) return;
      const amt = calcAmount(b);
      if (b.type === "monthly") counters.monthly += amt;
      else if (b.type === "deposit") counters.deposit += amt;
      else if (b.type === "refund") counters.refund += amt;
      else counters.other += amt;
    });
    const total = Object.values(counters).reduce((s, v) => s + v, 0) || 1;
    return [
      {
        name: "Hàng tháng",
        value: Math.round((counters.monthly / total) * 100),
        color: "#4739F0",
      },
      {
        name: "Đặt cọc",
        value: Math.round((counters.deposit / total) * 100),
        color: "#34D399",
      },
      {
        name: "Hoàn tiền",
        value: Math.round((counters.refund / total) * 100),
        color: "#FAC227",
      },
      {
        name: "Khác",
        value: Math.round((counters.other / total) * 100),
        color: "#6366F1",
      },
    ];
  }, [bills]);

  const getCurrentData = () => {
    switch (selectedPeriod) {
      case "week":
        return weeklyRevenueData;
      case "year":
        return yearlyRevenueData;
      default:
        return monthlyRevenueData;
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const totalRevenue = getCurrentData().reduce(
    (sum, item) => sum + item.revenue,
    0
  );
  const totalProfit = getCurrentData().reduce(
    (sum, item) => sum + item.profit,
    0
  );
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
              <div className="stat-value primary">
                {formatCurrency(totalRevenue)}
              </div>
            </div>
          </Col>
          <Col span={8}>
            <div className="stat-card">
              <div className="stat-title">Lợi nhuận</div>
              <div className="stat-value success">
                {formatCurrency(totalProfit)}
              </div>
            </div>
          </Col>
          <Col span={8}>
            <div className="stat-card">
              <div className="stat-title">Tỷ suất lợi nhuận</div>
              <div className="stat-value warning">{profitMargin}%</div>
            </div>
          </Col>
        </Row>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          className="revenue-tabs"
          style={{ width: "100%" }}
        >
          <TabPane tab="Tổng quan" key="overview">
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={getCurrentData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#666666" fontSize={12} />
                  <YAxis
                    stroke="#666666"
                    fontSize={12}
                    tickFormatter={(value) =>
                      `${(value / 1000000).toFixed(0)}M`
                    }
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#4739F0"
                    strokeWidth={3}
                    name="Doanh thu"
                    dot={{ r: 6, fill: "#4739F0" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="profit"
                    stroke="#34D399"
                    strokeWidth={3}
                    name="Lợi nhuận"
                    dot={{ r: 6, fill: "#34D399" }}
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
                  <XAxis dataKey="name" stroke="#666666" fontSize={12} />
                  <YAxis
                    stroke="#666666"
                    fontSize={12}
                    tickFormatter={(value) =>
                      `${(value / 1000000).toFixed(0)}M`
                    }
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
