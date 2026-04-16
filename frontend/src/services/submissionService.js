import axios from "axios";

const API_URL = "http://localhost:5005/api/submissions";

const getConfig = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const getStats = async (token) => {
  const res = await axios.get(`${API_URL}/stats`, getConfig(token));
  return res.data;
};

export const getActivity = async (token) => {
  const res = await axios.get(`${API_URL}/activity`, getConfig(token));
  return res.data;
};

export const getRecent = async (token) => {
  const res = await axios.get(`${API_URL}/recent`, getConfig(token));
  return res.data;
};

export const getStreak = async (token) => {
  const res = await axios.get(`${API_URL}/streak`, getConfig(token));
  return res.data;
};
export const getProblemStatus = async (token) => {
  const res = await axios.get(`${API_URL}/status`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
