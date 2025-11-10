import api from "@utils/apiClient";
import type { GetUserResponse } from './types';

/*
  회원 정보 조회 API
*/
export const getUserInfo = async (): Promise<GetUserResponse> => {
  try {
    const response = await api.get('/users/me');
    return response.data;
  } catch (error) {
    console.error('회원 정보 조회 에러:', error);
    throw error;
  }
};

/*
  개발/테스트용 회원 정보 모의 API
*/

// major_credits, general_credits는 API에는 없지만 페이지에 필요해서 추가함
export const mockGetUserInfo = async (): Promise<GetUserResponse> => {
  // 실제 API 응답 시뮬레이션을 위한 딜레이
  await new Promise(resolve => setTimeout(resolve, 300));

  return {
    success: true,
    data: {
      user_id: 1,
      email: "student@example.com",
      nickname: "테스트유저",
      phone_number: "010-1234-5678",
      university: "한양대학교 ERICA 캠퍼스",
      major: "컴퓨터학부",
      grade: 3,
      graduation_credits: 140,
      completed_credits: 90,
      major_credits: 60,
      general_credits: 30,
      created_at: "2023-03-01"
    }
  };
};
