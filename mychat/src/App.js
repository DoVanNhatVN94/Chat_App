import { useState } from 'react';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import Lobby from './components/Lobby';
import Chat from './components/Chat';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const App = () => {
  const [connection, setConnection] = useState();
  const [messages, setMessages] = useState([]);
  // const [users, setUsers] = useState([]);

  const joinRoom = async (user, room) => {
    try {
      const connection = new HubConnectionBuilder()
        .withUrl("https://localhost:7232/chat")
        .configureLogging(LogLevel.Information)
        .build();

      console.log(connection);
      //ReceiveMessage
      connection.on("ReceiveMessage", (user, message) => {
        setMessages(messages => [...messages, { user, message }]);
        console.log(user,message)
      });

      // connection.on("UsersInRoom", (users) => {
      //   // setUsers(users);
      //   console.log(users)
      // });

      // connection.onclose(e => {
      //   setConnection();
      //   setMessages([]);
      //   setUsers([]);
      // });

      await connection.start();
      console.log("first")
      await connection.invoke("JoinRoom", { user, room });

      setConnection(connection);
    } catch (e) {
      console.log(e);
    }
  }

  const sendMessage = async (message) => {
    try {
      await connection.invoke("SendMessage", message);
      console.log(message)
    } catch (e) {
      console.log(e);
    }
  }


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
      ? <Lobby joinRoom={joinRoom} />
      : <Chat sendMessage={sendMessage} messages={messages}></Chat>}
  </div>
}

export default App;
