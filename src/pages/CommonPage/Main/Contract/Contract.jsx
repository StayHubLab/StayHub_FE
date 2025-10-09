import React, { useCallback, useEffect, useState } from "react";
import { Tabs, Table, Tag, Space, Button, Tooltip, message, Modal } from "antd";
import SignaturePad from "./SignaturePad";
import contractApi from "../../../../services/api/contractApi";
import contactRequestApi from "../../../../services/api/contactRequestApi";
import { useAuth } from "../../../../contexts/AuthContext";

const DEFAULT_PAGE_SIZE = 10;

const ReviewRequestsTab = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [detail, setDetail] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await contactRequestApi.getAll({
        limit: 100,
        page: 1,
        guestId: user?._id || user?.id,
      });
      const list = Array.isArray(res?.data?.items)
        ? res.data.items
        : res?.data || [];
      setRows(list);
    } catch (e) {
      message.error("Không thể tải yêu cầu xem xét");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  const columns = [
    { title: "Phòng", key: "room", render: (_, r) => r.roomId?.name || "-" },
    {
      title: "Tòa",
      key: "building",
      render: (_, r) => r.roomId?.buildingId?.name || "-",
    },
    {
      title: "Lời nhắn",
      dataIndex: "response",
      key: "response",
      ellipsis: true,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (v) => {
        const map = {
          pending: { color: "gold", text: "Chờ xem xét" },
          approved: { color: "green", text: "Đã đồng ý" },
          rejected: { color: "red", text: "Từ chối" },
        };
        const m = map[v] || { color: "default", text: v || "-" };
        return <Tag color={m.color}>{m.text}</Tag>;
      },
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, r) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button onClick={() => setDetail(r)}>Xem chi tiết</Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

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
        onCancel={() => setDetail(null)}
        footer={null}
        title="Chi tiết yêu cầu hợp đồng"
        width={900}
      >
        {detail &&
          (() => {
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

            const guest = detail.guestId || {};
            const landlord = building?.hostId || {};
            const price = detail.roomId?.price || {};
            const isApproved =
              detail.status === "approved" || detail.status === "confirmed";

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
                    Ông/bà: <b>{guest.name || "________________"}</b> &nbsp;
                    SĐT: <b>{guest.phone || "________________"}</b>
                  </p>
                  <p>
                    Email: <b>{guest.email || "________________"}</b>
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
                    <b>{(price.rent || 0).toLocaleString("vi-VN")} đ/tháng</b>
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
                    <b>{(price.deposit || 0).toLocaleString("vi-VN")} đ</b>
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
                    marginTop: 40,
                    gap: 24,
                  }}
                >
                  <div style={{ textAlign: "center" }}>
                    <p>
                      <b>ĐẠI DIỆN BÊN B</b>
                    </p>
                    {isApproved ? (
                      <div
                        style={{
                          width: 360,
                          height: 160,
                          border: "1px dashed #bbb",
                          borderRadius: 6,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#888",
                          background: "#fafafa",
                        }}
                      >
                        Đã ký
                      </div>
                    ) : (
                      <SignaturePad
                        onSaveSignature={(sig) => (window.__tenantSig = sig)}
                      />
                    )}
                    <p>(Ký, ghi rõ họ tên)</p>
                    <p>{guest.name || "________________"}</p>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <p>
                      <b>ĐẠI DIỆN BÊN A</b>
                    </p>
                    {/* Người thuê không thể ký thay chủ trọ: hiển thị hộp khóa */}
                    <div
                      style={{
                        width: 360,
                        height: 160,
                        border: "1px dashed #bbb",
                        borderRadius: 6,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#888",
                        background: "#fafafa",
                      }}
                    >
                      {isApproved
                        ? "Đã ký"
                        : "Chỉ chủ trọ ký ở giao diện chủ trọ"}
                    </div>
                    <p>(Ký, ghi rõ họ tên)</p>
                    <p>{landlord.name || "________________"}</p>
                  </div>
                </div>
                {!isApproved && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      marginTop: 16,
                      gap: 8,
                    }}
                  >
                    <Button onClick={() => setDetail(null)}>Đóng</Button>
                    <Button
                      type="primary"
                      onClick={async () => {
                        try {
                          if (!window.__tenantSig) {
                            message.warning("Vui lòng ký trước khi đồng ý");
                            return;
                          }

                          const res = await contactRequestApi.signAsTenant(
                            detail._id,
                            window.__tenantSig
                          );
                          message.success("Đã ký và gửi yêu cầu");
                          setDetail(null);
                          load();
                        } catch (e) {
                          message.error("Không thể gửi chữ ký");
                        }
                      }}
                    >
                      Đồng ý & Gửi chữ ký
                    </Button>
                  </div>
                )}
              </div>
            );
          })()}
      </Modal>
    </>
  );
};

const ActiveContractsTab = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [detailContract, setDetailContract] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await contractApi.getByUser(user?._id || user?.id, {
        limit: 100,
        page: 1,
      });
      const list = Array.isArray(res?.data)
        ? res.data
        : res?.data?.items || res || [];
      setRows(list);
    } catch (e) {
      message.error("Không thể tải hợp đồng");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  const columns = [
    {
      title: "Mã HĐ",
      dataIndex: "code",
      key: "code",
      render: (v, r) => v || r._id?.slice(-6) || "-",
    },
    { title: "Phòng", key: "room", render: (_, r) => r.roomId?.name || "-" },
    {
      title: "Tòa",
      key: "building",
      render: (_, r) => r.roomId?.buildingId?.name || "-",
    },
    {
      title: "Tiền cọc",
      key: "deposit",
      render: (_, r) =>
        (r.terms?.depositAmount || r.deposit || 0).toLocaleString("vi-VN") +
        " VND",
    },
    {
      title: "Tiền thuê",
      key: "rent",
      render: (_, r) =>
        (
          r.terms?.rentAmount ||
          r.rent ||
          r.roomId?.price?.rent ||
          0
        ).toLocaleString("vi-VN") + " VND",
    },
    { title: "Trạng thái", dataIndex: "status", key: "status" },
    {
      title: "Hành động",
      key: "actions",
      render: (_, r) => (
        <Button size="small" onClick={() => setDetailContract(r)}>
          Xem chi tiết
        </Button>
      ),
    },
  ];

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
        open={!!detailContract}
        onCancel={() => setDetailContract(null)}
        footer={<Button onClick={() => setDetailContract(null)}>Đóng</Button>}
        title="Chi tiết hợp đồng"
        width={900}
      >
        {detailContract &&
          (() => {
            const now = new Date();
            const day = now.getDate();
            const month = now.getMonth() + 1;
            const year = now.getFullYear();
            const building = detailContract.roomId?.buildingId || {};
            const addr = building?.address || {};
            const addressStr = [
              addr.street,
              addr.ward,
              addr.district,
              addr.city,
            ]
              .filter(Boolean)
              .join(", ");
            const price = detailContract.roomId?.price || {};
            const guest = {
              name: user?.name,
              email: user?.email,
              phone: user?.phone,
            };
            const landlord = building?.hostId || {};
            const isApproved = ["approved", "confirmed", "active"].includes(
              detailContract.status
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
                  <b>Mã HĐ:</b> {detailContract.code || detailContract._id}
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
                    Ông/bà: <b>{guest.name || "________________"}</b> &nbsp;
                    SĐT: <b>{guest.phone || "________________"}</b>
                  </p>
                  <p>
                    Email: <b>{guest.email || "________________"}</b>
                  </p>
                </div>
                <div style={{ marginBottom: 15 }}>
                  <p>
                    Sau khi bàn bạc trên tinh thần dân chủ, hai bên cùng có lợi,
                    cùng thống nhất như sau:
                  </p>
                  <p>
                    Bên A đồng ý cho bên B thuê 01 phòng ở:{" "}
                    <b>{detailContract.roomId?.name || "-"}</b> tại địa chỉ:{" "}
                    <b>{addressStr || "-"}</b>
                  </p>
                  <p>
                    Giá thuê:{" "}
                    <b>
                      {(
                        detailContract.terms?.rentAmount ||
                        price.rent ||
                        0
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
                      {(
                        detailContract.terms?.depositAmount ||
                        price.deposit ||
                        0
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
                      {detailContract.signatures?.tenant ? (
                        <img
                          src={detailContract.signatures.tenant}
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
                    <p>{guest.name || "________________"}</p>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <p>
                      <b>ĐẠI DIỆN BÊN A</b>
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
                      {detailContract.signatures?.landlord ? (
                        <img
                          src={detailContract.signatures.landlord}
                          alt="landlord-sign"
                          style={{ maxWidth: 360, maxHeight: 160 }}
                        />
                      ) : isApproved ? (
                        "Đã ký"
                      ) : (
                        "Chưa ký"
                      )}
                    </div>
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

const ContractPage = () => {
  return (
    <div style={{ minHeight: "100vh", padding: 20 }}>
      <h2
        style={{
          color: "#4739f0",
          fontSize: "40px",
          fontWeight: "800",
          marginBottom: 16,
        }}
      >
        Hợp đồng của tôi
      </h2>
      <Tabs
        defaultActiveKey="active"
        items={[
          {
            key: "active",
            label: "Hợp đồng thuê",
            children: <ActiveContractsTab />,
          },
          {
            key: "review",
            label: "Cần xem xét",
            children: <ReviewRequestsTab />,
          },
        ]}
      />
    </div>
  );
};

export default ContractPage;
