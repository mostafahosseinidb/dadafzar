/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from './axios';

export interface UserAuthorizationData {
  mobileNumber: string;
  nationalId: string;
  dateOfBirth: string;
  persianDateOfBirth: string;
  frontPhoto: string;
  backPhoto: string;
  recordedVideo: string;
  selfPhoto: string;
}

export interface UserAuthorizationResponse {
  success: boolean;
  message: string;
  data?: {
    userId: string;
    status: 'pending' | 'approved' | 'rejected';
    verificationId: string;
  };
  error?: string;
}

export const submitUserAuthorization = async (
  data: UserAuthorizationData
): Promise<UserAuthorizationResponse> => {
  try {
    // Convert data URLs or blob URLs to Blob objects for file upload
    const convertToBlob = async (dataUrl: string): Promise<Blob> => {
      // If it's already a blob URL, fetch it
      if (dataUrl.startsWith('blob:')) {
        try {
          const response = await fetch(dataUrl);
          return await response.blob();
        } catch (error) {
          console.error('Error fetching blob URL:', error);
          throw new Error('خطا در دریافت فایل ویدیو');
        }
      }
      
      // If it's a base64 data URL, convert it
      if (dataUrl.startsWith('data:')) {
        try {
          const arr = dataUrl.split(',');
          const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
          const bstr = atob(arr[1]);
          let n = bstr.length;
          const u8arr = new Uint8Array(n);
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
          }
          return new Blob([u8arr], { type: mime });
        } catch (error) {
          console.error('Error converting base64 data URL:', error);
          throw new Error('خطا در تبدیل فایل');
        }
      }
      
      throw new Error('فرمت فایل نامعتبر است');
    };

    // Create FormData object
    const formData = new FormData();
    
    // Add files
    if (data.frontPhoto) {
      const frontPhotoBlob = await convertToBlob(data.frontPhoto);
      formData.append('nationalCard', frontPhotoBlob, 'front_photo.jpg');
    }
    
    if (data.backPhoto) {
      const backPhotoBlob = await convertToBlob(data.backPhoto);
      formData.append('nationalCardBack', backPhotoBlob, 'back_photo.jpg');
    }
    
    if (data.recordedVideo) {
      const videoBlob = await convertToBlob(data.recordedVideo);
      formData.append('selfVideo', videoBlob, 'self_video.webm');
    }
    
    if (data.selfPhoto) {
      const selfPhotoBlob = await convertToBlob(data.selfPhoto);
      formData.append('selfPhoto', selfPhotoBlob, 'self_photo.jpg');
    }
    
    // Add text fields
    formData.append('nationalCode', data.nationalId);
    formData.append('birthDate', data.dateOfBirth);
    // formData.append('persianBirthDate', data.persianDateOfBirth);
    formData.append('mobile', data.mobileNumber);

    // Use the correct API endpoint
 
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value instanceof Blob ? `Blob (${value.size} bytes, ${value.type})` : value);
    }
    
    const response = await axiosInstance.post('/v1/userpanel/kyc', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    console.log('API response:', response);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      // Server responded with error status
      return {
        success: false,
        message: error.response.data?.message || 'خطا در ارسال اطلاعات',
        error: error.response.data?.error || 'خطای سرور'
      };
    } else if (error.request) {
      // Request was made but no response received
      return {
        success: false,
        message: 'خطا در اتصال به سرور',
        error: 'Network Error'
      };
    } else {
      // Something else happened
      return {
        success: false,
        message: 'خطای نامشخص',
        error: error.message || 'Unknown Error'
      };
    }
  }
};

export const getUserAuthorizationStatus = async (
  userId: string
): Promise<UserAuthorizationResponse> => {
  try {
    const response = await axiosInstance.get(`/user-authorization/${userId}`);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      return {
        success: false,
        message: error.response.data?.message || 'خطا در دریافت وضعیت',
        error: error.response.data?.error || 'خطای سرور'
      };
    } else if (error.request) {
      return {
        success: false,
        message: 'خطا در اتصال به سرور',
        error: 'Network Error'
      };
    } else {
      return {
        success: false,
        message: 'خطای نامشخص',
        error: error.message || 'Unknown Error'
      };
    }
  }
};
