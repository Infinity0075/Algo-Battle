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
export const getProblem = async (_id) => {
  const res = await API.get(`/problems/${_id}`);
  return res.data;
};

// ✅ CREATE
export const createProblem = async (data) => {
  const res = await API.post("/problems", data);
  return res.data;
};

// ✅ UPDATE
export const updateProblem = async (_id, data) => {
  const res = await API.put(`/problems/${_id}`, data);
  return res.data;
};

// ✅ DELETE
export const deleteProblem = async (_id) => {
  const res = await API.delete(`/problems/${_id}`);
  return res.data;
};
