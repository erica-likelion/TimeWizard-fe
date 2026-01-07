// src/UserAPI/userApi.ts
import api from '@/utils/apiClient'; 
import type { ApiResponse, UserProfile, UserPreferences, PasswordChangePayload } from '@/apis/UserAPI/types';



export const getUserProfile = async (): Promise<UserProfile> => {
  try {
    const response = await api.get<ApiResponse<UserProfile>>('/users/me');
    return response.data.data;
  } catch (error) {
    console.error('유저 프로필 조회 에러:', error);
    throw error;
  }
};

export const updateUserProfile = async (data: Partial<UserProfile>) => {
  try {
    await api.put<ApiResponse<any>>('/users/me', data);
  } catch (error) {
    console.error('유저 정보 업데이트 에러:', error);
    throw error;
  }
};

export const updatePassword = async (data: PasswordChangePayload) => {
  try {
    await api.put<ApiResponse<any>>('/users/me/password', data);
  } catch (error) {
    console.error('비밀번호 업데이트 에러:', error);
    throw error;
  }
};


// ==========================================
// 2. 선호도 (Preferences) 관련
// ==========================================

export const getUserPreferences = async (): Promise<UserPreferences | null> => {
  try {
    const response = await api.get<ApiResponse<UserPreferences | null>>('/users/me/preferences');
    return response.data.data;
  } catch (error) {
    console.error('유저 선호도 조회 에러:', error);
    throw error;
  }
};

export const updateUserPreferences = async (data: Partial<UserPreferences>) => {
  try {
    await api.put<ApiResponse<any>>('/users/me/preferences', data);
  } catch (error) {
    console.error('유저 선호도 업데이트 에러:', error);
    throw error;
  }
};

// ==========================================
// 3. 회원 탈퇴
// ==========================================

export const deleteAccount = async () => {
  try {
    await api.delete<ApiResponse<any>>('/users/me/remove');
  } catch (error) {
    console.error('회원 탈퇴 에러:', error);
    throw error;
  }
};