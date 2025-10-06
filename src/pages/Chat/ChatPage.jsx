import { useEffect, useRef, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { message } from "antd";
import { useAuth } from "../../contexts/AuthContext";
import chatService from "../../services/api/chatService";
import socketService from "../../services/api/socket";
import './ChatPage.css';

export default function ChatPage() {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const initialConvId = query.get("conversationId");

  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [isSocketConnected, setIsSocketConnected] = useState(false);

  const { user: currentUser } = useAuth();
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Socket connection and authentication
  useEffect(() => {
    if (!currentUser) return;

    const token = localStorage.getItem("token") || localStorage.getItem("authToken");
    if (!token) {
      message.error("Không tìm thấy token xác thực - vui lòng đăng nhập lại");
      return;
    }

    // Connect to socket
    const socket = socketService.connect(token);
    
    if (!socket) {
      message.error("Không thể kết nối chat - token không hợp lệ");
      return;
    }

    // Check connection status with a delay to ensure proper connection
    const checkConnection = () => {
      setIsSocketConnected(socketService.isSocketConnected());
    };
    
    // Check connection immediately and after a short delay
    checkConnection();
    const connectionTimer = setTimeout(checkConnection, 1000);

    // Setup socket event listeners
    const handleNewMessage = (msg) => {
      // Only add message if it belongs to current conversation
      if (selectedConv && msg.conversationId === selectedConv._id) {
        setMessages(prev => {
          // Avoid duplicate messages
          const exists = prev.some(m => m._id === msg._id);
          if (exists) return prev;
          return [...prev, msg];
        });
      }

      // Update conversation list with latest message
      setConversations(prev => prev.map(conv => {
        if (conv._id === msg.conversationId) {
          return {
            ...conv,
            lastMessage: {
              content: msg.content,
              createdAt: msg.createdAt
            }
          };
        }
        return conv;
      }));
    };

    const handleUserTyping = ({ userId, userName, conversationId, isTyping: userIsTyping }) => {
      if (selectedConv && conversationId === selectedConv._id && userId !== currentUser._id) {
        setTypingUsers(prev => {
          const newSet = new Set(prev);
          if (userIsTyping) {
            newSet.add(userName);
          } else {
            newSet.delete(userName);
          }
          return newSet;
        });
      }
    };

    const handleUserOnline = ({ userId, userName }) => {
      setOnlineUsers(prev => new Set([...prev, userId]));
    };

    const handleUserOffline = ({ userId, userName }) => {
      setOnlineUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    };

    // Register event listeners
    socketService.onNewMessage(handleNewMessage);
    socketService.onUserTyping(handleUserTyping);
    socketService.onUserOnline(handleUserOnline);
    socketService.onUserOffline(handleUserOffline);

    // Monitor connection status
    if (socket) {
      socket.on('connect', () => {
        setIsSocketConnected(true);
      });

      socket.on('disconnect', () => {
        setIsSocketConnected(false);
      });

      socket.on('connect_error', (error) => {
        setIsSocketConnected(false);
        
        if (error.message.includes('User not found')) {
          message.error("Không tìm thấy người dùng - vui lòng đăng nhập lại");
        } else if (error.message.includes('Authentication')) {
          message.error("Lỗi xác thực - vui lòng đăng nhập lại");
        }
      });
    }

    // Cleanup on unmount
    return () => {
      clearTimeout(connectionTimer);
      socketService.offNewMessage(handleNewMessage);
      socketService.offUserTyping(handleUserTyping);
      socketService.offUserOnline(handleUserOnline);
      socketService.offUserOffline(handleUserOffline);
      
      if (selectedConv) {
        socketService.leaveConversation(selectedConv._id);
      }
    };
  }, [currentUser, selectedConv]);

  // Fetch conversations on component mount
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await chatService.getConversations();
        setConversations(res.data.conversations || []);

        // Auto-select conversation from URL
        if (initialConvId) {
          const found = res.data.conversations.find((c) => c._id === initialConvId);
          if (found) {
            setSelectedConv(found);
          }
        }
      } catch (error) {
        console.error("Error fetching conversations:", error);
        message.error("Không thể tải danh sách cuộc trò chuyện");
      }
    };

    if (currentUser) {
      fetchConversations();
    }
  }, [initialConvId, currentUser]);

  // Handle conversation selection
  useEffect(() => {
    if (!selectedConv) return;

    // Leave previous conversation
    const previousConv = conversations.find(c => c._id !== selectedConv._id);
    if (previousConv) {
      socketService.leaveConversation(previousConv._id);
    }

    // Join new conversation
    socketService.joinConversation(selectedConv._id);

    // Fetch messages for selected conversation
    const fetchMessages = async () => {
      try {
        const res = await chatService.getMessages(selectedConv._id);
        const fetchedMessages = res.data.messages || [];
        
        // Sort messages from oldest to newest
        const sortedMessages = fetchedMessages.sort((a, b) => 
          new Date(a.createdAt) - new Date(b.createdAt)
        );
        
        setMessages(sortedMessages);
      } catch (error) {
        console.error("Error fetching messages:", error);
        message.error("Không thể tải tin nhắn");
      }
    };

    fetchMessages();

    // Clear typing users when switching conversations
    setTypingUsers(new Set());

  }, [selectedConv, conversations]);

  // Handle typing with debounce
  const handleTyping = useCallback((value) => {
    setNewMessage(value);

    if (!selectedConv) return;

    // Send typing indicator
    if (!isTyping) {
      setIsTyping(true);
      socketService.setTyping(selectedConv._id, true);
    }

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socketService.setTyping(selectedConv._id, false);
    }, 1000);
  }, [selectedConv, isTyping]);

  // Handle send message
  const handleSend = async () => {
    if (!newMessage.trim() || !selectedConv) return;

    const messageContent = newMessage.trim();
    setNewMessage("");

    // Stop typing indicator
    setIsTyping(false);
    socketService.setTyping(selectedConv._id, false);

    try {
      // Try to send via socket first (real-time)
      const socketSent = socketService.sendMessage(selectedConv._id, messageContent);
      
      if (!socketSent) {
        // Fallback to REST API if socket fails
        await chatService.sendMessage(selectedConv._id, messageContent);
        
        // Manually add message to UI since socket isn't working
        const newMsg = {
          _id: `temp-${Date.now()}`,
          content: messageContent,
          sender: currentUser,
          conversationId: selectedConv._id,
          createdAt: new Date().toISOString()
        };
        setMessages(prev => [...prev, newMsg]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      message.error("Không thể gửi tin nhắn");
      
      // Restore message if sending fails
      setNewMessage(messageContent);
    }
  };

  // Handle conversation selection
  const handleSelectConversation = (conv) => {
    if (selectedConv?._id === conv._id) return;
    
    setSelectedConv(conv);
    setMessages([]);
    setTypingUsers(new Set());
  };

  // Get other participant in conversation
  const getOtherParticipant = (conv) => {
    return conv.participants?.find((p) => p._id !== currentUser._id);
  };

  // Check if user is online
  const isUserOnline = (userId) => {
    return onlineUsers.has(userId);
  };

  if (!currentUser) {
    return (
      <div className="chat-page-container">
        <div className="chat-empty">
          <div className="chat-empty-icon">🔒</div>
          <h3>Cần đăng nhập</h3>
          <p>Bạn cần đăng nhập để sử dụng tính năng chat</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-page-container">
      {/* Sidebar */}
      <div className="chat-sidebar border-end p-3">
        {/* Header */}
        <div className="chat-sidebar-header">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="mb-0 fw-semibold text-dark small">
              Tin nhắn 
              {isSocketConnected ? (
                <span className="badge bg-success ms-2" style={{ fontSize: "10px" }}>
                  ● Online
                </span>
              ) : (
                <span className="badge bg-warning ms-2" style={{ fontSize: "10px" }}>
                  ● Offline
                </span>
              )}
            </h6>
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

        {/* Conversations List */}
        <div className="conversations-list">
          {conversations.length === 0 ? (
            <div className="text-center py-4">
              <div className="text-muted">Chưa có cuộc trò chuyện nào</div>
            </div>
          ) : (
            conversations.map((conv) => {
              const other = getOtherParticipant(conv);
              const isOnline = other ? isUserOnline(other._id) : false;
              
              return (
                <div
                  key={conv._id}
                  className={`conversation-item d-flex align-items-start p-2 rounded mb-2 ${
                    selectedConv?._id === conv._id ? "active" : ""
                  }`}
                  onClick={() => handleSelectConversation(conv)}
                  style={{ cursor: "pointer" }}
                >
                  {/* Avatar with online indicator */}
                  <div className="position-relative me-2">
                    <div className="avatar rounded-circle d-flex align-items-center justify-content-center">
                      {other?.name?.charAt(0).toUpperCase() || "?"}
                    </div>
                    {isOnline && (
                      <div 
                        className="position-absolute"
                        style={{
                          bottom: "0",
                          right: "0",
                          width: "12px",
                          height: "12px",
                          backgroundColor: "#52c41a",
                          borderRadius: "50%",
                          border: "2px solid white"
                        }}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-bold">
                        {other?.name || "Ẩn danh"}
                        {isOnline && (
                          <small className="text-success ms-1">● online</small>
                        )}
                      </span>
                      <small className="text-muted">
                        {conv.lastMessage?.createdAt ? 
                          new Date(conv.lastMessage.createdAt).toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          }) : ""
                        }
                      </small>
                    </div>
                    <div className="text-truncate small text-muted">
                      {typeof conv.lastMessage === 'string' 
                        ? conv.lastMessage 
                        : conv.lastMessage?.content || "Chưa có tin nhắn"}
                    </div>
                    <small className="text-muted">{other?.role || "user"}</small>
                  </div>
                </div>
              );
            })
          )}
        </div>
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
                    {getOtherParticipant(selectedConv)?.name?.charAt(0).toUpperCase() || "?"}
                  </div>
                  <div className="chat-header-info">
                    <h6>
                      {getOtherParticipant(selectedConv)?.name || "Ẩn danh"}
                    </h6>
                    {/* <span className="status">
                      {isUserOnline(getOtherParticipant(selectedConv)?._id) 
                        ? "Đang hoạt động" 
                        : "Không hoạt động"}
                    </span> */}
                  </div>
                </div>
                <div className="chat-connection-status">
                  {isSocketConnected ? (
                    <span className="badge bg-success">Real-time</span>
                  ) : (
                    <span className="badge bg-warning">REST API</span>
                  )}
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="chat-messages">
              {messages.map((msg) => {
                const isMe = msg.sender._id === currentUser._id || msg.sender === currentUser._id;
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

              {/* Typing Indicator */}
              {typingUsers.size > 0 && (
                <div className="message-group other">
                  <div className="typing-indicator">
                    <span>{Array.from(typingUsers).join(", ")} đang nhập...</span>
                    <div className="typing-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="chat-input">
              <div className="chat-input-container">
                <input
                  className="chat-input-field"
                  value={newMessage}
                  onChange={(e) => handleTyping(e.target.value)}
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