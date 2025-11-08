/**
 * 회원 정보 타입
 */
export interface User {
  user_id: number;
  email: string;
  nickname: string;
  phone_number: string;
  university: string;
  major: string;
  grade: number;
  graduation_credits: number;
  completed_credits: number;
  major_credits: number;
  general_credits: number;
  created_at: string;
}

/**
 * 회원 정보 조회 API 응답
 */
export interface GetUserResponse {
  success: boolean;
  data: User;
}
