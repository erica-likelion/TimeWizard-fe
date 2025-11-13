import type { CourseTime } from '@/apis/TimeTableAPI/types';

/*
  AI 시간표 생성 요청
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
  Debuging 페이지에서 사용할 강의 타입
*/
export interface DebugGeneratedCourse {
  course_id: string;
  course_name: string;
  professor: string;
  day_of_week: string; 
  start_time: number;
  end_time: number;
}

/*
  AI 시간표 생성 상태 조회 응답에서 반환되는 강의 정보
*/
export interface GeneratedCourse {
  course_id: string;
  course_name: string;
  professor: string;
  courseTimes: CourseTime[];
}

/*
  AI 시간표 생성 상태 조회 응답 - COMPLETE
*/
export interface GenerationStatusCompleteResponse {
  status: 'COMPLETE';
  message: string;
  data: string; // GeneratedCourse[], ai_comment를 JSON 문자열 반환
}

/*
  AI 시간표 생성 상태 조회 응답 - WAITING
*/
export interface GenerationStatusWaitingResponse {
  status: 'WAITING';
  message: string;
  data?: null;
}

/*
  AI 시간표 생성 상태 조회 응답 - ERROR
*/
export interface GenerationStatusErrorResponse {
  status: 'ERROR';
  message: string;
  data?: null;
}

/*
  AI 시간표 생성 상태 조회 응답 - NOT_FOUND
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
