const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { Server } = require("socket.io");
const http = require("http");

// Load environment variables from .env file
dotenv.config({ path: "./.env" });

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Handle socket connections
io.on("connection", (socket) => {

  // Join a room
  socket.on("joinRoom", (room) => {
    socket.join(room);
    console.log(`Client joined room: ${room}`);
    console.log(`${socket.id} is joined to ${room}`)
  });

  // Broadcast drawing data to the room
  socket.on("draw", (data) => {
    const { room, ...drawData } = data;
    socket.to(room).emit("draw", drawData); // Emit drawing data to clients in the room
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id); // Log when the client disconnects
  });
});

// Set the port from environment variable or default to 8080
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
