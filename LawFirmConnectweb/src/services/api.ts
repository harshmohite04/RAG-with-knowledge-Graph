import axios from "axios";

// Create axios instance
const api = axios.create({
  baseURL: "https://f1dfffb60441.ngrok-free.app", // Default local backend
  // baseURL: 'http://localhost:5000', // Default local backend
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem("user");
    if (userInfo) {
      const { token } = JSON.parse(userInfo);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized globally (optional)
    if (error.response && error.response.status === 401) {
      // Could redirect to login or clear storage here
      // localStorage.removeItem('userInfo');
      // window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

export default api;
