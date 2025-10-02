import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import chatService from "../../services/api/chatService";
import socket from "../../services/api/socket";
import './ChatPage.css';
export default function ChatPage() {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const initialConvId = query.get("conversationId");

  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const { user: currentUser } = useAuth();
  const messagesEndRef = useRef(null);

  // ✅ auto scroll xuống cuối khi messages thay đổi
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    const fetchConversations = async () => {
      const res = await chatService.getConversations();
      setConversations(res.data.conversations);

      if (initialConvId) {
        const found = res.data.conversations.find((c) => c._id === initialConvId);
        if (found) setSelectedConv(found);
      }
    };
    if (currentUser) fetchConversations();
  }, [initialConvId, currentUser]);

  useEffect(() => {
    if (selectedConv) {
      socket.emit("joinRoom", selectedConv._id);

      const fetchMessages = async () => {
        const res = await chatService.getMessages(selectedConv._id);
        // 👇 đảm bảo sort từ cũ → mới (nếu API trả desc thì reverse lại)
        setMessages((res.data.messages || []).reverse());
      };
      fetchMessages();
    }
  }, [selectedConv]);

  useEffect(() => {
    if (!socket || !selectedConv?._id) return;

    const handleNewMessage = (msg) => {
      console.log("📩 Received message:", msg);
      if (msg.conversation?.toString() === selectedConv._id.toString()) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("newMessage", handleNewMessage);

    // Cleanup để tránh duplicate listener
    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, selectedConv?._id]);


  const handleSend = async () => {
    if (!newMessage.trim()) return;
    await chatService.sendMessage(selectedConv._id, newMessage);
    setNewMessage("");
  };

  if (!currentUser) {
    return <p>Bạn cần đăng nhập để sử dụng chat</p>;
  }

  return (
    <div className="chat-page-container">
      <div className="chat-sidebar border-end p-3">
        {/* Header */}
        <div className="chat-sidebar-header">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="mb-0 fw-semibold text-dark small">Tin nhắn</h6>
            <button className="chat-compose-btn">
              + Soạn
            </button>
          </div>
        </div>


        {/* Search */}
        <div className="chat-search-container">
          <div className="position-relative">
            <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
            <input
              type="text"
              className="form-control form-control-sm rounded-pill ps-5"
              placeholder="Tìm kiếm cuộc trò chuyện..."
            />
          </div>
        </div>

        {/* Filter tabs */}
        <div className="chat-filters">
          <button className="btn btn-sm rounded-pill px-3 active-tab">
            Tất cả
          </button>
          <button className="btn btn-sm rounded-pill px-3 inactive-tab">
            Chưa đọc
          </button>
          <button className="btn btn-sm rounded-pill px-3 inactive-tab">
            Đã ghim
          </button>
        </div>

        {/* Section: Đã ghim */}
        <div className="chat-section-title">Đã ghim</div>
        {conversations
          .filter((c) => c.isPinned)
          .map((conv) => {
            const other = conv.participants.find((p) => p._id !== currentUser._id);
            return (
              <div
                key={conv._id}
                className={`conversation-item d-flex align-items-start p-2 rounded mb-2 ${selectedConv?._id === conv._id ? "active" : ""
                  }`}
                onClick={() => setSelectedConv(conv)}
              >
                {/* Avatar */}
                <div className="avatar rounded-circle me-2 d-flex align-items-center justify-content-center">
                  {other?.name?.charAt(0).toUpperCase()}
                </div>

                {/* Nội dung */}
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold">{other?.name || "Ẩn danh"}</span>
                    <smallƯ className="text-muted">14:35</smallƯ>
                  </div>
                  <div className="text-truncate small text-muted">
                    {conv.lastMessage || "Chưa có tin nhắn"}
                  </div>
                  <small className="text-muted">{other?.role || "user"}</small>
                </div>
              </div>
            );
          })}

        {/* Section: Gần đây */}
        <div className="chat-section-title">Gần đây</div>
        {conversations
          .filter((c) => !c.isPinned)
          .map((conv) => {
            const other = conv.participants.find((p) => p._id !== currentUser._id);
            return (
              <div
                key={conv._id}
                className={`conversation-item d-flex align-items-start p-2 rounded mb-2 ${selectedConv?._id === conv._id ? "active" : ""
                  }`}
                onClick={() => setSelectedConv(conv)}
              >
                {/* Avatar */}
                <div className="avatar rounded-circle me-2 d-flex align-items-center justify-content-center">
                  {other?.name?.charAt(0).toUpperCase()}
                </div>

                {/* Nội dung */}
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold">{other?.name || "Ẩn danh"}</span>

                  </div>
                  <div className="text-truncate small text-muted">
                    {Array.isArray(conv.lastMessage)
                      ? conv.lastMessage[conv.lastMessage.length - 1]?.content
                      : conv.lastMessage?.content || "Chưa có tin nhắn"}
                  </div>
                  <small className="text-muted">{other?.role || "user"}</small>
                </div>
              </div>
            );
          })}
      </div>



      {/* Chat Main Area */}
      <div className="chat-main">
        {selectedConv ? (
          <>
            {/* Chat Header */}
            <div className="chat-header">
              <div className="chat-header-content">
                <div className="chat-header-user">
                  <div className="chat-header-avatar">
                    {selectedConv.participants
                      .find((p) => p._id !== currentUser._id)
                      ?.name?.charAt(0)
                      .toUpperCase()}
                  </div>
                  <div className="chat-header-info">
                    <h6>
                      {selectedConv.participants.find((p) => p._id !== currentUser._id)
                        ?.name || "Ẩn danh"}
                    </h6>
                    <span className="status">Đang hoạt động</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="chat-messages">
              {messages.map((msg) => {
                const isMe = msg.sender._id === currentUser._id;
                return (
                  <div
                    key={msg._id}
                    className={`message-group ${isMe ? "own" : "other"}`}
                  >
                    <div className={`message-bubble ${isMe ? "own" : "other"}`}>
                      {msg.content}
                    </div>
                    <div className={`message-time ${isMe ? "own" : "other"}`}>
                      {new Date(msg.createdAt).toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                );
              })}

              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="chat-input">
              <div className="chat-input-container">
                <input
                  className="chat-input-field"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Nhập tin nhắn..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                />
                <button
                  onClick={handleSend}
                  className="chat-send-btn"
                  disabled={!newMessage.trim()}
                >
                  ➤
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="chat-empty">
            <div className="chat-empty-icon">
              💬
            </div>
            <h3>Chọn cuộc trò chuyện</h3>
            <p>Hãy chọn một cuộc trò chuyện từ danh sách bên trái để bắt đầu chat</p>
          </div>
        )}
      </div>
    </div>
  );
}
