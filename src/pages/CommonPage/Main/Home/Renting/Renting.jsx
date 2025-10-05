import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import "./Renting.css";
import { HomeOutlined, MessageOutlined } from "@ant-design/icons";
import { Spin, Empty, message } from "antd";
import { useAuth } from "../../../../../contexts/AuthContext";
import contractApi from "../../../../../services/api/contractApi";
import billApi from "../../../../../services/api/billApi";
import chatService from "../../../../../services/api/chatService";
import { useNavigate } from "react-router-dom";

const Renting = ({ bookings = [], loading: loadingProp = false }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [contracts, setContracts] = useState([]);
  const navigate = useNavigate();
  // Map of contractId -> pending monthly bill
  const [pendingMonthlyBills, setPendingMonthlyBills] = useState({});

  useEffect(() => {
    const load = async () => {
      if (!user?._id) return;
      try {
        setLoading(true);
        const res = await contractApi.getByUser(user._id, {
          status: "active",
          limit: 10,
          page: 1,
        });
        const list = Array.isArray(res?.data)
          ? res.data
          : res?.contracts || res?.items || [];
        setContracts(list || []);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user?._id]);

  // After contracts load, fetch pending monthly bills for this renter and map by contract
  useEffect(() => {
    const loadBills = async () => {
      if (!user?._id || !contracts?.length) {
        setPendingMonthlyBills({});
        return;
      }
      try {
        const res = await billApi.listByRenter(user._id, {
          status: "pending",
          type: "monthly",
          limit: 200,
          page: 1,
        });
        const list = Array.isArray(res?.data)
          ? res.data
          : res?.items || res?.bills || [];
        const map = {};
        list.forEach((b) => {
          const cid = b?.contractId?._id || b?.contractId;
          if (!cid) return;
          // Prefer the earliest due date if multiple
          if (!map[cid]) {
            map[cid] = b;
          } else {
            const d1 = new Date(
              map[cid]?.dueDate ||
              map[cid]?.paymentDueDate ||
              map[cid]?.deadline ||
              0
            );
            const d2 = new Date(
              b?.dueDate || b?.paymentDueDate || b?.deadline || 0
            );
            if (d2 < d1) map[cid] = b;
          }
        });
        setPendingMonthlyBills(map);
      } catch (err) {
        // silent fail; keep fallback due date logic
      }
    };
    loadBills();
  }, [user?._id, contracts]);

  const cards = useMemo(() => {
    const list = Array.isArray(contracts) ? contracts : [];
    return list.map((c) => {
      const room = c.roomId || {};
      const building = room.buildingId || {};
      const addressObj = building.address || {};
      const address = [
        addressObj.street,
        addressObj.ward,
        addressObj.district,
        addressObj.city,
      ]
        .filter(Boolean)
        .join(", ");
      const img =
        room.images?.[0]?.url ||
        room.images?.[0] ||
        "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1200&auto=format&fit=crop";
      const rent =
        (typeof c?.terms?.rentAmount === "number" && c.terms.rentAmount) ||
        room?.price?.rent ||
        0;
      // Derive due date:
      // 1) If there's a pending monthly bill for this contract, use its due date
      // 2) Otherwise, do not show a date ("Chưa đến tháng")
      const bill = pendingMonthlyBills[c._id || c.id];
      let due;
      if (bill) {
        const bd = bill.dueDate || bill.paymentDueDate || bill.deadline;
        due = bd ? new Date(bd) : null;
      }
      if (due && isNaN(due.getTime())) due = null;

      return {
        key: c._id || c.id,
        img,
        title: `${room.name || room.title || "Phòng"} - ${building.name || ""}`,
        address,
        rent,
        dueDate: due,
        hasPendingMonthly: Boolean(bill),
        contract: c,
      };
    });
  }, [contracts, pendingMonthlyBills]);

  const isLoading = loading || loadingProp;

  if (isLoading) {
    return (
      <div className="renting-container">
        <div className="renting-title">Phòng bạn đang thuê</div>
        <Spin size="large" />
      </div>
    );
  }

  if (!contracts || contracts.length === 0) {
    return (
      <div className="renting-container">
        <div className="renting-title">Phòng bạn đang thuê</div>
        <Empty
          image={<HomeOutlined style={{ fontSize: 64, color: "#d9d9d9" }} />}
          description="Bạn chưa thuê phòng nào"
        />
      </div>
    );
  }

  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN");
  };

  const handleViewContract = (contract) => {
    navigate(`/main/contract`);
  };

  const handlePayNow = async (contract) => {
    navigate(`/main/bills`);
  };

  const handleViewRoom = (contract) => {
    const room = contract?.roomId;
    if (!room?._id) {
      message.error("Không tìm thấy thông tin phòng");
      return;
    }
    navigate(`/main/room-detail/${room._id}`);
  }

  const handleReportIssue = () => {
    message.info("Tính năng báo cáo sự cố đang được phát triển");
  };

  const handleChatWithLandlord = async (contract) => {
    try {
      // Get landlord ID from contract - the landlord is stored as hostId
      const landlordId = 
        contract?.hostId || // Direct hostId on contract (string ID)
        contract?.hostId?._id || // Populated hostId object
        contract?.roomId?.buildingId?.hostId?._id || // From building.hostId (populated)
        contract?.roomId?.buildingId?.hostId; // From building.hostId (string ID)

      if (!landlordId) {
        message.error("Không tìm thấy thông tin chủ trọ");
        return;
      }

      const res = await chatService.createConversation(landlordId);
      const conversation = res.data.conversation;

      if (conversation?._id) {
        navigate(`/chat?conversationId=${conversation._id}`);
      } else {
        message.error("Không thể tạo cuộc trò chuyện");
      }
    } catch (err) {
      message.error("Có lỗi xảy ra khi tạo cuộc trò chuyện");
      console.error("Error creating conversation:", err);
    }
  };

  return (
    <div className="renting-container">
      <div className="renting-title">Phòng bạn đang thuê</div>

      {cards.map((card) => (
        <div key={card.key} className="renting-card">
          <div className="renting-card-content">
            {/* Room Image */}
            <div className="renting-image-container">
              <div className="renting-image-wrapper">
                <img
                  src={card.img}
                  alt={card.title}
                  className="renting-image"
                />
              </div>
            </div>

            {/* Room Details */}
            <div className="renting-details">
              {/* Room Title */}
              <div className="renting-room-title">{card.title}</div>

              {/* Room Address */}
              <div className="renting-room-address">{card.address}</div>

              {/* Price Section */}
              <div className="renting-price-section">
                <div className="renting-price">
                  {formatPrice(card.rent)} VNĐ
                </div>
                <div className="renting-price-unit">/tháng</div>
              </div>

              {/* Payment Due Alert */}
              <div className="renting-payment-alert">
                <div className="renting-payment-text">
                  {card.hasPendingMonthly && card.dueDate
                    ? `Đến hạn thanh toán: ${card.dueDate.toLocaleDateString(
                      "vi-VN"
                    )}`
                    : "Chưa đến hạn thanh toán"}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="renting-actions">
                <div className="renting-buttons-row">
                  {/* View Contract Link */}
                  <div
                    className="renting-contract-link"
                    onClick={() => handleViewContract(card.contract)}
                  >
                    Xem Hợp đồng
                  </div>

                  {/* Pay Now Button */}
                  <div
                    className="renting-pay-button"
                    onClick={() => handlePayNow(card.contract)}
                  >
                    <div className="renting-pay-text">Thanh toán ngay</div>
                  </div>

                  {/* View room details */}
                  <div
                    className="renting-view-button"
                    onClick={() => handleViewRoom(card.contract)}
                  >
                    <div className="renting-view-text">Xem chi tiết</div>
                  </div>

                  {/* Report Issue Button
                  <div
                    className="renting-report-button"
                    onClick={handleReportIssue}
                  >
                    <div className="renting-report-text">Báo cáo sự cố</div>
                  </div> */}


                </div>
              </div>
              {/* Chat with Landlord */}
              <div
                className="renting-chat-section"
                onClick={() => handleChatWithLandlord(card.contract)}
              >
                <div className="renting-chat-icon">
                  <MessageOutlined />
                </div>
                <div className="renting-chat-text">Trò chuyện với chủ trọ</div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

Renting.propTypes = {
  bookings: PropTypes.array,
  loading: PropTypes.bool,
};

export default Renting;
