import type { Course } from '@/components/TimeTable/types';

// 옵션 타입
export interface Option {
  id: string | number
  label: string
}

// 제외 시간대 타입
export interface ExcludedTime {
  id: number
  day: string
  startTime: string
  endTime: string
}

// 시간표 상세 정보
export interface TimeTableDetail {
  timetable_id: number;
  timetable_name: string;
  total_credits: number;
  courses: Course[];
}

// GenerateResultPage 컴포넌트의 Props 타입
export interface GenerateResultPageProps {
  gentimetableId: string;
  message: string;
}