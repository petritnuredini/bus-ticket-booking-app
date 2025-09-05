import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:3001", // kjo është shumë e rëndësishme
});

// Add request interceptor to dynamically set the token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
