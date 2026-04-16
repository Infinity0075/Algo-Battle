import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5005/api",
});

// 🔐 attach token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ✅ GET ALL PROBLEMS
export const getProblems = async () => {
  const res = await API.get("/problems");
  return res.data;
};

// ✅ GET SINGLE PROBLEM
export const getProblem = async (id) => {
  const res = await API.get(`/problems/${id}`);
  return res.data;
};

// ✅ CREATE
export const createProblem = async (data) => {
  const res = await API.post("/problems", data);
  return res.data;
};

// ✅ UPDATE
export const updateProblem = async (id, data) => {
  const res = await API.put(`/problems/${id}`, data);
  return res.data;
};

// ✅ DELETE
export const deleteProblem = async (id) => {
  const res = await API.delete(`/problems/${id}`);
  return res.data;
};
