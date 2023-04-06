import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

const AuthContext = createContext({
  connection:"",
  users:"",
  messages:"",
  joinRoom:function(){},
  sendMessage:function(){},
  closeConnection:function(){},
});

export const AuthProvider = ({ children }) => {
  const [connection, setConnection] = useState();
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);

   //Confiu khi có user joinRoom
  const joinRoom = async (user, room) => {
    try {
      //tao một connect map với hub trên sv
      const connection = new HubConnectionBuilder()
        .withUrl("https://localhost:7132/chat")
        .configureLogging(LogLevel.Information)
        .build();

      //Thiết lập các sự kiện lắng nghe nghe ReceiveMessage (nhan mess từ hub),UsersInRoom (nhận ds từ hub) ,
      // onclose là sk khi đóng connect bởi phương thức closeConnection
      connection.on("ReceiveMessage", (user, message) => {
        alert("Có tin nhắn mới !");
        setMessages((messages) => [...messages, { user, message }]);
      });

      connection.on("UsersInRoom", (users) => {
        setUsers(users);
      });

      connection.onclose((e) => {
        setConnection();
        setMessages([]);
        setUsers([]);
      });
      //Start
      await connection.start();
      //Call sự kiện JoinRoom
      await connection.invoke("JoinRoom", { user, room });
      // Lưu connect vào state
      setConnection(connection);
    } catch (e) {
      console.log(e);
    }
  };
  // tạo phương thức thông báo có tin nhắn mới
  const sendMessage = async (message) => {
    try {
      await connection.invoke("SendMessage", message);
    } catch (e) {
      console.log(e);
    }
  };

  // tạo phương thức dóng connect hiện tại
  const closeConnection = async () => {
    try {
      await connection.stop();
    } catch (e) {
      console.log(e);
    }
  };

  const memoedValue = useMemo(
    () => ({
      connection,
      users,
      messages,
      joinRoom,
      sendMessage,
      closeConnection,
    }),
    [connection, users, messages]
  );
  return (
    <AuthContext.Provider value={memoedValue}>{children}</AuthContext.Provider>
  );
};

export default function UseConnection() {
  return useContext(AuthContext);
}
