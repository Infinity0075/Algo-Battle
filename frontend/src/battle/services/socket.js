import { io } from "socket.io-client";
import axios from "axios";

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

export const sendSubmit = async (code, problemId) => {
  const token = localStorage.getItem("token");

  try {
    const res = await axios.post(
      "http://localhost:5005/api/submissions",
      {
        problemId,
        code, // (we’ll use later for judge)
        status: "Accepted", // 🔥 temporary (replace later)
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return res.data;
  } catch (err) {
    console.error(err);
  }
};
