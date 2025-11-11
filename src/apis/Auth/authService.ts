import api from '@/utils/apiClient';
import axios from 'axios';

/**
 * 1. 회원가입 API 호출 함수
 */
export const signupUser = async (signupData: any) => {
  try {
    const response = await api.post('/auth/register', signupData);
    // 성공 시, 성공 데이터를 반환 (예: response.data)
    return response.data;
  } catch (error) {
    // 실패 시, 에러를 던져서 컴포넌트가 catch하게 함
    handleApiError(error);
  }
};

/**
 * 2. 로그인 API 호출 함수
 */
export const loginUser = async (email: string, password: string) => {
  try {
    const response = await api.post('/auth/login', {
      email: email,
      password: password,
    });
    // 성공 시, accessToken을 반환 (API 명세 기준)
    const { accessToken } = response.data;
    if (!accessToken) {
      throw new Error('응답에 액세스 토큰이 없습니다.');
    }
    return accessToken;
    
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * 3. 로그아웃 api 
 */
export const logoutUser = async () => {
  try {
    // /auth/logout (POST, 인증 필요)
    const response = await api.post('/auth/logout');
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * (공통) 에러 핸들링 유틸리티
 */
const handleApiError = (error: any) => {
  if (axios.isAxiosError(error) && error.response) {
    // 백엔드에서 보낸 에러 메시지를 그대로 던짐
    throw new Error(error.response.data.message || 'API 요청 중 오류가 발생했습니다.');
  }
  // 그 외의 에러 (네트워크 문제 등)
  throw new Error('알 수 없는 오류가 발생했습니다.');
};