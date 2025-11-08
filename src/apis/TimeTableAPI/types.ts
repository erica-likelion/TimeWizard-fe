import type { Course } from '@/components/TimeTable/types';

/**
 * 시간표 목록 API 응답
 */
export interface GetTimeTablesResponse {
  success: boolean;
  data: {
    timetables: {
      timetable_id: number;
      timetable_name: string;
      semester: string;
      total_credits: number;
      is_ai_generated: boolean;
      is_main: boolean;
      course_count: number;
      created_at: string;
    }[];
  };
}

/**
 * 시간표 상세 API 응답
 */
export interface GetTimeTableDetailResponse {
  success: boolean;
  data: {
    timetable_id: number;
    timetable_name: string;
    semester: string;
    total_credits: number;
    is_ai_generated: boolean;
    is_main: boolean;
    course_count: number;
    courses: Course[];
  };
}
