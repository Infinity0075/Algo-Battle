import API from "../../shared/utils/axios";

// 🔥 CREATE ROOM (optional future use)
export const createRoom = async () => {
  const res = await API.post("/battle/create"); // 🔧 backend optional
  return res.data;
};

// 🔥 JOIN ROOM (optional backend validation)
export const joinRoom = async (roomId, username) => {
  const res = await API.post("/battle/join", { roomId, username });
  return res.data;
};

// 🔥 GET ROOM INFO (optional)
export const getRoom = async (roomId) => {
  const res = await API.get(`/battle/${roomId}`);
  return res.data;
};

// 🔥 GET RANDOM PROBLEM (fallback for solo mode)
export const getRandomProblem = async () => {
  const res = await API.get("/problems");
  const problems = res.data;

  if (!problems || problems.length === 0) return null;

  const random = problems[Math.floor(Math.random() * problems.length)];

  return random;
};
