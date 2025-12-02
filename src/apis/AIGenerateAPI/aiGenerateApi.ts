import api from "@utils/apiClient";
import type { GenerateTimetableRequest, GenerateTimetableResponse, GenerationStatusResponse } from './types';

/*
  AI 시간표 생성 API
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

/*
  목업 AI 시간표 생성 API
*/
export const mockGenerateTimetable = async (_request: GenerateTimetableRequest): Promise<GenerateTimetableResponse> => {
  await new Promise(resolve => setTimeout(resolve, 3000));

  return "123e4567-e89b-12d3-a456-426614174000"
};

/*
  AI 시간표 생성 상태 조회 API
*/
export const getGenerationStatus = async (uuid: string): Promise<GenerationStatusResponse> => {
  try {
    const response = await api.get(`/check/${uuid}/status`);
    return response.data;
  } catch (error) {
    console.error('AI 시간표 생성 상태 조회 에러:', error);
    throw error;
  }
};

/*
  목업 AI 시간표 생성 상태 조회 API
*/
export const mockGetGenerationStatus = async (_historyId: number): Promise<GenerationStatusResponse> => {
  await new Promise(resolve => setTimeout(resolve, 2000));

  const isSuccess = true;

  if (isSuccess) {
    return {
      status: 'COMPLETE',
      message: '시간표 생성 완료',
      data: "{\"courses\":[{\"course_id\":\"384\",\"course_name\":\"동역학\",\"professor\":\"김태균\",\"day_of_week\":\"tue\",\"start_time\":870,\"end_time\":960},{\"course_id\":\"384\",\"course_name\":\"동역학\",\"professor\":\"김태균\",\"day_of_week\":\"thu\",\"start_time\":870,\"end_time\":960},{\"course_id\":\"831\",\"course_name\":\"공업수학2\",\"professor\":\"이동호\",\"day_of_week\":\"tue\",\"start_time\":1020,\"end_time\":1110},{\"course_id\":\"831\",\"course_name\":\"공업수학2\",\"professor\":\"이동호\",\"day_of_week\":\"thu\",\"start_time\":1020,\"end_time\":1110},{\"course_id\":\"754\",\"course_name\":\"수치계산\",\"professor\":\"한재권\",\"day_of_week\":\"tue\",\"start_time\":630,\"end_time\":720},{\"course_id\":\"754\",\"course_name\":\"수치계산\",\"professor\":\"한재권\",\"day_of_week\":\"thu\",\"start_time\":780,\"end_time\":870},{\"course_id\":\"2852\",\"course_name\":\"확률과통계\",\"professor\":\"맹승준\",\"day_of_week\":\"fri\",\"start_time\":900,\"end_time\":990},{\"course_id\":\"775\",\"course_name\":\"로봇프로그래밍\",\"professor\":\"신현수\",\"day_of_week\":\"wed\",\"start_time\":900,\"end_time\":1020},{\"course_id\":\"775\",\"course_name\":\"로봇프로그래밍\",\"professor\":\"신현수\",\"day_of_week\":\"wed\",\"start_time\":1020,\"end_time\":1140},{\"course_id\":\"281\",\"course_name\":\"지능형로봇프로그래밍의이해\",\"professor\":\"김윤이\",\"day_of_week\":\"fri\",\"start_time\":780,\"end_time\":900},{\"course_id\":\"1393\",\"course_name\":\"데이터처리\",\"professor\":\"정혜영\",\"day_of_week\":\"tue\",\"start_time\":780,\"end_time\":900},{\"course_id\":\"1393\",\"course_name\":\"데이터처리\",\"professor\":\"정혜영\",\"day_of_week\":\"thu\",\"start_time\":930,\"end_time\":1050}],\"ai_comment\":\"요청하신 로봇공학과 2학년 1학기 시간표를 작성했습니다. 월요일 수업을 배제하고, 오전 수업을 최소화하며 전공 필수 과목 위주로 구성했습니다. '동역학', '공업수학2', '수치계산', '확률과통계', '로봇프로그래밍', '지능형로봇프로그래밍의이해', '데이터처리' 과목을 포함하여 총 20학점을 이수하게 됩니다. '수치계산' 과목은 화요일에 오전 수업이 포함되어 있지만, 전공 관련성이 높고 다른 시간대의 대안이 부족하여 포함되었습니다. 커리큘럼 이미지에 명시된 '학술영어2:글쓰기'는 제공된 수강편람 데이터에 2학기 과목으로만 개설되어 있어 시간표에 포함하지 못했습니다. 목표 학점 18학점을 초과하였으나, 최대 학점 20학점 범위 내에서 전공 과목을 최대한 포함하도록 구성했습니다.\"}"
    };
  } else {
    return {
      status: 'ERROR',
      message: '조건을 만족하는 시간표를 생성할 수 없습니다.',
      data: null
    };
  }
};
