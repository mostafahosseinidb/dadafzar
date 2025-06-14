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

export const authService = {
  login: async (credentials: LoginCredentials): Promise<ApiResponse<LoginResponse>> => {
    const response = await axiosInstance.post<ApiResponse<LoginResponse>>('/v1/auth/user-otp', credentials);
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