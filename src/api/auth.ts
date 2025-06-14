import axiosInstance from './axios';
import type { ApiResponse } from './types';
import { toast } from 'react-toastify';

interface LoginCredentials {
  nationalId: string;
  phoneNumber: string;
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
  phoneNumber: string;
  otp: number;
  nationalId: string;
}

interface AuthResponse {
  user: {
    id: string;
    nationalId: string;
    phoneNumber: string;
  };
  token: string;
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<ApiResponse<LoginResponse> | LoginErrorResponse> => {
    const response = await axiosInstance.post<ApiResponse<LoginResponse> | LoginErrorResponse>('/v1/auth/user-otp', credentials);
    // if ('message' in response.data) {
      toast.success('کد تایید به شماره موبایل شما ارسال شد');
    // }
    return response.data;
  },

  verifyOtp: async (credentials: VerifyOtpCredentials): Promise<{ token: string }> => {
    const response = await axiosInstance.post<{ token: string }>('/v1/auth/user-verify-otp', credentials);
    toast.success('ورود با موفقیت انجام شد');
    return response.data;
  },

  logout: async (): Promise<void> => {
    localStorage.removeItem('token');
    toast.success('خروج با موفقیت انجام شد');
  },

  getCurrentUser: async (): Promise<ApiResponse<AuthResponse['user']>> => {
    const response = await axiosInstance.get<ApiResponse<AuthResponse['user']>>('/auth/me');
    return response.data;
  },
}; 