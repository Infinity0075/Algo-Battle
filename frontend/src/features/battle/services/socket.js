import { io } from "socket.io-client";

let socket;

// 🔥 CONNECT (singleton)
export const connectSocket = (roomId, username) => {
  if (socket?.connected) return socket; // 🔧 prevent multiple connections

  socket = io(
    import.meta.env.VITE_API_BASE_URL?.replace("/api", "") ||
      "http://localhost:5005",
    {
      transports: ["websocket"], // 🔧 better performance
    },
  );

  socket.on("connect", () => {
    console.log("✅ Connected:", socket.id);

    if (roomId && username) {
      socket.emit("join_room", { roomId, username });
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ Disconnected");
  });

  return socket;
};

// 🔥 GET INSTANCE
export const getSocket = () => socket;

// 🔥 SAFE EMIT HELPERS
export const sendCodeChange = (code) => {
  if (socket?.connected) {
    socket.emit("code_change", { code });
  }
};

export const sendSubmit = (code) => {
  if (socket?.connected) {
    socket.emit("submit_code", { code });
  }
};

// 🔥 CLEANUP (IMPORTANT)
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
