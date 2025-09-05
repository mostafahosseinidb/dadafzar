import axios from 'axios';
import { toast } from 'react-toastify';

const baseURL = import.meta.env.VITE_API_URL || 'https://stg-service.dadafzar.com/api';

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    'client-id': import.meta.env.VITE_CLIENT_ID || '686112f3a12eff654bf02be9',
    'client-secret': import.meta.env.VITE_CLIENT_SECRET || 'ba5e1ae28f51f7e835e2a4dd4a35b2878b31740ccc6a5ff5f39e2b3d56435f19',
    // 'Origin': 'panel.dadafzar.com',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle specific error response with userMessage
    if (error.response?.data?.userMessage) {
      toast.error(error.response.data.userMessage);
      return Promise.reject(error.response.data);
    } else {
      const message = error.response?.data?.message || "An error occurred";

      // Handle different error status codes
      switch (error.response?.status) {
        case 401:
          // Handle unauthorized
          localStorage.removeItem("token");
          window.location.href = "/login";
          break;
        case 403:
          // Handle forbidden
          toast.error("You do not have permission to perform this action");
          break;
        case 404:
          toast.error("Resource not found");
          break;
        case 500:
          toast.error("Server error occurred");
          break;
        default:
          toast.error(message);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
