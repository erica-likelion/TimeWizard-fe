/**
 * 시간표 관련 유틸리티 함수 및 상수
 */

// ========== 색상 관련 ==========

/**
 * 수업별로 할당할 수 있는 색상 배열 (hex 값)
 * (강의 인덱스 기반으로 순환 사용)
 */
export const COLORS = [
  '#f97316', // orange-500
  '#06b6d4', // cyan-500
  '#a855f7', // purple-500
  '#22c55e', // green-500
  '#ec4899', // pink-500
  '#eab308', // yellow-500
  '#3b82f6', // blue-500
  '#ef4444', // red-500
];

/**
 * 강의 목록에 대해 색상을 할당하는 함수
 * - 같은 course_id는 항상 같은 색상
 * - 다른 course_id는 최대한 다른 색상 할당
 *
 * @param courses - 강의 목록 (course_id 속성을 가진 객체 배열)
 * @returns course_id를 키로, 색상을 값으로 가지는 Map
 */
export const assignCourseColors = <T extends { course_id: number }>(
  courses: T[]
): Map<number, string> => {
  const courseColors = new Map<number, string>();
  const usedColorIndices = new Set<number>();

  courses.forEach((course) => {
    if (!courseColors.has(course.course_id)) {
      // courseId 기반 초기 인덱스
      let colorIndex = course.course_id % COLORS.length;

      // 이미 사용된 색이면 다음 색 찾기 (8개 색상 모두 사용되지 않았을 때만)
      while (usedColorIndices.has(colorIndex) && usedColorIndices.size < COLORS.length) {
        colorIndex = (colorIndex + 1) % COLORS.length;
      }

      courseColors.set(course.course_id, COLORS[colorIndex]);
      usedColorIndices.add(colorIndex);
    }
  });

  return courseColors;
};

// ========== 요일 관련 ==========

/**
 * 요일 한글 표기 (월~금)
 */
export const DAYS_KR = ['월', '화', '수', '목', '금'];

/**
 * 요일 영문 표기 (API에서 받아오는 값)
 */
export const DAYS_EN = ['mon', 'tue', 'wed', 'thu', 'fri'];

/**
 * 요일 영문 -> 한글 매핑
 */
export const DAY_MAP: { [key: string]: string } = {
  'mon': '월',
  'tue': '화',
  'wed': '수',
  'thu': '목',
  'fri': '금',
};

/**
 * 요일을 Grid의 column 번호로 변환하는 함수
 * @param day - 요일 영문 표기 (예: 'mon', 'tue')
 * @returns Grid column 번호 (2~6, 1열은 시간 라벨)
 */
export const getDayColumn = (day: string): number => {
  const index = DAYS_EN.indexOf(day.toLowerCase());
  return index + 2; // 1열은 시간 라벨이므로 +2
};

// ========== 시간 관련 ==========

/**
 * 시간표 시작 시간 (9시)
 */
export const START_HOUR = 9;

/**
 * 시간표 종료 시간 (21시)
 */
export const END_HOUR = 21;

/**
 * 시간표 슬롯 간격 (30분)
 */
export const SLOT_DURATION = 30;

/**
 * 시간(분 단위)을 HH:MM 형식으로 변환
 * @param minutes - 분 단위 시간 (예: 540 = 9:00, 630 = 10:30)
 * @returns HH:MM 형식의 문자열
 */
export const formatTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

/**
 * 시간(분 단위)을 Grid의 row 번호로 변환하는 함수
 * @param minutes - 분 단위 시간
 * @returns Grid row 번호 (2부터 시작, 1행은 요일 헤더)
 *
 * @example
 * - 540분(9:00) -> (540 - 540) / 30 = 0 -> row 2
 * - 570분(9:30) -> (570 - 540) / 30 = 1 -> row 3
 * - 630분(10:30) -> (630 - 540) / 30 = 3 -> row 5
 */
export const getTimeRow = (minutes: number): number => {
  const startMinutes = START_HOUR * 60; // 9시 = 540분
  const slotIndex = Math.floor((minutes - startMinutes) / SLOT_DURATION);
  return slotIndex + 2; // 1행은 요일 헤더이므로 +2
};

/**
 * 시간 슬롯 배열 생성
 * @returns 시간 슬롯 배열 ['9', '9:30', '10', '10:30', ..., '21']
 */
export const generateTimeSlots = (): string[] => {
  const timeSlots: string[] = [];
  for (let hour = START_HOUR; hour <= END_HOUR; hour++) {
    timeSlots.push(`${hour}`);
    if (hour < END_HOUR) {
      timeSlots.push(`${hour}:30`);
    }
  }
  return timeSlots;
};
