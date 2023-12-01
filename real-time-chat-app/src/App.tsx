/** @format */

import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home, ChatPage } from "./components";
import { ToastContainer, toast } from "react-toastify";
import * as io from "socket.io-client";
import "react-toastify/dist/ReactToastify.css";

const socket = io.connect("http://localhost:4000");

socket.on("connect", () => {
  toast.success("WebSocket connection established !");
});
// Listen for 'disconnect' event
socket.on("disconnect", () => {
  toast.error("WebSocket connection lost");
});

// Listen for 'connect_error' event
socket.on("connect_error", (error) => {
  toast.error("WebSocket connection closed");
});

// Listen for 'reconnect' event
socket.on("reconnect", () => {
  toast.success("WebSocket connection reestablished !");
});

// Listen for 'reconnect_error' event
socket.on("reconnect_error", (error) => {
  toast.error("WebSocket reconnection closed.");
});

function App() {
  const [socketStatus, setSocketStatus] = useState(true);

  socket.on("connect", () => {
    setSocketStatus(true);
  });
  socket.on("disconnect", () => {
    setSocketStatus(false);
  });
  socket.on("connect_error", (error) => {
    setSocketStatus(false);
  });

  return (
    <BrowserRouter>
      <div>
        <ToastContainer closeOnClick />
        <Routes>
          <Route
            path='/'
            element={
              <Home socket={socket} socketStatus={socketStatus} />
            }></Route>
          <Route
            path='/chat'
            element={
              <ChatPage socket={socket} socketStatus={socketStatus} />
            }></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
