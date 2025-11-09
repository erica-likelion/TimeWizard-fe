/**
 * AI 시간표 생성 요청 파라미터
 */
export interface GenerateTimetableRequest {
  // 학기
  semester: string;
  // 목표 학점
  target_credits: number;
  // 선호 사항
  preferences: {
    // 선호 요일
    preferred_days?: string[];
    // 선호 시작 시간
    preferred_start_time?: string;
    // 선호 종료 시간
    preferred_end_time?: string;
    // 필수 수강 과목 ID
    required_courses?: number[];
    // 제외 과목 ID
    excluded_courses?: number[];
  };
}

/**
 * AI 시간표 생성 응답
 */
export interface GenerateTimetableResponse {
  success: boolean;
  data: {
    // 생성 이력 ID
    history_id: number;
    // 상태 (pending)
    status: string;
    // 응답 메시지
    message: string;
  };
}

/**
 * AI 시간표 생성 상태 조회 응답 - 성공 (completed)
 */
export interface GenerationStatusSuccessResponse {
  success: boolean;
  data: {
    // 생성 이력 ID
    history_id: number;
    // 상태 (completed)
    status: 'completed';
    // 생성된 시간표 ID
    timetable_id: number;
    // 응답 메시지
    message: string;
  };
}

/**
 * AI 시간표 생성 상태 조회 응답 - 실패 (failed)
 */
export interface GenerationStatusFailureResponse {
  success: boolean;
  data: {
    // 상태 (failed)
    status: 'failed';
    // 에러 메시지
    error_message: string;
    // 개선 제안 목록
    suggestions: string[];
  };
}

/**
 * AI 시간표 생성 상태 조회 응답
 */
export type GenerationStatusResponse = GenerationStatusSuccessResponse | GenerationStatusFailureResponse;
