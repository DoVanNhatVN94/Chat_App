import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import React, { createContext, useContext, useState } from 'react'

  function useHook() {
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
  const myContext = createContext({
    messages,
    joinRoom,
    sendMessage,
    closeConnection

  })
  return myContext;
}
export default useHook;

