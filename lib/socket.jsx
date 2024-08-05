import { io } from 'socket.io-client';

const socket = io("http://localhost:8080");

export const joinRoom = (room) => {
  console.log("room name ",room)
  socket.emit('joinRoom', room);
};

export default socket;
