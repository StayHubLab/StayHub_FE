import "./RoomInfo.css";

const RoomInfo = () => {
  return (
    <div className="room-info">
      <img
        src="https://placehold.co/300x180"
        alt="Phòng trọ"
        className="room-img"
      />
      <div className="room-content">
        <h4 className="room-title">
          Phòng trọ đầy đủ tiện nghi <span className="verified">✔</span>
        </h4>
        <p className="room-address">25 Võ Văn Tần, Q1, TP.HCM</p>
        <p className="room-price">
          <span className="price">4.5 triệu</span> /tháng
        </p>
        <div className="room-tags">
          <span className="tag">WiFi</span>
          <span className="tag">WC riêng</span>
          <span className="tag">Máy lạnh</span>
          <span className="tag">Bếp</span>
        </div>
        <button className="detail-btn">Xem chi tiết</button>
        <button className="book-btn">Đặt lịch xem</button>
      </div>
    </div>
  );
};

export default RoomInfo;
