/** @format */
import { useState, useEffect, useRef } from "react";
import ChatBar from "./ChatBar";
import ChatBody from "./ChatBody";
import ChatFooter from "./ChatFooter";

interface ChatPagePropsInterface {
  socket: any;
  socketStatus: boolean;
}

interface MessageInterface {
  text: string;
  name: string;
  id: number;
  socketId: number;
}

export const ChatPage: React.FC<ChatPagePropsInterface> = ({
  socket,
  socketStatus,
}) => {
  const [messages, setMessages] = useState<MessageInterface[]>([]);
  const [typingStatus, setTypingStatus] = useState("");
  const lastMessageRef = useRef<null | HTMLDivElement>(null);
  const [inputStatus, setInputStatus] = useState(true);

  useEffect(() => {
    if (!socket.connected) setInputStatus(false);
    else setInputStatus(true);
  }, [socket.connected]);

  useEffect(() => {
    if (!socket.connected) setInputStatus(false);
    socket.on("messageResponse", (data: any) =>
      setMessages([...messages, data])
    );
  }, [socket, messages]);

  useEffect(() => {
    // scroll to bottom every time messages change
    lastMessageRef.current?.scrollIntoView({
      block: "end",
      behavior: "smooth",
    });
  }, [messages]);

  useEffect(() => {
    socket.on("typingResponse", (data: any) => {
      setTypingStatus(data);
    });
  }, [socket]);

  return (
    <div className='chat'>
      <ChatBar socket={socket} setInputStatus={setInputStatus} />
      <div className='chat__main'>
        <ChatBody
          messages={messages}
          lastMessageRef={lastMessageRef}
          typingStatus={typingStatus}
        />
        <ChatFooter socket={socket} inputStatus={socketStatus} />
      </div>
    </div>
  );
};
