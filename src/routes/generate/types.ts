import type { Course } from '@/components/TimeTable/types';

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