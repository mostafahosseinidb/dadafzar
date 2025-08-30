import axiosInstance from './axios';
import type { ApiResponse } from './types';
import { toast } from 'react-toastify';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export interface LoginCredentials {
  nationalCode: string;
  mobileNumber: string;
}

export interface LoginResponse {
  message: string;
  status: number;
}

export interface LoginErrorResponse {
  userMessage: string;
  userMessageKey: string;
}

export interface VerifyOtpCredentials {
  mobileNumber: string;
  otp: number;
  nationalCode?: string;
  fromLogin: boolean;
}

export interface AuthResponse {
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

// React Query Hooks for Authentication
export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: () => {
      // Invalidate any cached user data
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};

export const useVerifyOtp = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (credentials: VerifyOtpCredentials) => authService.verifyOtp(credentials),
    onSuccess: (data) => {
      // Store token in localStorage
      localStorage.setItem('token', data.token);
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      // Clear all cached data
      queryClient.clear();
    },
  });
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['user', 'current'],
    queryFn: () => authService.getCurrentUser(),
    enabled: !!localStorage.getItem('token'), // Only run if token exists
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to check if user is authenticated
export const useIsAuthenticated = () => {
  const { data: user, isLoading, error } = useCurrentUser();
  return {
    isAuthenticated: !!user?.data && !error,
    isLoading,
    user: user?.data,
  };
}; 