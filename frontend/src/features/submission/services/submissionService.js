// 🔥 USE GLOBAL AXIOS (no manual token passing)

import apiClient from "../../../shared/api/apiClient";

// ➤ STATS
export const getStats = async () => {
  const res = await apiClient.get("/submissions/stats");
  return res.data;
};

// ➤ ACTIVITY
export const getActivity = async () => {
  const res = await apiClient.get("/submissions/activity");
  return res.data;
};

// ➤ RECENT
export const getRecent = async () => {
  const res = await apiClient.get("/submissions/recent");
  return res.data;
};

// ➤ STREAK
export const getStreak = async () => {
  const res = await apiClient.get("/submissions/streak");
  return res.data;
};

// ➤ PROBLEM STATUS (IMPORTANT 🔥)
export const getProblemStatus = async () => {
  const res = await apiClient.get("/submissions/status");
  return res.data;
};

// ➤ CREATE SUBMISSION (🔥 REQUIRED for editor)
export const createSubmission = async (data) => {
  const res = await apiClient.post("/submissions", data);
  return res.data;
};
