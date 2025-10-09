import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Tabs,
  Table,
  Button,
  Tag,
  Space,
  message,
  Modal,
  Tooltip,
  Form,
  Input,
} from "antd";
import {
  CheckOutlined,
  FileAddOutlined,
  DollarOutlined,
  ReloadOutlined,
  SendOutlined,
} from "@ant-design/icons";
import contactRequestApi from "../../../services/api/contactRequestApi";
import roomApi from "../../../services/api/roomApi";
import { useAuth } from "../../../contexts/AuthContext";
import userApi from "../../../services/api/userApi";
import contractApi from "../../../services/api/contractApi";
import billApi from "../../../services/api/billApi";
import SignaturePad from "../../CommonPage/Main/Contract/SignaturePad";

// ---- Helpers ----
const fmtVND = (n) =>
  typeof n === "number"
    ? n.toLocaleString("vi-VN", { style: "currency", currency: "VND" })
    : "-";

const safeId = (objOrId) =>
  typeof objOrId === "object" ? objOrId?._id : objOrId;

const DEFAULT_PAGE_SIZE = 10;

// ---- Create Request Modal ----
const CreateRequestModal = ({ open, onClose, onCreated }) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [roomOptions, setRoomOptions] = useState([]);
  const [userOptions, setUserOptions] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const { user: authUser } = useAuth();

  const searchRooms = useCallback(
    async (keyword) => {
      if (!keyword) return setRoomOptions([]);
      try {
        // Prefer landlord rooms owned by current landlord; fallback to generic search
        let list = [];
        try {
          const resp = await roomApi.getRooms({
            keyword,
            limit: 3,
            page: 1,
            landlordId: authUser?._id || authUser?.id,
          });
          list = Array.isArray(resp?.data?.rooms)
            ? resp.data.rooms
            : Array.isArray(resp?.rooms)
            ? resp.rooms
            : Array.isArray(resp?.data)
            ? resp.data
            : [];
        } catch (_) {}
        if (!Array.isArray(list) || list.length === 0) {
          const resp2 = await roomApi.searchRooms({
            keyword,
            limit: 3,
            landlordId: authUser?._id || authUser?.id,
          });
          list = Array.isArray(resp2?.data?.rooms)
            ? resp2.data.rooms
            : Array.isArray(resp2?.data)
            ? resp2.data
            : resp2?.rooms || [];
        }
        setRoomOptions(
          (list || []).slice(0, 3).map((r) => ({
            value: r._id || r.id,
            label: `${r.name || r.title} • ${
              r.buildingId?.name || r.building?.name || ""
            }`,
          }))
        );
      } catch (_) {
        setRoomOptions([]);
      }
    },
    [authUser]
  );

  const searchUsers = useCallback(async (q) => {
    if (!q) return setUserOptions([]);
    try {
      const res = await userApi.list({ q, limit: 3 });
      const list = Array.isArray(res?.data) ? res.data : res?.users || [];
      setUserOptions(
        (list || []).slice(0, 3).map((u) => ({
          value: u._id || u.id,
          label: `${u.email} - ${u.name || ""}`,
        }))
      );
    } catch (_) {
      setUserOptions([]);
    }
  }, []);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);

      const payload = {
        roomId: values.roomId,
        guestId: values.guestId,
        status: "pending", // theo enum ['pending','approved','rejected']
        isHandled: false,
        message: values.message?.trim() || undefined,
      };

      await contactRequestApi.create(payload);
      message.success(
        "Đã tạo yêu cầu hợp đồng (pending). Chờ người thuê duyệt."
      );
      form.resetFields();
      onCreated?.();
      onClose();
    } catch (e) {
      if (e?.errorFields) return; // lỗi validate
      message.error("Không thể tạo yêu cầu hợp đồng");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title="Tạo yêu cầu hợp đồng với người thuê"
      open={open}
      onCancel={onClose}
      okText="Gửi yêu cầu"
      confirmLoading={submitting}
      onOk={handleSubmit}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Chọn phòng"
          name="roomId"
          rules={[{ required: true, message: "Vui lòng chọn phòng" }]}
        >
          {selectedRoom ? (
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span>{selectedRoom.label}</span>
              <Button
                type="link"
                onClick={() => {
                  setSelectedRoom(null);
                  setRoomOptions([]);
                  form.setFieldsValue({ roomId: undefined });
                }}
              >
                Đổi
              </Button>
            </div>
          ) : (
            <Input
              placeholder="Nhập số/tên phòng để tìm"
              onChange={(e) => searchRooms(e.target.value)}
            />
          )}
        </Form.Item>
        {!selectedRoom && roomOptions.length > 0 && (
          <div style={{ marginBottom: 12 }}>
            {roomOptions.slice(0, 3).map((opt) => (
              <Button
                key={opt.value}
                style={{ marginRight: 8, marginTop: 8 }}
                onClick={() => {
                  form.setFieldsValue({ roomId: opt.value });
                  setSelectedRoom(opt);
                  setRoomOptions([]);
                }}
              >
                {opt.label}
              </Button>
            ))}
          </div>
        )}

        <Form.Item
          label="Chọn người thuê theo email"
          name="guestId"
          rules={[{ required: true, message: "Vui lòng chọn người thuê" }]}
        >
          {selectedUser ? (
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span>{selectedUser.label}</span>
              <Button
                type="link"
                onClick={() => {
                  setSelectedUser(null);
                  setUserOptions([]);
                  form.setFieldsValue({ guestId: undefined });
                }}
              >
                Đổi
              </Button>
            </div>
          ) : (
            <Input
              placeholder="Nhập email/tên để tìm người thuê"
              onChange={(e) => searchUsers(e.target.value)}
            />
          )}
        </Form.Item>
        {!selectedUser && userOptions.length > 0 && (
          <div style={{ marginBottom: 12 }}>
            {userOptions.slice(0, 3).map((opt) => (
              <Button
                key={opt.value}
                style={{ marginRight: 8, marginTop: 8 }}
                onClick={() => {
                  form.setFieldsValue({ guestId: opt.value });
                  setSelectedUser(opt);
                  setUserOptions([]);
                }}
              >
                {opt.label}
              </Button>
            ))}
          </div>
        )}

        <Form.Item
          label="Ghi chú/Lời nhắn"
          name="message"
          rules={[{ required: true, message: "Vui lòng nhập lời nhắn" }]}
        >
          <Input.TextArea rows={3} placeholder="Thông điệp gửi người thuê" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

// ---- Requests Tab ----
const RequestsTab = ({ onNeedCreate }) => {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await contactRequestApi.getAll({ limit: 100, page: 1 });
      const list = Array.isArray(res?.data) ? res.data : res?.data?.items || [];
      setRows(list);
    } catch (e) {
      message.error("Không thể tải yêu cầu hợp đồng");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Gửi lại lời mời cho người thuê (không phải chủ trọ duyệt)
  // const resendInvite = async () => {};

  const columns = [
    {
      title: "Phòng",
      dataIndex: ["roomId", "name"],
      key: "room",
      render: (v, r) => r.roomId?.name || r.roomId || "-",
    },
    {
      title: "Người thuê",
      key: "guest",
      render: (_, r) => r.guestId?.name || "-",
    },
    {
      title: "Điện thoại",
      key: "phone",
      render: (_, r) => r.guestId?.phone || "-",
    },
    {
      title: "Email",
      key: "email",
      render: (_, r) => r.guestId?.email || "-",
    },
    {
      title: "Lời nhắn",
      key: "message",
      ellipsis: true,
      render: (_, r) => r.response || "-",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (v) => {
        const map = {
          pending: { color: "gold", text: "Chờ người thuê duyệt" },
          approved: { color: "green", text: "Người thuê đã đồng ý" },
          rejected: { color: "red", text: "Người thuê từ chối" },
        };
        const m = map[v] || { color: "default", text: v || "-" };
        return <Tag color={m.color}>{m.text}</Tag>;
      },
      filters: [
        { text: "Chờ người thuê duyệt", value: "pending" },
        { text: "Đã đồng ý", value: "approved" },
        { text: "Từ chối", value: "rejected" },
      ],
      onFilter: (value, r) => r.status === value,
    },
    {
      title: "Xử lý",
      key: "handle",
      render: (_, r) => (
        <Space>
          {/* <Tooltip title="Tải lại">
            <Button icon={<ReloadOutlined />} onClick={load} />
          </Tooltip> */}
          <Tooltip title="Gửi lại yêu cầu cho người thuê">
            <Button
              icon={<SendOutlined />}
              onClick={async () => {
                try {
                  setLoading(true);
                  await contactRequestApi.resend?.(r._id || r.id);
                  message.success("Đã gửi lại lời mời");
                } catch (e) {
                  message.error("Không thể gửi lại lời mời");
                } finally {
                  setLoading(false);
                }
              }}
            >
              Gửi lại
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div
        style={{
          marginBottom: 12,
          display: "flex",
          gap: 8,
          justifyContent: "flex-end",
        }}
      >
        <Button
          type="primary"
          icon={<FileAddOutlined />}
          onClick={onNeedCreate}
        >
          Tạo yêu cầu hợp đồng
        </Button>
      </div>
      <Table
        rowKey={(r) => r._id || r.id}
        columns={columns}
        dataSource={rows}
        loading={loading}
        pagination={{ pageSize: DEFAULT_PAGE_SIZE }}
      />
    </div>
  );
};

// ---- Main Contracts Tab ----
const MainContractsTab = () => {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [detail, setDetail] = useState(null);
  const { user: authUser } = useAuth();

  const load = useCallback(async () => {
    try {
      setLoading(true);
      // Prefer fetching contracts belonging to current landlord by hostId
      const res = await contractApi.getByHost(authUser?._id || authUser?.id, {
        limit: 100,
        page: 1,
      });
      const list = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res)
        ? res
        : res?.contracts || res?.items || [];
      setRows(list);
    } catch (e) {
      message.error("Không thể tải danh sách hợp đồng");
    } finally {
      setLoading(false);
    }
  }, [authUser]);

  useEffect(() => {
    load();
  }, [load]);

  const columns = useMemo(
    () => [
      {
        title: "Mã HĐ",
        dataIndex: "code",
        key: "code",
        width: 140,
        render: (v, r) => v || (r._id ? String(r._id).slice(-6) : "-"),
      },
      {
        title: "Người thuê",
        key: "tenant",
        render: (_, r) => r.renterId?.name || r.tenantId?.name || "-",
      },
      {
        title: "Phòng",
        key: "room",
        render: (_, r) => r.roomId?.name || "-",
      },
      {
        title: "Thời hạn",
        key: "term",
        render: (_, r) => {
          const s = r.startDate ? new Date(r.startDate) : null;
          const e = r.endDate ? new Date(r.endDate) : null;
          const fmt = (d) => (d ? d.toLocaleDateString("vi-VN") : "-");
          return (
            <span>
              {fmt(s)} → {fmt(e)}
            </span>
          );
        },
      },
      {
        title: "Tiền cọc",
        key: "deposit",
        render: (_, r) =>
          fmtVND(
            typeof r?.terms?.depositAmount === "number"
              ? r.terms.depositAmount
              : typeof r?.deposit === "number"
              ? r.deposit
              : 0
          ),
      },
      {
        title: "Tiền thuê",
        key: "rent",
        render: (_, r) =>
          fmtVND(
            typeof r?.terms?.rentAmount === "number"
              ? r.terms.rentAmount
              : typeof r?.rent === "number"
              ? r.rent
              : typeof r?.roomId?.price?.rent === "number"
              ? r.roomId.price.rent
              : 0
          ),
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        render: (v) => {
          const map = {
            active: { color: "green", text: "Đang hiệu lực" },
            pending: { color: "gold", text: "Chờ hiệu lực" },
            ended: { color: "default", text: "Đã kết thúc" },
            cancelled: { color: "red", text: "Đã hủy" },
          };
          const m = map[v] || { color: "default", text: v || "-" };
          return <Tag color={m.color}>{m.text}</Tag>;
        },
        filters: [
          { text: "Đang hiệu lực", value: "active" },
          { text: "Chờ hiệu lực", value: "pending" },
          { text: "Đã kết thúc", value: "ended" },
          { text: "Đã hủy", value: "cancelled" },
        ],
        onFilter: (value, r) => r.status === value,
      },
      {
        title: "Thao tác",
        key: "actions",
        render: (_, r) => (
          <Space>
            <Button size="small" onClick={() => setDetail(r)}>
              Xem chi tiết
            </Button>
            {/* <Tooltip title="Tải lại">
              <Button icon={<ReloadOutlined />} onClick={load} />
            </Tooltip> */}
            {r.status !== "active" && (
              <Tooltip title="Tạo hoá đơn đặt cọc mới">
                <Button
                  icon={<DollarOutlined />}
                  onClick={async () => {
                    try {
                      setLoading(true);
                      await billApi.create({
                        contractId: r._id || r.id,
                        tenantId: safeId(r.renterId || r.tenantId),
                        amount:
                          typeof r?.terms?.depositAmount === "number"
                            ? r.terms.depositAmount
                            : r.deposit || 0,
                        type: "deposit",
                        description: `Hóa đơn đặt cọc cho HĐ ${
                          r.code || (r._id ? String(r._id).slice(-6) : "")
                        }`,
                        dueDate: new Date(Date.now() + 7 * 86400000),
                      });
                      message.success("Đã tạo hóa đơn đặt cọc");
                    } catch (e) {
                      message.error("Không thể tạo hóa đơn đặt cọc");
                    } finally {
                      setLoading(false);
                    }
                  }}
                >
                  Tạo lại hóa đơn cọc
                </Button>
              </Tooltip>
            )}
          </Space>
        ),
      },
    ],
    [load]
  );

  return (
    <>
      <Table
        rowKey={(r) => r._id || r.id}
        columns={columns}
        dataSource={rows}
        loading={loading}
        pagination={{ pageSize: DEFAULT_PAGE_SIZE }}
      />
      <Modal
        open={!!detail}
        onCancel={() => {
          try {
            delete window.__landlordSig;
          } catch (_) {}
          setDetail(null);
        }}
        footer={
          <Space>
            <Button
              onClick={() => {
                try {
                  delete window.__landlordSig;
                } catch (_) {}
                setDetail(null);
              }}
            >
              Đóng
            </Button>
            {detail &&
              detail.status === "pending" &&
              (!detail?.signatures?.tenant ||
                !detail?.signatures?.landlord) && (
                <Button
                  type="primary"
                  disabled={loading}
                  onClick={async () => {
                    try {
                      setLoading(true);
                      const existingSig = detail?.signatures?.landlord;
                      const cachedSig = window.__landlordSig;
                      const landlordSignature = cachedSig || existingSig;
                      if (!landlordSignature) {
                        message.warning(
                          "Vui lòng ký (ô Bên A) rồi bấm Lưu chữ ký trước."
                        );
                        setLoading(false);
                        return;
                      }
                      // 1) Landlord signs the contract with saved/existing base64 image
                      const signRes = await contractApi.updateSignatures(
                        detail._id || detail.id,
                        { landlord: landlordSignature }
                      );

                      // 2) Create a deposit bill for the contract
                      const deposit =
                        typeof detail?.terms?.depositAmount === "number"
                          ? detail.terms.depositAmount
                          : detail.deposit ||
                            detail.roomId?.price?.deposit ||
                            0;
                      const renterId = safeId(
                        detail.renterId || detail.tenantId
                      );
                      const amount = {
                        rent: 0,
                        electricity: 0,
                        water: 0,
                        service: 0,
                      };
                      const totalAmount = deposit;
                      const billRes = await billApi
                        .create({
                          contractId: detail._id || detail.id,
                          renterId,
                          amount,
                          totalAmount,
                          note: "Tiền đặt cọc khi người dùng thanh toán thành công tiền đặt cọc",
                          type: "deposit",
                          status: "pending",
                          dueDate: new Date(Date.now() + 7 * 86400000),
                        })
                        .catch((err) => {
                          const msg = err?.response?.data?.message || "";
                          if (
                            msg.toLowerCase().includes("duplicate") ||
                            msg.toLowerCase().includes("exist")
                          ) {
                            return { success: true, duplicate: true };
                          }
                          throw err;
                        });
                      message.success("Đã ký và tạo hoá đơn đặt cọc");
                      try {
                        delete window.__landlordSig;
                      } catch (_) {}
                      setDetail(null);
                      load();
                    } catch (e) {
                      message.error(
                        e?.response?.data?.message ||
                          "Không thể ký/tạo hoá đơn cọc"
                      );
                    } finally {
                      setLoading(false);
                    }
                  }}
                >
                  Ký & Tạo hoá đơn cọc
                </Button>
              )}
          </Space>
        }
        title="Chi tiết hợp đồng"
        width={900}
      >
        {detail &&
          (() => {
            // reset signature cache when opening this modal
            try {
              delete window.__landlordSig;
            } catch (_) {}
            const now = new Date();
            const day = now.getDate();
            const month = now.getMonth() + 1;
            const year = now.getFullYear();
            const building = detail.roomId?.buildingId || {};
            const addr = building?.address || {};
            const addressStr = [
              addr.street,
              addr.ward,
              addr.district,
              addr.city,
            ]
              .filter(Boolean)
              .join(", ");
            const price = detail.roomId?.price || {};
            const tenant = detail.renterId || detail.tenantId || {};
            const landlord = building?.hostId || {};
            const isApproved = ["approved", "confirmed", "active"].includes(
              detail.status
            );
            return (
              <div
                style={{
                  fontFamily: "Times New Roman, Times, serif",
                  lineHeight: 1.6,
                }}
              >
                <div style={{ textAlign: "center", marginBottom: 20 }}>
                  <p>
                    <b>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</b>
                  </p>
                  <p>
                    <b>Độc lập – Tự do – Hạnh phúc</b>
                  </p>
                  <p>---------------</p>
                </div>
                <div
                  style={{
                    textAlign: "center",
                    fontSize: "1.2em",
                    fontWeight: 700,
                    margin: "20px 0",
                  }}
                >
                  HỢP ĐỒNG THUÊ PHÒNG TRỌ
                </div>
                <div style={{ marginBottom: 15 }}>
                  <p>
                    Hôm nay ngày <b>{day}</b> tháng <b>{month}</b> năm{" "}
                    <b>{year}</b>; tại địa chỉ:{" "}
                    <b>{addressStr || "________________"}</b>
                  </p>
                  <p>Chúng tôi gồm:</p>
                </div>
                <p>
                  <b>Mã HĐ:</b>{" "}
                  {detail.code ||
                    (detail._id ? String(detail._id).slice(-6) : "")}
                </p>
                <div style={{ marginBottom: 15 }}>
                  <p>
                    <b>1. Đại diện bên cho thuê phòng trọ (Bên A):</b>
                  </p>
                  <p>
                    Ông/bà: <b>{landlord.name || "________________"}</b> &nbsp;
                    SĐT: <b>{landlord.phone || "________________"}</b>
                  </p>
                  <p>
                    Email: <b>{landlord.email || "________________"}</b>
                  </p>
                </div>
                <div style={{ marginBottom: 15 }}>
                  <p>
                    <b>2. Bên thuê phòng trọ (Bên B):</b>
                  </p>
                  <p>
                    Ông/bà: <b>{tenant.name || "________________"}</b> &nbsp;
                    SĐT: <b>{tenant.phone || "________________"}</b>
                  </p>
                  <p>
                    Email: <b>{tenant.email || "________________"}</b>
                  </p>
                </div>
                <div style={{ marginBottom: 15 }}>
                  <p>
                    Sau khi bàn bạc trên tinh thần dân chủ, hai bên cùng có lợi,
                    cùng thống nhất như sau:
                  </p>
                  <p>
                    Bên A đồng ý cho bên B thuê 01 phòng ở:{" "}
                    <b>{detail.roomId?.name || "-"}</b> tại địa chỉ:{" "}
                    <b>{addressStr || "-"}</b>
                  </p>
                  <p>
                    Giá thuê:{" "}
                    <b>
                      {(typeof detail?.terms?.rentAmount === "number"
                        ? detail.terms.rentAmount
                        : price.rent || 0
                      ).toLocaleString("vi-VN")}{" "}
                      đ/tháng
                    </b>
                  </p>
                  <p>
                    Hình thức thanh toán: <b>Chuyển khoản/Tiền mặt</b>
                  </p>
                  <p>
                    Tiền điện:{" "}
                    <b>
                      {(price.electricity || 0).toLocaleString("vi-VN")} đ/kWh
                    </b>
                    ; Tiền nước:{" "}
                    <b>{(price.water || 0).toLocaleString("vi-VN")} đ/người</b>
                  </p>
                  <p>
                    Tiền đặt cọc:{" "}
                    <b>
                      {(typeof detail?.terms?.depositAmount === "number"
                        ? detail.terms.depositAmount
                        : detail.deposit || price.deposit || 0
                      ).toLocaleString("vi-VN")}{" "}
                      đ
                    </b>
                  </p>
                </div>
                <div style={{ marginBottom: 15 }}>
                  <p>
                    <b>TRÁCH NHIỆM CỦA CÁC BÊN</b>
                  </p>
                  <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
                    <li>
                      <b>Trách nhiệm của bên A:</b>
                    </li>
                    <li>
                      - Tạo mọi điều kiện thuận lợi để bên B thực hiện theo hợp
                      đồng.
                    </li>
                    <li>
                      - Cung cấp nguồn điện, nước, wifi cho bên B sử dụng.
                    </li>
                    <li>
                      <b>Trách nhiệm của bên B:</b>
                    </li>
                    <li>
                      - Thanh toán đầy đủ các khoản tiền theo đúng thỏa thuận.
                    </li>
                    <li>
                      - Bảo quản trang thiết bị và cơ sở vật chất của bên A.
                    </li>
                    <li>
                      - Không tự ý sửa chữa, cải tạo cơ sở vật chất khi chưa
                      được đồng ý.
                    </li>
                    <li>- Giữ gìn vệ sinh khu vực phòng trọ.</li>
                  </ul>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: 24,
                    gap: 24,
                  }}
                >
                  <div style={{ textAlign: "center" }}>
                    <p>
                      <b>ĐẠI DIỆN BÊN B</b>
                    </p>
                    <div
                      style={{
                        width: 360,
                        height: 160,
                        border: "1px dashed #bbb",
                        borderRadius: 6,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "#fafafa",
                      }}
                    >
                      {detail.signatures?.tenant ? (
                        <img
                          src={detail.signatures.tenant}
                          alt="tenant-sign"
                          style={{ maxWidth: 360, maxHeight: 160 }}
                        />
                      ) : isApproved ? (
                        "Đã ký"
                      ) : (
                        "Chưa ký"
                      )}
                    </div>
                    <p>(Ký, ghi rõ họ tên)</p>
                    <p>{tenant.name || "________________"}</p>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <p>
                      <b>ĐẠI DIỆN BÊN A</b>
                    </p>
                    {detail.signatures?.landlord ? (
                      <div
                        style={{
                          width: 360,
                          height: 160,
                          border: "1px dashed #bbb",
                          borderRadius: 6,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "#fafafa",
                        }}
                      >
                        <img
                          src={detail.signatures.landlord}
                          alt="landlord-sign"
                          style={{ maxWidth: 360, maxHeight: 160 }}
                        />
                      </div>
                    ) : detail.status === "pending" ? (
                      <SignaturePad
                        onSaveSignature={(sig) => (window.__landlordSig = sig)}
                      />
                    ) : (
                      <div
                        style={{
                          width: 360,
                          height: 160,
                          border: "1px dashed #bbb",
                          borderRadius: 6,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "#fafafa",
                          color: "#888",
                        }}
                      >
                        Chưa ký
                      </div>
                    )}
                    <p>(Ký, ghi rõ họ tên)</p>
                    <p>{landlord.name || "________________"}</p>
                  </div>
                </div>
              </div>
            );
          })()}
      </Modal>
    </>
  );
};

// ---- Page Wrapper ----
const ContractsPage = () => {
  const [openCreate, setOpenCreate] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div
      style={{ minHeight: "100vh", padding: "20px" }}
      className="contracts-page"
    >
      <div
        className="contracts-header"
        style={{
          color: "#4739f0",
          fontSize: "40px",
          fontWeight: 800,
          marginBottom: 12,
        }}
      >
        Quản lý hợp đồng thuê
      </div>
      <Tabs
        defaultActiveKey="contracts"
        items={[
          {
            key: "contracts",
            label: (
              <span>
                <CheckOutlined /> Hợp đồng chính
              </span>
            ),
            children: <MainContractsTab key={`con-${refreshKey}`} />,
          },
          {
            key: "requests",
            label: (
              <span>
                <FileAddOutlined /> Yêu cầu xem xét hợp đồng
              </span>
            ),
            children: (
              <RequestsTab
                key={`req-${refreshKey}`}
                onNeedCreate={() => setOpenCreate(true)}
              />
            ),
          },
        ]}
      />

      <CreateRequestModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onCreated={() => setRefreshKey((k) => k + 1)}
      />
    </div>
  );
};

export default ContractsPage;
