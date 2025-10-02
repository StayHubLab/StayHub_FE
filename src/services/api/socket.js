// src/services/socket.js
import { io } from "socket.io-client";

const SOCKET_URL = process.env.REACT_APP_API_URL?.replace("/api", "") || "http://localhost:5000";

// Kết nối socket
const socket = io(SOCKET_URL, {
  auth: {
    token: localStorage.getItem("token"), // gửi token qua socket
  },
  transports: ["websocket"],
});

export default socket;
