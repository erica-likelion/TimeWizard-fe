/*
  AI 시간표 생성 요청 파라미터
*/
export interface GenerateTimetableRequest {
  semester: string; // 학기
  target_credits: number; // 목표 학점
  // 선호 사항
  preferences: {
    preferred_days?: string[]; // 선호 요일
    preferred_start_time?: string; // 선호 시작 시간
    preferred_end_time?: string; // 선호 종료 시간
    required_courses?: number[]; // 필수 과목 ID
    excluded_courses?: number[]; // 제외 과목 ID
  };
}

/*
  AI 시간표 생성 응답
*/
export interface GenerateTimetableResponse {
  success: boolean;
  data: {
    history_id: number; // 생성 이력 ID
    status: string; // 상태 (pending)
    message: string; // 응답 메시지
  };
}

/*
  AI 시간표 생성 상태 조회 응답 - 성공 (completed)
*/
export interface GenerationStatusSuccessResponse {
  success: boolean;
  data: {
    history_id: number; // 생성 이력 ID
    status: 'completed'; // 상태 (completed)
    timetable_id: number; // 생성된 시간표 ID
    message: string; // 응답 메시지
  };
}

/*
  AI 시간표 생성 상태 조회 응답 - 실패 (failed)
*/
export interface GenerationStatusFailureResponse {
  success: boolean;
  data: {

    status: 'failed'; // 상태 (failed)
    error_message: string; // 에러 메시지
    suggestions: string[]; // 개선 제안 목록
  };
}

/*
  AI 시간표 생성 상태 조회 응답 - 진행 중 (pending)
  API 명세에는 진행중의 경우가 없음
*/
export interface GenerationStatusPendingResponse {
  success: boolean;
  data: {
    history_id: number; // 생성 이력 ID
    status: 'pending'; // 상태 (pending)
    message: string; // 응답 메시지
  };
}

/*
  AI 시간표 생성 상태 조회 응답
*/
export type GenerationStatusResponse = GenerationStatusSuccessResponse | GenerationStatusFailureResponse | GenerationStatusPendingResponse;
