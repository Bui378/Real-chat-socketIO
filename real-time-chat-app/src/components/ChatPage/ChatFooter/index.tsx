/** @format */

import React, { useState } from "react";
import DOMPurify from "dompurify";

interface ChatFooterPropsInterface {
  socket: any;
  inputStatus: boolean;
}

const ChatFooter: React.FC<ChatFooterPropsInterface> = ({
  socket,
  inputStatus,
}) => {
  const [message, setMessage] = useState("");

  const handleTyping = () => {
    socket.emit("typing", `${localStorage.getItem("userName")} is typing`);
  };

  const handleSendMessage = (e: any) => {
    e.preventDefault();
    const userName = localStorage.getItem("userName");
    if (message.trim() && userName) {
      const sanitizedMessage = DOMPurify.sanitize(message);
      const sanitizedUserName = DOMPurify.sanitize(userName);
      socket.emit("message", {
        text: sanitizedMessage,
        name: sanitizedUserName,
        id: `${socket.id}${Math.random()}`,
        socketID: socket.id,
      });
    }
    setMessage("");
    socket.emit("typing", ``);
  };
  return (
    <div className='chat__footer'>
      <form className='form' onSubmit={handleSendMessage}>
        <input
          type='text'
          placeholder='Write message'
          className='message'
          disabled={!inputStatus}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleTyping}
        />
        <button className='sendBtn'>SEND</button>
      </form>
    </div>
  );
};

export default ChatFooter;
