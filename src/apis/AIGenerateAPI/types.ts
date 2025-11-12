/*
  AI 시간표 생성 요청 파라미터
*/
export interface GenerateTimetableRequest {
  requestText: string;
  maxCredit: number;
  targetCredit: number;
}

/*
  AI 시간표 생성 응답
*/
export type GenerateTimetableResponse = string;

/*
  AI 시간표 생성 상태 조회 응답에서 반환되는 강의 정보
  (flat 구조 - 각 시간대별로 개별 항목)
*/
export interface GeneratedCourse {
  course_id: string;
  course_name: string;
  professor: string;
  day_of_week: string; // "mon", "tue", "wed", "thu", "fri"
  start_time: number; // 분 단위
  end_time: number; // 분 단위
}

/*
  AI 시간표 생성 상태 조회 응답 - 완료 (COMPLETE)
*/
export interface GenerationStatusCompleteResponse {
  status: 'COMPLETE';
  message: string;
  data: string; // JSON 문자열 형태로 courses와 ai_comment 포함
}

/*
  AI 시간표 생성 상태 조회 응답 - 대기 중 (WAITING)
*/
export interface GenerationStatusWaitingResponse {
  status: 'WAITING';
  message: string;
  data?: null;
}

/*
  AI 시간표 생성 상태 조회 응답 - 에러 (ERROR)
*/
export interface GenerationStatusErrorResponse {
  status: 'ERROR';
  message: string;
  data?: null;
}

/*
  AI 시간표 생성 상태 조회 응답 - 찾을 수 없음 (NOT_FOUND)
*/
export interface GenerationStatusNotFoundResponse {
  status: 'NOT_FOUND';
  message: string;
  data?: null;
}

/*
  AI 시간표 생성 상태 조회 응답
*/
export type GenerationStatusResponse =
  | GenerationStatusCompleteResponse
  | GenerationStatusWaitingResponse
  | GenerationStatusErrorResponse
  | GenerationStatusNotFoundResponse;
