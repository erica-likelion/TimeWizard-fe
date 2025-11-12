export interface TimeTableAPI {
  timetableId: string;
  name: string;
}

/*
  새로운 API 강의 시간 타입
*/
export interface CourseTime {
  dayOfWeek: string;      // "MON", "TUE", "WED", "THU", "FRI"
  startTime: number;       // 분 단위 시작 시간
  endTime: number;         // 분 단위 종료 시간
  classroom: string;       // 강의실
}

/*
  새로운 API 강의 타입
*/
export interface Course {
  courseId: number;
  courseCode: string;
  courseName: string;
  courseEnglishName: string;
  courseNumber: number;
  professor: string;
  major: string;
  section: number;
  grade: number;
  credits: number;
  lectureHours: number;
  practiceHours: number;
  courseType: string;
  capacity: number;
  semester: string;
  courseTimes: CourseTime[];
}

/*
  시간표 목록 API 응답
*/
export type GetTimeTablesResponse = TimeTableAPI[]; 

/*
  시간표 강의 목록 API 응답 (새 API)
  - API가 Course[] 배열을 바로 반환
*/
export type GetTimeTableDetailResponse = Course[];
