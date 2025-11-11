import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User } from '@/apis/UserAPI/types';
// [✨ 수정됨] userApi에서 실제 함수 import
import { getUserInfo } from '@/apis/UserAPI/userApi'; 
// [✨ 수정됨] authService에서 로그아웃 함수 import
import { logoutUser } from '@/apis/Auth/authService';

// JWT 토큰 관리 유틸리티 (원본 유지)
export const TokenManager = {
  setToken: (token: string) => {
    localStorage.setItem('authToken', token);
  },
  getToken: (): string | null => {
    return localStorage.getItem('authToken');
  },
  removeToken: () => {
    localStorage.removeItem('authToken');
  },
  isTokenValid: (): boolean => {
    const token = TokenManager.getToken();
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp;
      if (!exp) return true;
      // [✨ 수정됨] 5분 여유를 둔 만료 체크 (원본 유지)
      return Date.now() < (exp * 1000 - 5 * 60 * 1000); 
    } catch (error) {
      console.error('토큰 파싱 실패:', error);
      return false;
    }
  }
};

// UserContext 타입 정의
interface UserContextType {
  user: User | null;
  loading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
  fetchUser: () => Promise<void>;
  updateUser: (user: User) => void;
  clearUser: () => void;
  login: (token: string) => Promise<void>;
  logout: () => void;
}

// Context 생성
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider Props 타입
interface UserProviderProps {
  children: ReactNode;
}

/**
 * UserProvider 컴포넌트
 */
export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // [✨ 수정됨] 로그인 구현 후 TODO 주석 해제 (실제 로직)
  const isAuthenticated = user !== null && TokenManager.isTokenValid();

  // [✨ 수정됨] 사용자 정보 조회 함수 (userApi.ts 사용)
  const fetchUser = async () => {
    try {
      setLoading(true);
      setError(null);

      // [✨ 수정됨] 토큰 유효성 검사 활성화
      if (!TokenManager.isTokenValid()) {
        throw new Error('유효하지 않은 토큰입니다. 다시 로그인해주세요.');
      }

      // [✨ 수정됨] userApi.ts의 실제 getUserInfo() 호출
      const response = await getUserInfo();

      if (response.success) {
        setUser(response.data);
      } else {
        throw new Error('사용자 정보 조회 실패');
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('알 수 없는 오류'));
      console.error('사용자 정보 조회 실패:', err);

      // [✨ 수정됨] 토큰 오류 시 로그아웃 처리 활성화
      TokenManager.removeToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // 로그인 함수 (토큰 저장 + 사용자 정보 조회)
  const login = async (token: string) => {
    try {
      setLoading(true);
      setError(null);
      TokenManager.setToken(token);
      await fetchUser(); // 토큰 저장 후 유저 정보 바로 가져오기
    } catch (err) {
      setError(err instanceof Error ? err : new Error('로그인 실패'));
      TokenManager.removeToken();
      throw err; // 에러를 login.tsx로 다시 던져서 UI 처리
    }
  };

  // [✨ 수정됨] 로그아웃 함수 (authService.ts 사용)
  const logout = async () => {
    try {
      await logoutUser(); // 백엔드에 로그아웃 요청
    } catch (error) {
      console.error('API 로그아웃 실패:', error);
    } finally {
      // API 호출 성공/실패와 관계없이 프론트 상태 초기화
      TokenManager.removeToken();
      setUser(null);
      setError(null);
    }
  };

  // 사용자 정보 업데이트 함수 (로컬 상태만 업데이트)
  const updateUser = (newUser: User) => {
    setUser(newUser);
  };

  // 사용자 정보 초기화 (로그아웃 시 사용)
  const clearUser = () => {
    setUser(null);
    setError(null);
  };

  // [✨ 수정됨] 컴포넌트 마운트 시 실제 토큰 검사 로직 활성화
  useEffect(() => {
    const initAuth = async () => {
      // 저장된 토큰이 있고 유효한지 확인
      if (TokenManager.isTokenValid()) {
        // 토큰이 유효하면 사용자 정보 조회
        await fetchUser();
      } else {
        // 토큰이 없거나 만료되었으면 제거
        TokenManager.removeToken();
        setLoading(false);
      }
    };

    // 개발용 Mock 데이터 로드 제거됨

    initAuth();
  }, []); // 마운트 시 1회 실행

  const value: UserContextType = {
    user,
    loading,
    error,
    isAuthenticated,
    fetchUser,
    updateUser,
    clearUser,
    login,
    logout,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

/**
 * useUser 커스텀 훅
 */
export function useUser() {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error('useUser는 UserProvider 내부에서만 사용할 수 있습니다.');
  }

  return context;
}