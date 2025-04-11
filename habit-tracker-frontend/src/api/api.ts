import axios from "axios";
import store from "../store/store";
import { logout } from "../store/auth-slice";

const API_BASE_URL = "https://habit-tracker-api-l94v.onrender.com/api";
// const API_BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Automatically attach token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // If the request was unauthorized, log the user out
      store.dispatch(logout());
    }
    return Promise.reject(error);
  }
);

export default api;
