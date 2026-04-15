import axios from "axios";

const API_URL = "http://localhost:5005/api/auth";

// Register user
export const register = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
};

// Login user
export const login = async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData);
  return response.data;
};

// Get Me is going to be the area where user can find details about themself in future ill add this route into dashboard

export const getMe = async () => {
  const token = localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(`${API_URL}/me`, config);

  return response.data;
};
