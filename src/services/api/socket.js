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
      console.error('❌ No authentication token found');
      return null;
    }

    // Debug token information
    console.log('🔑 Connecting with token:', authToken.substring(0, 20) + '...');
    
    // Try to decode token to check expiration (basic check)
    try {
      const tokenPayload = JSON.parse(atob(authToken.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      
      if (tokenPayload.exp && tokenPayload.exp < currentTime) {
        console.error('❌ Token is expired:', new Date(tokenPayload.exp * 1000));
        return null;
      }
      
      console.log('✅ Token appears valid, user ID:', tokenPayload.id || tokenPayload.userId || tokenPayload.sub);
    } catch (error) {
      console.warn('⚠️ Could not decode token:', error.message);
    }

    // Try different token formats based on backend requirements
    console.log('🔗 Attempting to connect to:', SOCKET_URL);
    
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
      console.log('✅ Connected to chat server');
      this.isConnected = true;
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Socket connection failed:', error.message);
      this.isConnected = false;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('🔌 Disconnected from server:', reason);
      this.isConnected = false;
    });

    // Error handler
    this.socket.on('error', (error) => {
      console.error('🚨 Socket error:', error.message);
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
      console.log('🚪 Joining conversation:', conversationId);
      this.socket.emit('joinConversation', conversationId);
    }
  }

  // Leave conversation room
  leaveConversation(conversationId) {
    if (this.socket?.connected) {
      console.log('🚪 Leaving conversation:', conversationId);
      this.socket.emit('leaveConversation', conversationId);
    }
  }

  // Send message via socket
  sendMessage(conversationId, content) {
    if (this.socket?.connected) {
      console.log('📤 Sending message via socket:', { conversationId, content });
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
      console.error('❌ No token available for testing');
      return;
    }

    console.log('🧪 Testing socket connection...');
    console.log('🔑 Token (first 30 chars):', token.substring(0, 30) + '...');
    
    // Decode and log token payload
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('📋 Token payload:', payload);
      console.log('👤 User ID:', payload.id || payload.userId || payload.sub);
      console.log('⏰ Expires:', payload.exp ? new Date(payload.exp * 1000) : 'No expiration');
    } catch (error) {
      console.error('❌ Failed to decode token:', error);
    }

    // Test different auth formats
    const testFormats = [
      { name: 'Plain token', auth: { token } },
      { name: 'Bearer token', auth: { token: `Bearer ${token}` } },
      { name: 'Authorization header', auth: { authorization: `Bearer ${token}` } },
    ];

    testFormats.forEach((format, index) => {
      setTimeout(() => {
        console.log(`🧪 Testing format ${index + 1}: ${format.name}`);
        
        const testSocket = io(SOCKET_URL, {
          auth: format.auth,
          transports: ["websocket"],
          timeout: 5000,
        });

        testSocket.on('connect', () => {
          console.log(`✅ Format ${index + 1} SUCCESS: ${format.name}`);
          testSocket.disconnect();
        });

        testSocket.on('connect_error', (error) => {
          console.log(`❌ Format ${index + 1} FAILED: ${format.name} - ${error.message}`);
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