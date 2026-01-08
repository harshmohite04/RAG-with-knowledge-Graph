import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL || "https://f1dfffb60441.ngrok-free.app", // Backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to attach the token if it exists
api.interceptors.request.use(
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

export default api;
