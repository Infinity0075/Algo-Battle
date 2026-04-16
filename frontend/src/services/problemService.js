import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5005/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const createProblem = async (data) => {
  const res = await API.post("/problems", data);
  return res.data;
};

export const deleteProblem = async (id) => {
  const res = await API.delete(`/problems/${id}`);
  return res.data;
};
export const updateProblem = async (id, data) => {
  const res = await API.put(`/problems/${id}`, data);
  return res.data;
};
