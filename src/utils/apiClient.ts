import axios from 'axios';
import type { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL || 'http://localhost:8080/',
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json'
  }
});


// 임시 개발 => 추후 로그인 페이지 구현 후 한번 싹다 리팩토링할 예정
// Request 인터셉터: JWT 토큰을 자동으로 헤더에 추가
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // localStorage에서 토큰 가져오기
    const token = localStorage.getItem('authToken');

    if (token) {
      // Authorization 헤더에 Bearer 토큰 추가
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response 인터셉터: 401 에러 시 토큰 제거 및 로그인 페이지로 이동
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // 401 Unauthorized 에러 처리
    if (error.response?.status === 401) {
      // 토큰 제거
      localStorage.removeItem('authToken');

      // 로그인 페이지로 리다이렉트 (필요시 활성화)
      // window.location.href = '/login';

      console.error('인증 오류: 토큰이 만료되었거나 유효하지 않습니다.');
    }

    return Promise.reject(error);
  }
);

export default api;