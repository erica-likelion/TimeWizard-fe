import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

// ✅ [수정 1] 타입과 API 함수 경로/이름을 우리가 만든 파일에 맞게 수정
import type { UserProfile } from '@/apis/UserAPI/types'; 
import { getUserProfile } from '@/apis/UserAPI/userApi'; 
import { logoutUser } from '@/apis/Auth/authService';

// JWT 토큰 관리 유틸리티 (유지)
export const TokenManager = {
  setToken: (token: string) => {
    localStorage.setItem('accessToken', token); // 참고: userApi 헤더에서 accessToken 키를 썼으므로 통일
  },
  getToken: (): string | null => {
    return localStorage.getItem('accessToken');
  },
  removeToken: () => {
    localStorage.removeItem('accessToken');
  },
  isTokenValid: (): boolean => {
    const token = TokenManager.getToken();
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp;
      if (!exp) return true;
      return Date.now() < (exp * 1000 - 5 * 60 * 1000); 
    } catch (error) {
      console.error('토큰 파싱 실패:', error);
      return false;
    }
  }
};

// ✅ [수정 2] User -> UserProfile로 변경
interface UserContextType {
  user: UserProfile | null;
  loading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
  fetchUser: () => Promise<void>;
  updateUser: (user: UserProfile) => void;
  clearUser: () => void;
  login: (token: string) => Promise<void>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  // ✅ [수정 3] State 타입 변경
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const isAuthenticated = user !== null && TokenManager.isTokenValid();

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!TokenManager.isTokenValid()) {
        throw new Error('유효하지 않은 토큰입니다. 다시 로그인해주세요.');
      }

      // ✅ [수정 4] getUserInfo -> getUserProfile 호출
      // API 함수가 에러가 나면 throw하고, 성공하면 데이터(UserProfile)만 바로 반환함
      const userData = await getUserProfile(); 
      setUser(userData);

    } catch (err) {
      setError(err instanceof Error ? err : new Error('알 수 없는 오류'));
      console.error('사용자 정보 조회 실패:', err);

      TokenManager.removeToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (token: string) => {
    try {
      setLoading(true);
      setError(null);
      TokenManager.setToken(token);
      await fetchUser(); 
    } catch (err) {
      setError(err instanceof Error ? err : new Error('로그인 실패'));
      TokenManager.removeToken();
      throw err; 
    }
  };

  const logout = async () => {
    try {
      await logoutUser(); 
    } catch (error) {
      console.error('API 로그아웃 실패:', error);
    } finally {
      TokenManager.removeToken();
      setUser(null);
      setError(null);
    }
  };

  const updateUser = (newUser: UserProfile) => {
    setUser(newUser);
  };

  const clearUser = () => {
    setUser(null);
    setError(null);
  };

  useEffect(() => {
    const initAuth = async () => {
      if (TokenManager.isTokenValid()) {
        await fetchUser();
      } else {
        TokenManager.removeToken();
        setLoading(false);
      }
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

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser는 UserProvider 내부에서만 사용할 수 있습니다.');
  }
  return context;
}