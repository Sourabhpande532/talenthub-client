import axios from "axios";
const API_URL = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:5001",
  headers: {
    "Content-Type": "application/json",
  },
});

API_URL.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default API_URL;
