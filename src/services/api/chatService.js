// src/services/chatService.js
import apiClient from "../api/apiClient.js";

const chatService = {
  // Lấy danh sách hội thoại của user
  getConversations: () => apiClient.get("/chat/conversations"),

  // Tạo hội thoại mới hoặc lấy hội thoại sẵn có
  createConversation: (recipientId) =>
    apiClient.post("/chat/conversations", { recipientId }),

  // Lấy danh sách tin nhắn trong 1 hội thoại
  getMessages: (conversationId, params = {}) =>
    apiClient.get(`/chat/messages/${conversationId}`, { params }),

  // Gửi tin nhắn
  sendMessage: (conversationId, content) =>
    apiClient.post("/chat/messages", {
      conversationId,
      content,
    }),
};

export default chatService;
