// 시간표

// 시간표 강의 타입
export interface Course {
  course_id: number;       // 수업 고유 ID
  course_name: string;     // 수업 이름 (예: "데이터구조")
  professor: string;       // 교수명
  day_of_week: string;     // 요일 (영어: 'mon', 'tue', 'wed', 'thu', 'fri')
  start_time: number;      // 시작 시간 (분 단위, 예: 540 = 9:00, 630 = 10:30)
  finish_time: number;     // 종료 시간 (분 단위, 예: 630 = 10:30, 750 = 12:30)
  location?: string;       // 강의실 위치 (선택, 예: "공학관 301호")
}

// TimeTable 컴포넌트의 Props 타입
export interface TimeTableProps {
  courses: Course[];       // 표시할 수업 목록
  
  // list/timetableId 에서 호버링할 경우 강조 표기 위해 사용
  activeCourseId?: number | undefined; 
}
