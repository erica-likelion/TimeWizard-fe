// 시간표 관련 유틸 함수랑 상수

import type { Course, CourseTime } from "@/apis/TimeTableAPI/types";

// =============================
// 색상 관련 함수랑 상수

// 사용 색
export const COLORS = [
  '#f97316', 
  '#06b6d4', 
  '#a855f7', 
  '#22c55e', 
  '#ec4899', 
  '#eab308', 
  '#3b82f6', 
  '#ef4444'
];

 /* 
  강의랑 색이랑 매핑하는 함수
  course_id를 기반으로 색상 할당
  인자 - courses
  반환 - course_id를 키로, 색상을 값으로 가지는 Map
 */
export const assignCourseColors = <T extends { courseId: number }>(
  courses: T[]
): Map<number, string> => {
  const courseColors = new Map<number, string>();
  const usedColorIndices = new Set<number>(); // 이미 사용된 색들

  courses.forEach((course) => {
    if (!courseColors.has(course.courseId)) {
      // courseId로 일단 하나 정함
      let colorIndex = course.courseId % COLORS.length;

      // 이미 사용된 색이면 다음 색으로 계속 넘어가는데 모든 색이 사용되었으면 중복될 수 있음
      while (usedColorIndices.has(colorIndex) && usedColorIndices.size < COLORS.length) {
        colorIndex = (colorIndex + 1) % COLORS.length;
      }

      courseColors.set(course.courseId, COLORS[colorIndex]);
      usedColorIndices.add(colorIndex);
    }
  });

  return courseColors;
};

// =============================
// 요일 관련 함수랑 상수

// 요일 영문 (평일)
export const DAYS_EN = ['MON', 'TUE', 'WED', 'THU', 'FRI'];

// 영문 요일을 한글로 매핑
export const DAY_MAP: { [key: string]: string } = {
  'MON': '월',
  'TUE': '화',
  'WED': '수',
  'THU': '목',
  'FRI': '금',
  'SAT': '토',
  'SUN': '일',
};

// 영문 요일 배열을 한글로 변환하는 헬퍼 함수
export const convertDaysToKorean = (daysEn: string[]): string[] => {
  return daysEn.map(day => DAY_MAP[day]);
};

/*
  요일을 그리드 열 번호로 바꿔주는 함수
  인자 - 영문 요일 (대문자: "MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN")
  인자 - 표시할 요일 배열 (기본값: DAYS_EN)
  반환 - 그리드 열 번호 (월:2, 화:3, 수:4, 목:5, 금:6, 토:7, 일:8) => 1열은 시간 배열이라서 그럼
 */
export const getDayColumn = (day: string, visibleDays: string[] = DAYS_EN): number => {
  const index = visibleDays.indexOf(day);
  return index + 2;
};

// =============================
// 시간 관련 함수랑 상수

// 시간표 시작 / 끝 시간 / 간격
let START_TIME = 540;
let END_TIME = 0;
let SLOT_DURATION = 10;  // 10분 단위로 변경

/*
  시간(분 단위)을 HH:MM 형식으로 변환
  인자 - 분단위 시간 (데베에 540(9시 00분), 630(10시 30분) 이렇게 저장되어 있음)
  반환 - 'HH:MM' 형식 문자열
  현재는 사용안함 => 디자인 상으로는 있어서 일단 만듬
 */
export const formatTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

/*
  시간(분 단위)을 Grid의 row 번호로 변환하는 함수
  인자 - 분단위 시간 (데베에 540(9시 00분), 630(10시 30분) 이렇게 저장되어 있음)
  반환 - 그리드 행 번호 (2부터 시작, 1행은 요일 헤더)

  1행은 요일 헤더라서 2행부터 시작
  10분 단위로 계산:
  - 540분(9:00) -> (540 - 540) / 10 = 0 -> row 2
  - 550분(9:10) -> (550 - 540) / 10 = 1 -> row 3
  - 560분(9:20) -> (560 - 540) / 10 = 2 -> row 4
  - 570분(9:30) -> (570 - 540) / 10 = 3 -> row 5
 */
export const getTimeRow = (minutes: number): number => {
  const startMinutes = START_TIME;
  const slotIndex = Math.floor((minutes - startMinutes) / SLOT_DURATION);
  return slotIndex + 2;
};


// 시간 슬롯 배열 생성에 사용하는 헬퍼 함수
// 시간표를 돌면서 가장 늦은 시간을 찾아 END_HOUR을 설정
const setTimeTableSlotConfig = (courses : Course[]) => {
  courses.forEach(course => {
    course.courseTimes.forEach(timeSlot => {
      END_TIME = Math.max(END_TIME, timeSlot.endTime);
    });
  })
};

/*
  시간 슬롯 배열 생성
  반환 - 시간 슬롯 배열 ['9', '9:10', '9:20', '9:30', '9:40', '9:50', '10', ...]
  10분 단위이나 UI에는 정시만 표시
*/
export const generateTimeSlots = (courses: Course[]): string[] => {
  setTimeTableSlotConfig(courses);
  console.log('END_TIME in generateTimeSlots:', END_TIME);
  const timeSlots: string[] = [];
  for (let hour = Math.floor(START_TIME / 60); hour <= Math.floor(END_TIME / 60); hour++) {
    for (let min = 0; min < 60; min += SLOT_DURATION) {
      const currentTime = hour * 60 + min;

      // SLOT_DURATION을 빼야 마지막 슬롯이 END_TIME을 넘지 않음
      if (currentTime > END_TIME - SLOT_DURATION) break;
      console.log(currentTime);
      if (min === 0) {
        timeSlots.push(`${hour}`);
      } else {
        timeSlots.push(`${hour}:${min.toString().padStart(2, '0')}`);
      }
    }
  }
  return timeSlots;
};

/*
  같은 강의가 연속되어 있을 때, 병합해주는 함수

  인자 - courses: 강의 배열
  반환 - 연속된 시간대가 병합된 새로운 강의 배열
*/
export const mergeConsecutiveCourseTimes = (courses: Course[]): Course[] => {
  return courses.map(course => {
    // 요일별로 courseTimes 그룹화
    const timesByDay = new Map<string, CourseTime[]>();

    course.courseTimes.forEach(time => {
      const day = time.dayOfWeek;
      if (!timesByDay.has(day)) {
        timesByDay.set(day, []);
      }
      timesByDay.get(day)!.push(time);
    });

    const mergedTimes: CourseTime[] = [];
    timesByDay.forEach((times) => {
      // startTime 기준 오름차순으로 정렬됨
      const sortedTimes = [...times].sort((a, b) => a.startTime - b.startTime);
      let current = sortedTimes[0];
      // end랑 다음 start가 같으면 병합
      for (let i = 1; i < sortedTimes.length; i++) {
        const next = sortedTimes[i];
        if (current.endTime === next.startTime) {
          current = {
            ...current,
            endTime: next.endTime
          };
        } else {
          mergedTimes.push(current);
          current = next;
        }
      }

      mergedTimes.push(current);
    });

    return {
      ...course,
      courseTimes: mergedTimes
    };
  });
};

