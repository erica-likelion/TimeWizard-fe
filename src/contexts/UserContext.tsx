import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

import type { UserProfile, UserPreferences, PasswordChangePayload } from '@/apis/UserAPI/types';
import { getUserProfile, getUserPreferences, updateUserProfile, updateUserPreferences, updatePassword } from '@/apis/UserAPI/userApi';
import { logoutUser } from '@/apis/Auth/authService';

const TokenManager = {
  setToken: (token: string) => {
    try {
      localStorage.setItem('authToken', token);
    } catch (error) {
      console.error('토큰 저장 실패 (localStorage 접근 불가):', error);
    }
  },
  getToken: (): string | null => {
    try {
      return localStorage.getItem('authToken');
    } catch (error) {
      console.error('토큰 조회 실패 (localStorage 접근 불가):', error);
      return null;
    }
  },
  removeToken: () => {
    try {
      localStorage.removeItem('authToken');
    } catch (error) {
      console.error('토큰 삭제 실패 (localStorage 접근 불가):', error);
    }
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

interface UserContextType {
  user: UserProfile | null;
  preferences: UserPreferences | null;
  loading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
  fetchUser: () => Promise<void>;
  updateUser: (user: UserProfile) => void;
  updatePreferences: (preferences: UserPreferences) => void;
  changePassword: (data: PasswordChangePayload) => Promise<void>;
  clearUser: () => void;
  login: (token: string) => Promise<void>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
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

      const [userData, userPrefs] = await Promise.all([
        getUserProfile(),
        getUserPreferences()
      ]);

      setUser(userData);
      setPreferences(userPrefs);

    } catch (err) {
      setError(err instanceof Error ? err : new Error('알 수 없는 오류'));
      console.error('사용자 정보 조회 실패:', err);

      TokenManager.removeToken();
      setUser(null);
      setPreferences(null);
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
      setPreferences(null);
      setError(null);
    }
  };

  const updateUser = async (newUser: UserProfile) => {
    try {
      await updateUserProfile(newUser);
      setUser(newUser);
    } catch (error) {
      console.error('유저 정보 업데이트 실패:', error);
      throw error;
    }
  };

  const updatePreferences = async (newPreferences: UserPreferences) => {
    try {
      await updateUserPreferences(newPreferences);
      setPreferences(newPreferences);
    } catch (error) {
      console.error('선호도 업데이트 실패:', error);
      throw error;
    }
  };  

  const changePassword = async (data: PasswordChangePayload) => {
    await updatePassword(data);
  };

  const clearUser = () => {
    setUser(null);
    setPreferences(null);
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
    preferences,
    loading,
    error,
    isAuthenticated,
    fetchUser,
    updateUser,
    updatePreferences,
    changePassword,
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