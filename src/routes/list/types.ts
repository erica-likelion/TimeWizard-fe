import type { Course } from '@/components/timetable/types';

/**
 * 시간표 목록 아이템
 */
export interface TimeTableItem {
  timetable_id: number;
  timetable_name: string;
  semester: string;
  total_credits: number;
  is_ai_generated: boolean;
  is_main: boolean;
  course_count: number;
  created_at: string;
}

/**
 * 시간표 상세 정보
 */
export interface TimeTableDetail {
  timetable_id: number;
  timetable_name: string;
  semester: string;
  total_credits: number;
  is_ai_generated: boolean;
  is_main: boolean;
  course_count: number;
  courses: Course[];
}
