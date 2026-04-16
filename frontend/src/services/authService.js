import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5005/api",
});

// 🔐 Attach token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// REGISTER
export const register = async (data) => {
  const res = await API.post("/auth/register", data);
  return res.data;
};

// LOGIN
export const login = async (data) => {
  const res = await API.post("/auth/login", data);

  if (res.data.token) {
    localStorage.setItem("token", res.data.token);
  }

  return res.data;
};

// GET CURRENT USER
export const getMe = async () => {
  const res = await API.get("/auth/me");
  return res.data;
};
