import api from "@utils/apiClient";
import type { GenerateTimetableRequest, GenerateTimetableResponse } from './types';

/**
 * AI 시간표 생성 API
 * POST /ai/generate-timetable
 */
export const generateTimetable = async (request: GenerateTimetableRequest): Promise<GenerateTimetableResponse> => {
  try {
    const response = await api.post('/ai/generate-timetable', request);
    return response.data;
  } catch (error) {
    console.error('AI 시간표 생성 에러:', error);
    throw error;
  }
};

/**
 * 개발/테스트용 AI 시간표 생성 모의 API
 */
export const mockGenerateTimetable = async (request: GenerateTimetableRequest): Promise<GenerateTimetableResponse> => {
  // 실제 API 응답 시뮬레이션을 위한 딜레이 (3초 - 생성 시간 시뮬레이션)
  await new Promise(resolve => setTimeout(resolve, 3000));

  console.log('AI 시간표 생성 요청:', request);

  return {
    success: true,
    data: {
      history_id: Math.floor(Math.random() * 1000) + 1,
      status: "pending",
      message: "시간표 생성이 시작되었습니다. 잠시만 기다려주세요."
    }
  };
};
