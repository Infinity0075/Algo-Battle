import axios from "axios";

export const getLeaderboard = async () => {
  const res = await axios.get("http://localhost:5005/api/users/leaderboard");
  return res.data;
};

export const getUserProfile = async (username) => {
  const res = await axios.get(`http://localhost:5005/api/users/${username}`);
  return res.data;
};
