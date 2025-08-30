import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:3001", // kjo është shumë e rëndësishme
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});
