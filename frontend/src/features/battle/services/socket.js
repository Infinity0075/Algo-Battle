import { io } from "socket.io-client";

let socket;

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace("/api", "") ||
  "http://localhost:5005";

export const connectSocket = (roomId, username) => {
  if (!socket) {
    socket = io(BASE_URL, {
      transports: ["polling", "websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
  }

  if (roomId && username) {
    if (socket.connected) {
      socket.emit("join_room", { roomId, username });
    } else {
      socket.once("connect", () => {
        socket.emit("join_room", { roomId, username });
      });
    }
  }

  return socket;
};

export const getSocket = () => socket;

export const sendCodeChange = (code) => {
  if (socket?.connected) {
    socket.emit("code_change", { code });
  }
};

export const sendSubmit = (code, language = "javascript") => {
  if (socket?.connected) {
    socket.emit("submit_code", { code, language });
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
