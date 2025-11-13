export interface TimeTable {
  timetableId: string;
  name: string;
}

/*
  강의 시간 타입
*/
export interface CourseTime {
  dayOfWeek: string;      // "MON", "TUE", "WED", "THU", "FRI"
  startTime: number;       // 분 단위 시작 시간
  endTime: number;         // 분 단위 종료 시간
  classroom: string;       // 강의실
}

/*
  강의 타입
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
export type GetTimeTablesResponse = TimeTable[]; 

/*
  시간표 강의 목록 API 응답
*/
export type GetTimeTableDetailResponse = Course[];

/*
  시간표 저장 API 요청
*/
export interface SaveTimetableRequest {
  courseIds: number[];
  name: string;
  aiComment: string;
  uuidKey: string;
}
