// 로그인 기능 통합 후 리팩토링 예정
// 지금은 그냥 사용자 정보 가져오기용

import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User } from '@/apis/UserAPI/types';
import { mockGetUserInfo } from '@/apis/UserAPI/userApi';

// JWT 토큰 관리 유틸리티
export const TokenManager = {
  // 토큰 저장
  setToken: (token: string) => {
    localStorage.setItem('authToken', token);
  },

  // 토큰 가져오기
  getToken: (): string | null => {
    return localStorage.getItem('authToken');
  },

  // 토큰 삭제
  removeToken: () => {
    localStorage.removeItem('authToken');
  },

  // JWT 토큰 유효성 검사 (만료 여부 체크)
  isTokenValid: (): boolean => {
    const token = TokenManager.getToken();
    if (!token) return false;

    try {
      // JWT는 header.payload.signature 형식
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp;

      // exp는 초 단위 timestamp
      if (!exp) return true; // exp가 없으면 만료 없는 토큰으로 간주

      // 현재 시간과 비교 (5분 여유를 둠)
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
 * 앱 전체에서 사용자 정보를 관리하는 Context Provider
 */
export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // 로그인 여부
  // TODO: 로그인 구현 후 아래 주석 해제하고 현재 개발용 코드 제거
  // const isAuthenticated = user !== null && TokenManager.isTokenValid();

  // 개발용: user가 있으면 로그인된 것으로 간주 (토큰 검사 생략)
  const isAuthenticated = user !== null;

  // 사용자 정보 조회 함수
  const fetchUser = async () => {
    try {
      setLoading(true);
      setError(null);

      // TODO: 로그인 구현 후 아래 주석 해제
      /*
      // 토큰 유효성 검사
      if (!TokenManager.isTokenValid()) {
        throw new Error('유효하지 않은 토큰입니다. 다시 로그인해주세요.');
      }
      */

      // TODO: 로그인 구현 후 실제 API로 변경
      // const response = await getUserInfo();
      const response = await mockGetUserInfo();

      if (response.success) {
        setUser(response.data);
      } else {
        throw new Error('사용자 정보 조회 실패');
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('알 수 없는 오류'));
      console.error('사용자 정보 조회 실패:', err);

      // TODO: 로그인 구현 후 아래 주석 해제
      /*
      // 토큰이 유효하지 않으면 로그아웃 처리
      TokenManager.removeToken();
      setUser(null);
      */
    } finally {
      setLoading(false);
    }
  };

  // 로그인 함수 (토큰 저장 + 사용자 정보 조회)
  const login = async (token: string) => {
    try {
      setLoading(true);
      setError(null);

      // 토큰 저장
      TokenManager.setToken(token);

      // 사용자 정보 조회
      await fetchUser();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('로그인 실패'));
      TokenManager.removeToken();
      throw err;
    }
  };

  // 로그아웃 함수
  const logout = () => {
    TokenManager.removeToken();
    setUser(null);
    setError(null);
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

  // 컴포넌트 마운트 시 JWT 토큰 확인 후 자동 로그인
  useEffect(() => {
    const initAuth = async () => {
      // TODO: 로그인 구현 후 아래 주석 해제하고 개발용 Mock 부분 제거
      /*
      // 저장된 토큰이 있고 유효한지 확인
      if (TokenManager.isTokenValid()) {
        // 토큰이 유효하면 사용자 정보 조회
        await fetchUser();
      } else {
        // 토큰이 없거나 만료되었으면 제거
        TokenManager.removeToken();
        setLoading(false);
      }
      */

      // === 개발용: Mock 데이터 자동 로드 ===
      // 개발 환경에서는 자동으로 Mock 사용자 정보 불러오기
      const isDevelopment = import.meta.env.DEV;
      if (isDevelopment) {
        try {
          setLoading(true);
          // Mock 데이터 로드 (토큰 검사 없이)
          const response = await mockGetUserInfo();
          if (response.success) {
            setUser(response.data);
          }
        } catch (err) {
          console.error('개발용 Mock 데이터 로드 실패:', err);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
      // === 개발용 코드 끝 ===
    };

    initAuth();
  }, []);

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
 * UserContext를 쉽게 사용하기 위한 훅
 *
 * @example
 * const { user, loading, error } = useUser();
 * if (loading) return <div>Loading...</div>;
 * if (error) return <div>Error: {error.message}</div>;
 * return <div>안녕하세요, {user?.nickname}님!</div>;
 */
export function useUser() {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error('useUser는 UserProvider 내부에서만 사용할 수 있습니다.');
  }

  return context;
}
