import apiClient from "../../../shared/api/apiClient";

export const getLeaderboard = async () => {
  const res = await apiClient.get("/users/leaderboard");
  return res.data;
};

export const getUserProfile = async (username) => {
  const res = await apiClient.get(`/users/${username}`);
  return res.data;
};
