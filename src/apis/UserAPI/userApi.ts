// src/UserAPI/userApi.ts
import type { ApiResponse, UserProfile, UserPreferences } from '@apis/UserAPI/types';

// 헤더 설정 (토큰 처리)
const getHeaders = () => {
  const token = localStorage.getItem('accessToken'); // 토큰 키 이름 확인 필요
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

// --- [1] 회원 정보 (Profile) ---

export const getUserProfile = async (): Promise<UserProfile> => {
  const res = await fetch('/users/me', { headers: getHeaders() });
  
  if (!res.ok) {
    throw new Error('회원 정보를 불러오는데 실패했습니다.');
  }
  
  const json: ApiResponse<UserProfile> = await res.json();
  return json.data;
};

export const updateUserProfile = async (data: Partial<UserProfile>) => {
  const res = await fetch('/users/me', {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
};

// --- [2] 선호도 (Preferences) - 연동만 해둠 ---

export const getUserPreferences = async (): Promise<UserPreferences> => {
  const res = await fetch('/users/me/preferences', { headers: getHeaders() });
  if (!res.ok) throw new Error('선호도를 불러오는데 실패했습니다.');
  const json: ApiResponse<UserPreferences> = await res.json();
  return json.data;
};

export const updateUserPreferences = async (data: Partial<UserPreferences>) => {
  const res = await fetch('/users/me/preferences', {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
};