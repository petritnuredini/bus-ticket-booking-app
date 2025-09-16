import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:3001/api",
});

// Add request interceptor to dynamically set the token
axiosInstance.interceptors.request.use(
  (config) => {
    // Check for user token first
    const userToken = localStorage.getItem("token");
    // Check for agent token if user token doesn't exist
    const agentToken = localStorage.getItem("agentToken");
    
    // Set the appropriate token in Authorization header
    if (userToken) {
      config.headers.Authorization = `Bearer ${userToken}`;
    } else if (agentToken) {
      config.headers.Authorization = `Bearer ${agentToken}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
