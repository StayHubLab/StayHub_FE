import React, { useEffect, useMemo, useState } from "react";
import {
  Table,
  Typography,
  Select,
  Space,
  Tag,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  message,
} from "antd";
import { PlusOutlined, DollarOutlined } from "@ant-design/icons";
import billApi from "../../../services/api/billApi";
import { useAuth } from "../../../contexts/AuthContext";

const { Title } = Typography;
const { Option } = Select;

const monthLabels = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
];

const PaymentsByRoom = () => {
  const { user } = useAuth();
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const [bills, setBills] = useState([]);
  const [createBillModal, setCreateBillModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [form] = Form.useForm();
  const [calculatedTotal, setCalculatedTotal] = useState(0);
  const [unitPrices, setUnitPrices] = useState({
    rent: 0,
    electricity: 0,
    water: 0,
    service: 0,
  });

  const fetchData = async () => {
    if (!user?._id) return;
    setLoading(true);
    try {
      const resp = await billApi.listByHost(user._id);
      const items = Array.isArray(resp?.data)
        ? resp.data
        : resp?.data?.items || [];
      console.log("Fetched bills data:", items);
      setBills(items || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id]);

  const handleCreateBill = (roomName) => {
    setSelectedRoom(roomName);
    setCreateBillModal(true);
    setCalculatedTotal(0);
    form.resetFields();

    // Prefill current month/year
    const now = new Date();
    form.setFieldsValue({ month: now.getMonth() + 1, year: now.getFullYear() });

    // Prefill unit prices from latest bill's contract/room
    const roomBills = bills.filter((b) => {
      const billRoomName =
        b?.contractId?.roomId?.name ||
        b?.contractId?.roomId?.code ||
        b?.contractId?.roomId?.roomCode ||
        "N/A";
      return billRoomName === roomName;
    });

    console.log("Room bills for", roomName, ":", roomBills);

    if (roomBills.length > 0) {
      const latest = roomBills[0];
      console.log("Latest bill data:", latest);
      console.log("Room data:", latest?.contractId?.roomId);
      console.log("Price data:", latest?.contractId?.roomId?.price);

      const price = latest?.contractId?.roomId?.price || {};
      const nextUnitPrices = {
        rent: Number(price?.rent) || 0,
        electricity: Number(price?.electricity) || 0,
        water: Number(price?.water) || 0,
        service: Number(price?.service) || 0,
      };

      console.log("Unit prices:", nextUnitPrices);
      setUnitPrices(nextUnitPrices);
      form.setFieldsValue({
        rent: nextUnitPrices.rent,
        service: nextUnitPrices.service,
        electricityQty: 0,
        waterQty: 0,
      });
    } else {
      console.log("No bills found for room:", roomName);
      setUnitPrices({ rent: 0, electricity: 0, water: 0, service: 0 });
      form.setFieldsValue({
        rent: 0,
        service: 0,
        electricityQty: 0,
        waterQty: 0,
      });
    }
  };

  const handleAmountChange = () => {
    const values = form.getFieldsValue();
    const electricityAmount =
      (values.electricityQty || 0) * (unitPrices.electricity || 0);
    const waterAmount = (values.waterQty || 0) * (unitPrices.water || 0);
    const total =
      (values.rent || 0) +
      electricityAmount +
      waterAmount +
      (values.service || 0);
    setCalculatedTotal(total);
    form.setFieldsValue({ totalAmount: total });
  };

  const handleSubmitBill = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      // Find the contract for this room to get contractId and renterId
      const roomBills = bills.filter((b) => {
        const billRoomName =
          b?.contractId?.roomId?.name ||
          b?.contractId?.roomId?.code ||
          b?.contractId?.roomId?.roomCode ||
          "N/A";
        return billRoomName === selectedRoom;
      });

      if (roomBills.length === 0) {
        message.error("Không tìm thấy hợp đồng cho phòng này");
        return;
      }

      const latestBill = roomBills[0]; // Get the most recent bill for this room
      const contractId = latestBill.contractId?._id || latestBill.contractId;
      const renterId = latestBill.renterId?._id || latestBill.renterId;

      // Calculate from quantities and unit prices
      const electricityAmount =
        (values.electricityQty || 0) * (unitPrices.electricity || 0);
      const waterAmount = (values.waterQty || 0) * (unitPrices.water || 0);
      const totalAmount =
        (values.rent || 0) +
        electricityAmount +
        waterAmount +
        (values.service || 0);

      await billApi.create({
        contractId,
        renterId,
        amount: {
          rent: values.rent || 0,
          electricity: electricityAmount,
          water: waterAmount,
          service: values.service || 0,
        },
        totalAmount,
        month: values.month,
        year: values.year,
        note:
          values.note ||
          `Hóa đơn tháng ${values.month}/${values.year} - Phòng ${selectedRoom}`,
        type: "monthly",
        status: "pending",
        dueDate: new Date(values.dueDate),
      });

      message.success("Đã tạo hóa đơn thành công");
      setCreateBillModal(false);
      fetchData(); // Refresh data
    } catch (error) {
      console.error("Error creating bill:", error);
      message.error("Không thể tạo hóa đơn");
    } finally {
      setLoading(false);
    }
  };

  const roomsMonthly = useMemo(() => {
    const byRoom = new Map();
    (bills || []).forEach((b) => {
      const createdAt = b.createdAt ? new Date(b.createdAt) : null;
      if (!createdAt || createdAt.getFullYear() !== Number(year)) return;
      const month = String(createdAt.getMonth() + 1).padStart(2, "0");
      const roomName =
        b?.contractId?.roomId?.name ||
        b?.contractId?.roomId?.code ||
        b?.contractId?.roomId?.roomCode ||
        "N/A";
      const key = roomName;
      if (!byRoom.has(key)) {
        byRoom.set(key, {
          room: roomName,
          months: {},
        });
      }
      const entry = byRoom.get(key);
      const monthBucket = entry.months[month] || {
        // totals by type
        monthlyTotal: 0,
        depositTotal: 0,
        // counts by status (overall)
        paid: 0,
        pending: 0,
        overdue: 0,
        failed: 0,
        // counts by type
        monthlyCount: 0,
        depositCount: 0,
      };
      const computedTotal =
        b.totalAmount ??
        (b.amount?.rent || 0) +
          (b.amount?.electricity || 0) +
          (b.amount?.water || 0) +
          (b.amount?.service || 0);
      if (b.type === "deposit") {
        monthBucket.depositTotal += computedTotal;
        monthBucket.depositCount += 1;
      } else if (b.type === "monthly") {
        monthBucket.monthlyTotal += computedTotal;
        monthBucket.monthlyCount += 1;
      } else {
        // treat other types as monthly aggregates for now
        monthBucket.monthlyTotal += computedTotal;
      }
      monthBucket[b.status] = (monthBucket[b.status] || 0) + 1;
      entry.months[month] = monthBucket;
    });
    return Array.from(byRoom.values());
  }, [bills, year]);

  const columns = useMemo(() => {
    const base = [
      {
        title: "Phòng",
        dataIndex: "room",
        key: "room",
        fixed: "left",
        render: (roomName) => (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span>{roomName}</span>
            <Button
              type="primary"
              size="small"
              icon={<PlusOutlined />}
              onClick={() => handleCreateBill(roomName)}
              title="Tạo hóa đơn mới"
            />
          </div>
        ),
      },
    ];
    const monthCols = monthLabels.map((m) => ({
      title: m,
      dataIndex: m,
      key: m,
      render: (val) => {
        if (!val) return "-";
        const tags = [];
        if (val.paid)
          tags.push(
            <Tag color="green" key="paid">
              Đã TT: {val.paid}
            </Tag>
          );
        if (val.pending)
          tags.push(
            <Tag color="gold" key="pending">
              Chờ: {val.pending}
            </Tag>
          );
        if (val.overdue)
          tags.push(
            <Tag color="red" key="overdue">
              Quá hạn: {val.overdue}
            </Tag>
          );
        if (val.failed)
          tags.push(
            <Tag color="volcano" key="failed">
              Thất bại: {val.failed}
            </Tag>
          );
        return (
          <div>
            <div>
              <b>Tiền tháng:</b>{" "}
              <b style={{ color: "#1677ff" }}>
                {(val.monthlyTotal || 0).toLocaleString()} VNĐ
              </b>{" "}
              {val.monthlyCount ? (
                <Tag color="blue">{val.monthlyCount}</Tag>
              ) : null}
            </div>
            <div>
              <b>Tiền cọc:</b>{" "}
              <b style={{ color: "#fa8c16" }}>
                {(val.depositTotal || 0).toLocaleString()} VNĐ
              </b>{" "}
              {val.depositCount ? (
                <Tag color="orange">{val.depositCount}</Tag>
              ) : null}
            </div>
            <div style={{ marginTop: 4 }}>{tags}</div>
          </div>
        );
      },
    }));
    return [...base, ...monthCols];
  }, []);

  const dataSource = useMemo(() => {
    return (roomsMonthly || []).map((r) => {
      const row = { key: r.room, room: r.room };
      monthLabels.forEach((m) => {
        row[m] = r.months[m];
      });
      return row;
    });
  }, [roomsMonthly]);

  return (
    <div style={{ padding: 16 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Title
            style={{ color: "#4739f0", fontSize: "40px", fontWeight: 800 }}
            level={2}
          >
            Quản lý thanh toán theo phòng / tháng
          </Title>
          <Space>
            <Select value={year} onChange={setYear} style={{ width: 120 }}>
              {[year - 1, year, year + 1].map((y) => (
                <Option key={y} value={y}>
                  {y}
                </Option>
              ))}
            </Select>
          </Space>
        </div>
        <Button
          type="primary"
          icon={<DollarOutlined />}
          onClick={() => setCreateBillModal(true)}
        >
          Tạo hóa đơn mới
        </Button>
      </div>
      <Table
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        scroll={{ x: 1200 }}
        pagination={{ pageSize: 20 }}
      />

      <Modal
        title="Tạo hóa đơn mới"
        open={createBillModal}
        onCancel={() => {
          setCreateBillModal(false);
          setSelectedRoom(null);
          setCalculatedTotal(0);
          form.resetFields();
        }}
        footer={
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <Button
              onClick={() => {
                setCreateBillModal(false);
                setSelectedRoom(null);
                setCalculatedTotal(0);
                form.resetFields();
              }}
            >
              Cancel
            </Button>
            <Button type="primary" loading={loading} onClick={handleSubmitBill}>
              OK
            </Button>
          </div>
        }
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Phòng" name="roomName" initialValue={selectedRoom}>
            <Input disabled value={selectedRoom} />
          </Form.Item>

          <div style={{ display: "flex", gap: 16 }}>
            <Form.Item
              label="Tháng"
              name="month"
              rules={[{ required: true, message: "Vui lòng chọn tháng" }]}
              style={{ flex: 1 }}
            >
              <InputNumber
                min={1}
                max={12}
                placeholder="Tháng (1-12)"
                style={{ width: "100%" }}
              />
            </Form.Item>

            <Form.Item
              label="Năm"
              name="year"
              rules={[{ required: true, message: "Vui lòng chọn năm" }]}
              style={{ flex: 1 }}
            >
              <InputNumber
                min={2020}
                max={2030}
                placeholder="Năm"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </div>

          <Form.Item
            label="Tiền thuê (VNĐ)"
            name="rent"
            rules={[{ required: true, message: "Vui lòng nhập tiền thuê" }]}
          >
            <InputNumber
              min={0}
              placeholder="Tiền thuê hàng tháng"
              style={{ width: "100%" }}
              onChange={handleAmountChange}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            />
          </Form.Item>

          <div
            style={{
              background: "#fafafa",
              padding: 12,
              borderRadius: 8,
              marginBottom: 12,
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: 8 }}>
              Giá cả & Trạng thái
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 16,
                color: "#555",
              }}
            >
              <div>
                Giá thuê:{" "}
                <b>{(unitPrices.rent || 0).toLocaleString()} ₫/tháng</b>
              </div>
              <div>
                Tiền điện:{" "}
                <b>{(unitPrices.electricity || 0).toLocaleString()} ₫/kWh</b>
              </div>
              <div>
                Tiền nước:{" "}
                <b>{(unitPrices.water || 0).toLocaleString()} ₫/m³</b>
              </div>
              <div>
                Phí dịch vụ:{" "}
                <b>{(unitPrices.service || 0).toLocaleString()} ₫/tháng</b>
              </div>
            </div>
          </div>

          <Form.Item label="Số điện (kWh)" name="electricityQty">
            <InputNumber
              min={0}
              placeholder="Nhập số điện (kWh)"
              style={{ width: "100%" }}
              onChange={handleAmountChange}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            />
          </Form.Item>

          <Form.Item label="Số nước (m³)" name="waterQty">
            <InputNumber
              min={0}
              placeholder="Nhập số nước (m³)"
              style={{ width: "100%" }}
              onChange={handleAmountChange}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            />
          </Form.Item>

          <Form.Item label="Phí dịch vụ (VNĐ)" name="service">
            <InputNumber
              min={0}
              placeholder="Phí dịch vụ"
              style={{ width: "100%" }}
              onChange={handleAmountChange}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            />
          </Form.Item>

          <Form.Item label="Tổng tiền (VNĐ)" name="totalAmount">
            <InputNumber
              min={0}
              placeholder="Tự động tính"
              style={{ width: "100%" }}
              disabled
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            />
          </Form.Item>

          <Form.Item
            label="Hạn thanh toán"
            name="dueDate"
            rules={[
              { required: true, message: "Vui lòng chọn hạn thanh toán" },
            ]}
          >
            <Input type="date" />
          </Form.Item>

          <Form.Item label="Ghi chú" name="note">
            <Input.TextArea rows={3} placeholder="Ghi chú cho hóa đơn" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PaymentsByRoom;
