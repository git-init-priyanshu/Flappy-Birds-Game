const express = require("express");
const app = express();
const port = 5000;

const cors = require("cors");
app.use(
  cors({
    origin: "http://127.0.0.1:5500",
  })
);

const { Server, Socket } = require("socket.io");
const io = new Server(5001, {
  cors: {
    origin: "http://127.0.0.1:5500",
    methods: ["GET", "POST"],
  },
});

const users = [];
// Socket.io endpoints
io.on("connection", (socket) => {
  socket.on("userJoined", (name) => {
    users.push({ id: socket.id, name, isReady: false });
    console.log(users);
    socket.broadcast.emit("user-joined", users);
    // giving the user initial array
    // socket.broadcast.to(socket.id).emit("get-array", users);
    io.to(socket.id).emit("get-array", users);
  });

  socket.on("ready", (name) => {
    for (let i = 0; i < users.length; i++) {
      if (users[i].name === name) {
        users[i].isReady = true;
      }
    }
    socket.broadcast.emit("user-ready", users);
    console.log(users);
  });

  socket.on("disconnect", () => {
    for (let i = 0; i < users.length; i++) {
      if (users[i].id === socket.id) {
        users.splice(i, 1);
        console.log(users);
        socket.broadcast.emit("user-disconnect", users);
      }
    }
  });
});

app.listen(port, () => {
  console.log("Listening on port:", port);
});
