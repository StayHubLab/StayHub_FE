import "./ChatWindow.css";

const ChatWindow = () => {
  return (
    <div className="chat-window">
      {/* Header */}
      <div className="chat-header">
        <div className="header-left">
          <div className="avatar">CL</div>
          <div>
            <h3>Cô Lan <span className="verified">✔</span></h3>
            <span className="subtitle">Phòng trọ 25 Võ Văn Tần, Q1</span>
          </div>
        </div>
        <div className="header-actions">
          <button>📞</button>
          <button>💬</button>
        </div>
      </div>

      {/* Messages */}
      <div className="chat-messages">
        <div className="message user">
          <p>Chị ơi phòng này còn trống không ạ?</p>
          <span className="time">14:20</span>
        </div>
        <div className="message landlord">
          <p>Còn em nhé. Em rảnh khung giờ nào xem phòng?</p>
          <span className="time">14:22</span>
        </div>
        <div class="message user proposal">
  <div class="proposal-card">
    <p class="title">Đề xuất lịch xem</p>

    <label class="label">Ngày</label>
    <input type="text" class="input" value="2024-01-27" readonly />

    <label class="label">Giờ</label>
    <div class="time-options">
      <button class="time-btn active">14:00</button>
      <button class="time-btn disabled">15:00</button>
      <button class="time-btn disabled">16:00</button>
    </div>

    <div class="actions">
      <button class="btn-primary">Gửi đề xuất</button>
      <button class="btn-secondary">Hủy</button>
    </div>
  </div>

  <span class="time">14:25</span>
</div>

        <div className="message system">
          <p>✅ Cô Lan đã xác nhận lịch xem - T7, 14:00, 25 Võ Văn Tần</p>
        </div>
        <div className="message file">
  <div className="file-left">
    <div className="file-icon">📄</div>
    <div className="file-info">
      <p className="filename">Mặt bằng phòng.pdf</p>
      <span className="filesize">1.2MB</span>
    </div>
  </div>
  <div className="file-actions">
    <button className="download-btn">⬇</button>
  </div>
</div>

<div className="typing">
  <span></span>
  <span></span>
  <span></span>
</div>
      </div>
      <div className="chat-suggestions">
        <button>Phòng còn trống không ạ?</button>
        <button>Em muốn xem phòng vào cuối tuần.</button>
        <button>Anh/chị cho em xin địa chỉ cụ thể.</button>
      </div>
      {/* Input */}
      <div className="chat-input">
  <button className="icon-btn">😊</button>
  <input type="text" placeholder="Viết tin nhắn..." />
  <button className="icon-btn">📎</button>
  <button className="send-btn">➤</button>
</div>


      {/* Quick suggestions */}
      
    </div>
  );
};

export default ChatWindow;
