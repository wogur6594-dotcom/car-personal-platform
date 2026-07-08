// src/api/axiosInstance.js
import axios from "axios";
import { clearAuthInfo, getAccessToken } from "../utils/authStorage";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("API 요청 오류:", error);

    if (error.response?.status === 401) {
      clearAuthInfo();
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;