import "./Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      {/* Header */}
      <div className="sidebar-top">
        <h3 className="sidebar-title">Tin nhắn</h3>
        <button className="compose-btn">+ Soạn</button>
      </div>

      {/* Search */}
      <div className="search-box">
        <input type="text" placeholder="Tìm kiếm cuộc trò chuyện..." />
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button className="tab active">Tất cả</button>
        <button className="tab">Chưa đọc</button>
        <button className="tab">Đã ghim</button>
      </div>

      {/* Đã ghim */}
      <div className="sidebar-section">
        <h4>Đã ghim</h4>
        <div className="chat-item active">
          <div className="avatar gold">CL</div>
          <div className="chat-info">
            <div className="chat-top">
              <p className="name">Cô Lan</p>
              <span className="time">14:35</span>
            </div>
            <p className="last-message">Em có thể xem 3h chiều...</p>
            <span className="tag">Chủ trọ</span>
          </div>
        </div>
      </div>

      {/* Cần đây */}
      <div className="sidebar-section">
        <h4>Cần đây</h4>
        <div className="chat-item">
          <div className="avatar">AM</div>
          <div className="chat-info">
            <div className="chat-top">
              <p className="name">Anh Minh</p>
              <span className="time">Hôm qua</span>
            </div>
            <p className="last-message">Ok em, còn phòng tầng 3</p>
            <span className="tag">Chung cư Kim Liên</span>
          </div>
        </div>

        <div className="chat-item">
          <div className="avatar">TH</div>
          <div className="chat-info">
            <div className="chat-top">
              <p className="name">Thu Hà</p>
              <span className="time">T2</span>
            </div>
            <p className="last-message">Cảm ơn em nhé</p>
            <span className="tag">Phòng trọ Cầu Giấy</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
