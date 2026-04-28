import { io } from "socket.io-client";

let socket;

// 🔥 GET BASE URL (DEV + PROD SAFE)
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace("/api", "") ||
  "http://localhost:5005";

// 🔥 CONNECT (singleton + stable)
export const connectSocket = (roomId, username) => {
  if (!socket) {
    socket = io(BASE_URL, {
      transports: ["websocket", "polling"], // ✅ FIX (IMPORTANT)
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
      console.log("✅ Connected:", socket.id);
    });

    socket.on("disconnect", (reason) => {
      console.log("❌ Disconnected:", reason);
    });

    socket.on("connect_error", (err) => {
      console.log("❌ Connection Error:", err.message);
    });
  }

  // 🔥 ALWAYS JOIN ROOM
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

// 🔥 GET INSTANCE
export const getSocket = () => socket;

// 🔥 SAFE EMIT HELPERS
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

// 🔥 CLEANUP
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
