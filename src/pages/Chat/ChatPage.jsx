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
    <div style={{ display: "flex", height: "100vh" }}>
      <div className="chat-sidebar border-end p-3">
  {/* Header */}
  <div className="d-flex justify-content-between align-items-center mb-3">
  <h6 className="mb-0 fw-semibold text-dark small">Tin nhắn</h6>
  <button
    className="btn rounded-pill px-4 py-2 shadow-sm"
    style={{
      backgroundColor: "#5A42F3",
      color: "white",
      fontWeight: "500",
      fontSize: "14px"
    }}
  >
    + Soạn
  </button>
</div>


{/* Search */}
<div className="mb-3 position-relative">
  <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
  <input
    type="text"
    className="form-control form-control-sm rounded-pill ps-5"
    placeholder="Tìm kiếm cuộc trò chuyện..."
  />
</div>

{/* Filter tabs */}
<div className="mb-3 d-flex gap-2">
  <button
    className="btn btn-sm rounded-pill px-3 active-tab">
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
  <div className="mb-2 text-muted small fw-bold">Đã ghim</div>
  {conversations
    .filter((c) => c.isPinned)
    .map((conv) => {
      const other = conv.participants.find((p) => p._id !== currentUser._id);
      return (
        <div
          key={conv._id}
          className={`conversation-item d-flex align-items-start p-2 rounded mb-2 ${
            selectedConv?._id === conv._id ? "active" : ""
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
              <small className="text-muted">14:35</small>
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
  <div className="mt-3 mb-2 text-muted small fw-bold">Gần đây</div>
  {conversations
    .filter((c) => !c.isPinned)
    .map((conv) => {
      const other = conv.participants.find((p) => p._id !== currentUser._id);
      return (
        <div
          key={conv._id}
          className={`conversation-item d-flex align-items-start p-2 rounded mb-2 ${
            selectedConv?._id === conv._id ? "active" : ""
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



      {/* Box chat */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
  {selectedConv ? (
    <>
      <div style={{ flex: 1, overflowY: "auto", padding: "10px" }}>
        {messages.map((msg) => {
          const isMe = msg.sender._id === currentUser._id;
          return (
            <div
              key={msg._id}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: isMe ? "flex-end" : "flex-start",
                margin: "8px 0",
              }}
            >
              {/* bubble */}
              <div
                style={{
                  display: "inline-block",
                  padding: "10px 14px",
                  borderRadius: "16px",
                  maxWidth: "60%",
                  background: isMe ? "#5A42F3" : "#f5f5f5",
                  color: isMe ? "#fff" : "#000",
                  textAlign: "left",
                  fontSize: "14px",
                }}
              >
                {msg.content}
              </div>

              {/* time */}
              <span
                style={{
                  fontSize: "11px",
                  color: "#888",
                  marginTop: "4px",
                }}
              >
                {new Date(msg.createdAt).toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          );
        })}

        {/* 👇 chốt để scroll xuống */}
        <div ref={messagesEndRef} />
      </div>

      {/* input */}
      <div
        style={{
          display: "flex",
          padding: "10px",
          borderTop: "1px solid #ddd",
        }}
      >
        <input
          style={{ flex: 1, padding: "10px", borderRadius: "20px", border: "1px solid #ddd" }}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Nhập tin nhắn..."
        />
        <button
          onClick={handleSend}
          style={{
            marginLeft: "10px",
            backgroundColor: "#5A42F3",
            color: "white",
            border: "none",
            borderRadius: "20px",
            padding: "0 16px",
          }}
        >
          Gửi
        </button>
      </div>
    </>
  ) : (
    <div
      style={{
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <p>Chọn 1 cuộc trò chuyện để bắt đầu chat</p>
    </div>
  )}
</div>

    </div>
  );
}
