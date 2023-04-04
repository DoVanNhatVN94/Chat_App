import { useState } from 'react';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import Lobby from './components/Lobby';
import Chat from './components/Chat';
import './App.css';
const App = () => {
  const [connection, setConnection] = useState();
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);

  //Confiu khi có user joinRoom
  const joinRoom = async (user, room) => {
    try {
      //tao một connect map với hub trên sv
      const connection = new HubConnectionBuilder()
        .withUrl("https://localhost:7232/chat")
        .configureLogging(LogLevel.Information)
        .build();

      //Thiết lập các sự kiện lắng nghe nghe ReceiveMessage (nhan mess từ hub),UsersInRoom (nhận ds từ hub) ,
      // onclose là sk khi đóng connect bởi phương thức closeConnection
      connection.on("ReceiveMessage", (user, message) => {
        setMessages(messages => [...messages, { user, message }]);
      });

      connection.on("UsersInRoom", (users) => {
        setUsers(users);
      });

      connection.onclose(e => {
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
  }
  // tạo phương thức thông báo có tin nhắn mới
  const sendMessage = async (message) => {
    try {
      await connection.invoke("SendMessage", message);
    } catch (e) {
      console.log(e);
    }
  }

// tạo phương thức dóng connect hiện tại
  const closeConnection = async () => {
    try {
      await connection.stop();
    } catch (e) {
      console.log(e);
    }
  }

  return <div className='app'>
    <h2>MyChat</h2>
    <hr className='line mx-auto mb-3' />
    {!connection
    //Khi có conect nó sẽ chuyển sang
      ? <Lobby joinRoom={joinRoom} />
      : <Chat sendMessage={sendMessage} messages={messages} users={users} closeConnection={closeConnection} />}
  </div>
}

export default App;
