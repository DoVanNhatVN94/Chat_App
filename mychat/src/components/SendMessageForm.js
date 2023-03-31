import { Form, Button, FormControl, InputGroup } from "react-bootstrap";
import { useState } from "react";

const SendMessageForm = ({ sendMessage }) => {
  const [message, setMessage] = useState("");

  return (
    <Form
      onSubmit={e => {
        e.preventDefault();
        console.log(typeof message,typeof sendMessage);
    
        sendMessage(message);
        setMessage("");
      }}
    >
      <InputGroup>
        <InputGroup>
          <FormControl
            type="user"
            placeholder="message..."
            onChange={(e) => setMessage(e.target.value)}
            value={message}
          />
        </InputGroup>
        <InputGroup>
          <Button variant="primary" type="submit" disabled={!message}>
            Send
          </Button>
        </InputGroup>
      </InputGroup>
    </Form>
  );
};

export default SendMessageForm;
