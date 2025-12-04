import axios from 'axios';
import type { AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json'
  },
  
  withCredentials: true, 
});


// Request 인터셉터 (변경 없음)
api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('토큰 조회 실패 (localStorage 접근 불가):', error);
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);


api.interceptors.response.use(
  (response) => {
    // 1. 성공한 응답은 그대로 반환
    return response;
  },
  async (error) => {
    // 2. 원래 요청 정보
    const originalRequest = error.config;

    // 3. 401 에러이고, 아직 재시도하지 않은 요청인 경우
    // (로그인/회원가입 요청이 401일 때는 갱신 시도 안 함)
    if (error.response?.status === 401 && !originalRequest._retry &&
        originalRequest.url !== '/auth/login' && 
        originalRequest.url !== '/auth/register') {
      
      originalRequest._retry = true; // 재시도 플래그 설정 (무한 루프 방지)

      try {
        // 4. 토큰 갱신 API 호출 (API 명세서 기준)
        const refreshResponse = await api.post('/auth/refresh');

        // 5. 새로 발급받은 accessToken 추출
        const { accessToken } = refreshResponse.data;

        // 6. 새 토큰 저장
        try {
          localStorage.setItem('authToken', accessToken);
        } catch (storageError) {
          console.error('토큰 저장 실패 (localStorage 접근 불가):', storageError);
        }

        // 7. 원래 요청의 헤더를 새 토큰으로 변경
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

        // 8. 원래 요청을 다시 시도
        return api(originalRequest);

      } catch (refreshError) {
        // 9. 토큰 갱신 자체를 실패한 경우 (예: Refresh Token 만료)
        console.error('토큰 갱신 실패:', refreshError);
        // localStorage를 비우고 로그인 페이지로 강제 이동
        try {
          localStorage.removeItem('authToken');
        } catch (storageError) {
          console.error('토큰 삭제 실패 (localStorage 접근 불가):', storageError);
        }
        window.location.href = '/login'; // (Tanstack Router 대신 window 사용)
        return Promise.reject(refreshError);
      }
    }

    // 10. 401 에러가 아니거나, 이미 재시도한 요청은 에러를 그대로 반환
    return Promise.reject(error);
  }
);

export default api;