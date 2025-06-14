import axiosInstance from './axios';
import type { ApiResponse } from './types';

interface LoginCredentials {
  nationalId: string;
  phoneNumber: string;
}

interface LoginResponse {
  message: string;
  status: number;
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
  login: async (credentials: LoginCredentials): Promise<ApiResponse<LoginResponse>> => {
    const response = await axiosInstance.post<ApiResponse<LoginResponse>>('/v1/auth/user-otp', credentials);
    return response.data;
  },

  verifyOtp: async (credentials: VerifyOtpCredentials): Promise<{ token: string }> => {
    const response = await axiosInstance.post<{ token: string }>('/v1/auth/user-verify-otp', credentials);
    return response.data;
  },

  logout: async (): Promise<void> => {
    localStorage.removeItem('token');
  },

  getCurrentUser: async (): Promise<ApiResponse<AuthResponse['user']>> => {
    const response = await axiosInstance.get<ApiResponse<AuthResponse['user']>>('/auth/me');
    return response.data;
  },
}; 