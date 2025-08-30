import axiosInstance from './axios';
import type { ApiResponse } from './types';
import { useQuery } from '@tanstack/react-query';

interface KycResponse {
  success: boolean;
  data: {
    authenticated: boolean;
    expirationDate: string | null;
  };
}

export const kycService = {
  getKyc: async (): Promise<ApiResponse<KycResponse>> => {
    const response = await axiosInstance.get<ApiResponse<KycResponse>>('/v1/userpanel/kyc');
    return response.data;
  },
};

// React Query Hooks for KYC
export const useKyc = () => {
  return useQuery({
    queryKey: ['kyc'],
    queryFn: () => kycService.getKyc(),
    staleTime: 2 * 60 * 1000, // 2 minutes - KYC data changes frequently
    gcTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!localStorage.getItem('token'), // Only run if user is authenticated
  });
};

export const useKycStatus = () => {
  const { data: kyc, isLoading, error } = useKyc();
  
  return {
    isAuthenticated: kyc?.data?.data?.authenticated || false,
    expirationDate: kyc?.data?.data?.expirationDate,
    isLoading,
    error,
    kycData: kyc?.data,
  };
};
