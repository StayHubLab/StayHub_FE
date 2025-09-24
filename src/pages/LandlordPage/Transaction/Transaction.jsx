import React from "react";
import { Table, Typography, Tag, DatePicker, Select } from "antd";
import "./Transaction.css";

const { Title } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const Transaction = () => {
  const columns = [
    {
      title: "Ngày giao dịch",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      render: (type) => (
        <Tag color={type === "income" ? "green" : "red"}>
          {type === "income" ? "Thu nhập" : "Chi phí"}
        </Tag>
      ),
    },
    {
      title: "Số tiền",
      dataIndex: "amount",
      key: "amount",
      render: (amount, record) => (
        <span
          style={{ color: record.type === "income" ? "#52c41a" : "#ff4d4f" }}
        >
          {record.type === "income" ? "+" : "-"}
          {amount.toLocaleString()} VNĐ
        </span>
      ),
    },
  ];

  const data = [
    {
      key: "1",
      date: "2024-01-15",
      description: "Tiền thuê phòng 102 - Tháng 1",
      type: "income",
      amount: 4000000,
    },
    {
      key: "2",
      date: "2024-01-10",
      description: "Sửa chữa điện nước",
      type: "expense",
      amount: 500000,
    },
  ];

  return (
    <div className="transaction-container">
      <div className="transaction-header">
        <Title level={2}>Giao dịch</Title>
        <div className="transaction-filters">
          <RangePicker placeholder={["Từ ngày", "Đến ngày"]} />
          <Select defaultValue="all" style={{ width: 120, marginLeft: 16 }}>
            <Option value="all">Tất cả</Option>
            <Option value="income">Thu nhập</Option>
            <Option value="expense">Chi phí</Option>
          </Select>
        </div>
      </div>

      <Table columns={columns} dataSource={data} />
    </div>
  );
};

export default Transaction;
