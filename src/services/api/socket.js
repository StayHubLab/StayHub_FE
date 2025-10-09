import { io } from "socket.io-client";

const SOCKET_URL = process.env.REACT_APP_API_URL?.replace("/api", "") || "http://localhost:5000";

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect(token) {
    if (this.socket?.connected) {
      return this.socket;
    }

    // Get token with better validation
    const authToken = token || localStorage.getItem("token") || localStorage.getItem("authToken");
    
    if (!authToken) {
      return null;
    }

    // Try to decode token to check expiration (basic check)
    try {
      const tokenPayload = JSON.parse(atob(authToken.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      
      if (tokenPayload.exp && tokenPayload.exp < currentTime) {
        return null;
      }
    } catch (error) {
      // Could not decode token
    }

    this.socket = io(SOCKET_URL, {
      auth: {
        token: authToken // Try without Bearer first, as per your backend integration guide
      },
      transports: ["websocket", "polling"], // Add polling as fallback
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000, // 10 second timeout
    });

    // Connection event handlers
    this.socket.on('connect', () => {
      this.isConnected = true;
    });

    this.socket.on('connect_error', (error) => {
      this.isConnected = false;
    });

    this.socket.on('disconnect', (reason) => {
      this.isConnected = false;
    });

    // Error handler
    this.socket.on('error', (error) => {
      // Socket error occurred
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Join conversation room
  joinConversation(conversationId) {
    if (this.socket?.connected) {
      this.socket.emit('joinConversation', conversationId);
    }
  }

  // Leave conversation room
  leaveConversation(conversationId) {
    if (this.socket?.connected) {
      this.socket.emit('leaveConversation', conversationId);
    }
  }

  // Send message via socket
  sendMessage(conversationId, content) {
    if (this.socket?.connected) {
      this.socket.emit('sendMessage', {
        conversationId,
        content
      });
      return true;
    }
    return false;
  }

  // Send typing indicator
  setTyping(conversationId, isTyping) {
    if (this.socket?.connected) {
      this.socket.emit('typing', {
        conversationId,
        isTyping
      });
    }
  }

  // Event listeners
  onNewMessage(callback) {
    if (this.socket) {
      this.socket.on('newMessage', callback);
    }
  }

  onUserTyping(callback) {
    if (this.socket) {
      this.socket.on('userTyping', callback);
    }
  }

  onUserOnline(callback) {
    if (this.socket) {
      this.socket.on('userOnline', callback);
    }
  }

  onUserOffline(callback) {
    if (this.socket) {
      this.socket.on('userOffline', callback);
    }
  }

  // Remove event listeners
  offNewMessage(callback) {
    if (this.socket) {
      this.socket.off('newMessage', callback);
    }
  }

  offUserTyping(callback) {
    if (this.socket) {
      this.socket.off('userTyping', callback);
    }
  }

  offUserOnline(callback) {
    if (this.socket) {
      this.socket.off('userOnline', callback);
    }
  }

  offUserOffline(callback) {
    if (this.socket) {
      this.socket.off('userOffline', callback);
    }
  }

  getSocket() {
    return this.socket;
  }

  isSocketConnected() {
    return this.socket?.connected || false;
  }

  // Debug function to test different token formats
  testConnection(customToken = null) {
    const token = customToken || localStorage.getItem("token") || localStorage.getItem("authToken");
    
    if (!token) {
      return;
    }

    // Decode and log token payload
    try {
      JSON.parse(atob(token.split('.')[1]));
    } catch (error) {
      // Failed to decode token
    }

    // Test different auth formats
    const testFormats = [
      { name: 'Plain token', auth: { token } },
      { name: 'Bearer token', auth: { token: `Bearer ${token}` } },
      { name: 'Authorization header', auth: { authorization: `Bearer ${token}` } },
    ];

    testFormats.forEach((format, index) => {
      setTimeout(() => {
        const testSocket = io(SOCKET_URL, {
          auth: format.auth,
          transports: ["websocket"],
          timeout: 5000,
        });

        testSocket.on('connect', () => {
          testSocket.disconnect();
        });

        testSocket.on('connect_error', (error) => {
          testSocket.disconnect();
        });
      }, index * 2000); // Stagger tests by 2 seconds
    });
  }
}

// Create singleton instance
const socketService = new SocketService();

// Make socketService available globally for debugging
if (typeof window !== 'undefined') {
  window.socketService = socketService;
  window.testSocketConnection = () => socketService.testConnection();
}

export default socketService;