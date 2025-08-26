import axiosInstance from './axios';
import type { ApiResponse } from './types';
import { toast } from 'react-toastify';

interface LoginCredentials {
  nationalCode: string;
  mobileNumber: string;
}

interface LoginResponse {
  message: string;
  status: number;
}

interface LoginErrorResponse {
  userMessage: string;
  userMessageKey: string;
}

interface VerifyOtpCredentials {
  mobileNumber: string;
  otp: number;
  nationalCode?: string;
  fromLogin: boolean;
}

interface AuthResponse {
  user: {
    id: string;
    nationalCode: string;
    mobileNumber: string;
  };
  token: string;
}

// Utility function for logout confirmation
export const confirmLogout = () => {
  if (window.confirm('آیا مطمئن هستید که می‌خواهید از حساب کاربری خارج شوید؟')) {
    authService.logout();
  }
};

export const authService = {
  login: async (credentials: LoginCredentials): Promise<ApiResponse<LoginResponse> | LoginErrorResponse> => {
    const response = await axiosInstance.post<ApiResponse<LoginResponse> | LoginErrorResponse>('/v1/userpanel/user/login', credentials);
    // if ('message' in response.data) {
      toast.success('کد تایید به شماره موبایل شما ارسال شد');
    // }
    return response.data;
  },

  verifyOtp: async (credentials: VerifyOtpCredentials): Promise<{ token: string }> => {
    const response = await axiosInstance.post<{ token: string }>('/v1/userpanel/user/verify-otp', credentials);
    toast.success('ورود با موفقیت انجام شد');
    return response.data;
  },

  logout: async (): Promise<void> => {
    try {
      // Call backend logout endpoint if it exists
      await axiosInstance.post('/v1/userpanel/user/logout');
    } catch {
      // Even if backend call fails, we should still logout locally
      console.warn('Backend logout failed, proceeding with local logout');
    } finally {
      // Clear local storage
      localStorage.removeItem('token');
      // Clear any other auth-related data
      localStorage.removeItem('user');
      // Show success message
      toast.success('خروج با موفقیت انجام شد');
      // Redirect to login page
      window.location.href = '/login';
    }
  },

  getCurrentUser: async (): Promise<ApiResponse<AuthResponse['user']>> => {
    const response = await axiosInstance.get<ApiResponse<AuthResponse['user']>>('/auth/me');
    return response.data;
  },
}; 