
import Lobby from "./components/Lobby";
import Chat from "./components/Chat";
import UseConnection from "./Hooks/UseConnect";

import "./App.css";
const App = () => {


  const {
    connection,
    users,
    messages,
    joinRoom,
    sendMessage,
    closeConnection,
  } = UseConnection();

  return (
    <div className="app">
      <h2>MyChat</h2>
      <hr className="line mx-auto mb-3" />
      {!connection ? (
        //Khi có connecting nó sẽ move sang
        <Lobby joinRoom={joinRoom} />
      ) : (
        <Chat
          sendMessage={sendMessage}
          messages={messages}
          users={users}
          closeConnection={closeConnection}
        />
      )}
    </div>
  );
};

export default App;
