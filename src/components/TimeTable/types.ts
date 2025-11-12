// 시간표
import type { Course } from "@/apis/TimeTableAPI/types";

// TimeTable 컴포넌트의 Props 타입
export interface TimeTableProps {
  courses: Course[];       // 표시할 수업 목록
  
  // list/timetableId 에서 호버링할 경우 강조 표기 위해 사용
  activeCourseId?: number | undefined; 
}
