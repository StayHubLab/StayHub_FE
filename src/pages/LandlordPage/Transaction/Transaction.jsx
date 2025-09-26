import React, { useEffect, useMemo, useState } from "react";
import { Table, Typography, Tag, DatePicker, Select, Tabs, Space } from "antd";
import billApi from "../../../services/api/billApi";
import { useAuth } from "../../../contexts/AuthContext";
import "./Transaction.css";

const { Title } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { TabPane } = Tabs;

const Transaction = () => {
  const { user } = useAuth();
  const [allBills, setAllBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeType, setActiveType] = useState("all");
  const [dateRange, setDateRange] = useState([]);
  const [kindFilter, setKindFilter] = useState("all");

  const columns = [
    {
      title: "Ngày hóa đơn",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (v) => (v ? new Date(v).toLocaleString("vi-VN") : "-"),
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      render: (t) => {
        const color =
          t === "deposit" ? "orange" : t === "refund" ? "purple" : "blue";
        const text =
          t === "deposit"
            ? "Đặt cọc"
            : t === "refund"
            ? "Hoàn tiền"
            : t === "monthly"
            ? "Hàng tháng"
            : "Khác";
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "Phòng",
      dataIndex: "roomName",
      key: "roomName",
    },
    {
      title: "Người thuê",
      dataIndex: "renterName",
      key: "renterName",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (s) => {
        const map = {
          paid: { c: "green", t: "Đã thanh toán" },
          pending: { c: "gold", t: "Chờ thanh toán" },
          overdue: { c: "red", t: "Quá hạn" },
          failed: { c: "volcano", t: "Thất bại" },
        };
        const m = map[s] || { c: "default", t: s };
        return <Tag color={m.c}>{m.t}</Tag>;
      },
    },
    {
      title: "Tiền thuê",
      dataIndex: "amountRent",
      key: "amountRent",
      render: (v) => (v ? `${v.toLocaleString()} VNĐ` : "0 VNĐ"),
    },
    {
      title: "Điện / Nước / Dịch vụ",
      dataIndex: "amountOthers",
      key: "amountOthers",
      render: (v) => v,
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (v) => <b>{(v || 0).toLocaleString()} VNĐ</b>,
    },
  ];

  const fetchBills = async () => {
    if (!user?._id) return;
    try {
      setLoading(true);
      // Fetch bills for landlord (all bills from landlord's properties)
      const resp = await billApi.listByHost(user._id);
      const bills = Array.isArray(resp?.data)
        ? resp.data
        : resp?.data?.bills || resp?.data?.items || [];
      setAllBills(bills);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id]);

  const mapped = useMemo(() => {
    const list = (allBills || []).map((b) => {
      const rent = b.amount?.rent || 0;
      const elec = b.amount?.electricity || 0;
      const water = b.amount?.water || 0;
      const service = b.amount?.service || 0;
      const room =
        b.contractId?.roomId?.name ||
        b.contractId?.roomId?.code ||
        b.contractId?.roomId?.roomCode ||
        "N/A";
      const renterName =
        b.contractId?.renterId?.name || b.renterId?.name || "N/A";
      return {
        key: b._id,
        _raw: b,
        createdAt: b.createdAt,
        type: b.type,
        status: b.status,
        roomName: room,
        renterName,
        amountRent: rent,
        amountOthers: `${elec.toLocaleString()} / ${water.toLocaleString()} / ${service.toLocaleString()} VNĐ`,
        totalAmount: b.totalAmount ?? rent + elec + water + service,
      };
    });

    // Filter by date range
    const [start, end] = dateRange || [];
    const filteredByDate =
      start && end
        ? list.filter((row) => {
            const d = row.createdAt ? new Date(row.createdAt).getTime() : 0;
            return (
              d >= start.startOf("day").toDate().getTime() &&
              d <= end.endOf("day").toDate().getTime()
            );
          })
        : list;

    // Filter by kind if needed (income/expense). For bills, treat paid/received as income for landlord; here we keep it neutral.
    const finalList = filteredByDate;
    return finalList;
  }, [allBills, dateRange]);

  const dataByType = useMemo(() => {
    return {
      all: mapped,
      monthly: mapped.filter((r) => r.type === "monthly"),
      deposit: mapped.filter((r) => r.type === "deposit"),
      refund: mapped.filter((r) => r.type === "refund"),
      other: mapped.filter(
        (r) => !["monthly", "deposit", "refund"].includes(r.type)
      ),
    };
  }, [mapped]);

  return (
    <div className="transaction-container">
      <div className="transaction-header">
        <Title
          style={{ color: "#4739f0", fontSize: "40px", fontWeight: 800 }}
          level={2}
        >
          Giao dịch
        </Title>
        <div className="transaction-filters">
          <Space>
            <RangePicker
              placeholder={["Từ ngày", "Đến ngày"]}
              onChange={setDateRange}
            />
            <Select
              value={kindFilter}
              onChange={setKindFilter}
              style={{ width: 140 }}
            >
              <Option value="all">Tất cả</Option>
              <Option value="monthly">Hàng tháng</Option>
              <Option value="deposit">Đặt cọc</Option>
              <Option value="refund">Hoàn tiền</Option>
              <Option value="other">Khác</Option>
            </Select>
          </Space>
        </div>
      </div>

      <Tabs activeKey={activeType} onChange={setActiveType}>
        <TabPane tab="Tất cả" key="all">
          <Table
            loading={loading}
            columns={columns}
            dataSource={dataByType.all}
            pagination={{ pageSize: 10 }}
          />
        </TabPane>
        <TabPane tab="Hàng tháng" key="monthly">
          <Table
            loading={loading}
            columns={columns}
            dataSource={dataByType.monthly}
            pagination={{ pageSize: 10 }}
          />
        </TabPane>
        <TabPane tab="Đặt cọc" key="deposit">
          <Table
            loading={loading}
            columns={columns}
            dataSource={dataByType.deposit}
            pagination={{ pageSize: 10 }}
          />
        </TabPane>
        <TabPane tab="Hoàn tiền" key="refund">
          <Table
            loading={loading}
            columns={columns}
            dataSource={dataByType.refund}
            pagination={{ pageSize: 10 }}
          />
        </TabPane>
        <TabPane tab="Khác" key="other">
          <Table
            loading={loading}
            columns={columns}
            dataSource={dataByType.other}
            pagination={{ pageSize: 10 }}
          />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Transaction;
