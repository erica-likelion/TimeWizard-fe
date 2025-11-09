import api from "@utils/apiClient";
import type { GenerateTimetableRequest, GenerateTimetableResponse, GenerationStatusResponse } from './types';

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
 * AI 시간표 생성 상태 조회 API
 * GET /ai/generation-status/{history_id}
 */
export const getGenerationStatus = async (historyId: number): Promise<GenerationStatusResponse> => {
  try {
    const response = await api.get(`/ai/generation-status/${historyId}`);
    return response.data;
  } catch (error) {
    console.error('AI 시간표 생성 상태 조회 에러:', error);
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

/**
 * 개발/테스트용 AI 시간표 생성 상태 조회 모의 API
 */
export const mockGetGenerationStatus = async (historyId: number): Promise<GenerationStatusResponse> => {
  // 실제 API 응답 시뮬레이션을 위한 딜레이 (2초)
  await new Promise(resolve => setTimeout(resolve, 2000));

  console.log('AI 시간표 생성 상태 조회:', historyId);

  // 80% 확률로 성공, 20% 확률로 실패 시뮬레이션
  const isSuccess = Math.random() > 0.2;

  if (isSuccess) {
    return {
      success: true,
      data: {
        history_id: historyId,
        status: 'completed',
        timetable_id: 3,
        message: "컴퓨터전공 3학년 1학기 과정에서 필수 강의를 포함하고. 금요일 공강에 있는 시간표를 작성하였습니다. 9시 강의는 월요일을 제외하고 없습니다."
      }
    };
  } else {
    return {
      success: true,
      data: {
        status: 'failed',
        error_message: "조건을 만족하는 시간표를 생성할 수 없습니다.",
        suggestions: [
          "목표 학점을 낮춰보세요.",
          "제외 시간대를 줄여보세요.",
          "필수 과목을 조정해보세요."
        ]
      }
    };
  }
};
