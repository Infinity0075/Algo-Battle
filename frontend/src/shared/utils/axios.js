import axios from "axios";

// 🔧 CREATE INSTANCE
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5005/api",
  withCredentials: true, // 🔧 for future cookies if needed
});

// 🔥 REQUEST INTERCEPTOR (attach token)
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// 🔥 RESPONSE INTERCEPTOR (handle auth errors)
API.interceptors.response.use(
  (res) => res,
  (error) => {
    // 🔧 auto logout on invalid token
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // 🔧 redirect to login
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default API;
