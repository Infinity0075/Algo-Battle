import { io } from "socket.io-client";

let socket;

export const connectSocket = (roomId, username) => {
  socket = io("http://localhost:5005");

  socket.emit("join_room", { roomId, username });

  return socket;
};

export const getSocket = () => socket; // ✅ THIS WAS MISSING

export const sendCodeChange = (code) => {
  if (socket) {
    socket.emit("code_change", { code });
  }
};

export const sendSubmit = (code) => {
  if (socket) {
    socket.emit("submit_code", { code });
  }
};
