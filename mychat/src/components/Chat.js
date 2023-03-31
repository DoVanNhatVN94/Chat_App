
import MessageContainer from "./MessageContainer";
import SendMessageForm from "./SendMessageForm";
// import ConnectedUsers from './ConnectedUsers';
// import { Button } from 'react-bootstrap';

// const Chat = ({ sendMessage, messages, users, closeConnection }) => <div>
const Chat = ({ sendMessage, messages }) => {

  
  return (
    <div>
      {/* <div className='leave-room'>
        <Button variant='danger' onClick={() => closeConnection()}>Leave Room</Button>
    </div>
    <ConnectedUsers users={users} /> */}
      <div className="chat">
        <MessageContainer messages={messages} />
        <SendMessageForm  sendMessage={sendMessage}/>
      </div>
    </div>
  );
};
export default Chat;
