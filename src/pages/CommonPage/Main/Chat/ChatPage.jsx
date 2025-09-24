import Sidebar from "../Chat/ChatSibar/Sidebar";
import ChatWindow from "../Chat/ChatWindow/ChatWindow";
import RoomInfo from "../Chat/RoomInfo/RoomInfo";
import "./ChatPage.css";

const ChatPage = () => {
  return (
    <div className="chat-container">
      {/* Sidebar trái */}
      <Sidebar />

      {/* Khu chat chính */}
      <ChatWindow />

      {/* Thông tin phòng bên phải */}
      <RoomInfo />
    </div>
  );
};

export default ChatPage;
