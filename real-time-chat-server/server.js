/** @format */

const express = require("express");
const app = express();
const PORT = 4000;

//New imports
const http = require("http").Server(app);
const cors = require("cors");
const fs = require("fs");
const xss = require("xss");

app.use(cors());

const socketIO = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000",
  },
});

let users = [];

socketIO.on("connection", (socket) => {
  socket.on("message", (data) => {
    const sanitizedData = {
      text: xss(data.text),
      name: xss(data.name),
      id: `${socket.id}${Math.random()}`,
      socketID: socket.id,
    };
    socketIO.emit("messageResponse", sanitizedData);
  });

  socket.on("typing", (data) => {
    socket.broadcast.emit("typingResponse", data);
  });

  //Listens when a new user joins the server
  socket.on("newUser", (data) => {
    users.push(data);
    socketIO.emit("newUserResponse", users);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
    users = users.filter((user) => user.socketID !== socket.id);
    socketIO.emit("newUserResponse", users);
    socket.disconnect();
  });

  socket.on("error", (error) => {
    console.log("An error occurred", error);
    socket.IO.emit("error", error);
    socket.close();
  });
});

app.get("/api", (req, res) => {
  res.json({
    message: "Hello world",
  });
});

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

// Load SSL certificate for secure WebSocket connection
// const privateKey = fs.readFileSync("path/to/privateKey.pem", "utf8");
// const certificate = fs.readFileSync("path/to/certificate.pem", "utf8");
// const credentials = { key: privateKey, cert: certificate };
// const httpsServer = https.createServer(credentials, app);
// httpsServer.listen(PORT, () => {
//   console.log(`Secure Server listening on ${PORT}`);
// });
