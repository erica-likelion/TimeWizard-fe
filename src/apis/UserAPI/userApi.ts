// src/UserAPI/userApi.ts
import api from '@/utils/apiClient'; 
import type { ApiResponse, UserProfile, UserPreferences, PasswordChangePayload } from '@/apis/UserAPI/types';



export const getUserProfile = async (): Promise<UserProfile> => {
  const response = await api.get<ApiResponse<UserProfile>>('/users/me');
  
  return response.data.data;
};

export const updateUserProfile = async (data: Partial<UserProfile>) => {

  const response = await api.put<ApiResponse<any>>('/users/me', data);
  return response.data;
};

export const updatePassword = async (data: PasswordChangePayload) => {
 
  const response = await api.put<ApiResponse<any>>('/users/me/password', data);
  return response.data;
};


// ==========================================
// 2. 선호도 (Preferences) 관련
// ==========================================

export const getUserPreferences = async (): Promise<UserPreferences> => {
  const response = await api.get<ApiResponse<UserPreferences>>('/users/me/preferences');
  return response.data.data;
};

export const updateUserPreferences = async (data: Partial<UserPreferences>) => {
  const response = await api.put<ApiResponse<any>>('/users/me/preferences', data);
  return response.data;
};