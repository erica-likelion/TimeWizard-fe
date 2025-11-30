// 공통 응답 타입
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

// 1. 회원 정보 (Profile)
export interface UserProfile {
  user_id: number;
  email: string;
  nickname: string;
  university: string;
  major: string;
  grade: number;
  phone_number: string;
  graduation_credits: number;
  completed_credits: number;
  created_at: string;
}

// 2. 선호도 (Preferences) - API 연동용 정의
export interface UserPreferences {
  preferred_days: string[];
  preferred_start_time: string;
  preferred_end_time: string;
  target_credits: number;
  required_courses: number[];
  excluded_courses: number[];
}

// 3. 비밀번호 변경 Payload
export interface PasswordChangePayload {
  current_password: string;
  new_password: string;
}