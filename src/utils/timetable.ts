// 시간표 관련 유틸 함수랑 상수


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
export const assignCourseColors = <T extends { course_id: number }>(
  courses: T[]
): Map<number, string> => {
  const courseColors = new Map<number, string>();
  const usedColorIndices = new Set<number>(); // 이미 사용된 색들

  courses.forEach((course) => {
    if (!courseColors.has(course.course_id)) {
      // courseId로 일단 하나 정함
      let colorIndex = course.course_id % COLORS.length;

      // 이미 사용된 색이면 다음 색으로 계속 넘어가는데 모든 색이 사용되었으면 중복될 수 있음
      while (usedColorIndices.has(colorIndex) && usedColorIndices.size < COLORS.length) {
        colorIndex = (colorIndex + 1) % COLORS.length;
      }

      courseColors.set(course.course_id, COLORS[colorIndex]);
      usedColorIndices.add(colorIndex);
    }
  });

  return courseColors;
};

// =============================
// 요일 관련 함수랑 상수

// 요일 한글이랑 영문
export const DAYS_KR = ['월', '화', '수', '목', '금'];
export const DAYS_EN = ['mon', 'tue', 'wed', 'thu', 'fri'];

// 영문 요일을 한글로 매핑
// 현재는 사용안함 => 나중에 필요할 수 있어서 일단 만듬
export const DAY_MAP: { [key: string]: string } = {
  'mon': '월',
  'tue': '화',
  'wed': '수',
  'thu': '목',
  'fri': '금',
};

/*
  요일을 그리드 열 번호로 바꿔주는 함수
  인자 - 영문 요일
  반환 - 그리드 열 번호 (월:2, 화:3, 수:4, 목:5, 금:6) => 1열은 시간 배열이라서 그럼
 */
export const getDayColumn = (day: string): number => {
  const index = DAYS_EN.indexOf(day.toLowerCase());
  return index + 2;
};

// =============================
// 시간 관련 함수랑 상수

// 시간표 시작 / 끝 시간 / 간격
export const START_HOUR = 9;
export const END_HOUR = 21;
export const SLOT_DURATION = 30;

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
  - 540분(9:00) -> (540 - 540) / 30 = 0 -> row 2
  - 570분(9:30) -> (570 - 540) / 30 = 1 -> row 3
  - 630분(10:30) -> (630 - 540) / 30 = 3 -> row 5
 */
export const getTimeRow = (minutes: number): number => {
  const startMinutes = START_HOUR * 60;
  const slotIndex = Math.floor((minutes - startMinutes) / SLOT_DURATION);
  return slotIndex + 2; 
};

/*
  시간 슬롯 배열 생성
  반환 - 시간 슬롯 배열 ['9', '9:30', '10', '10:30', ..., '21']
  30분 단위는 저장은 하지만 화면에는 표시 안하고 있음
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

// =============================
// API 변환 관련 함수

/*
  요일 변환 (API의 대문자 영어 → 기존 소문자 영어)
  인자 - API 요일 ('MON', 'TUE', 'WED', 'THU', 'FRI')
  반환 - 기존 형식 요일 ('mon', 'tue', 'wed', 'thu', 'fri')
*/
export const convertDayOfWeek = (day: string): string => {
  const dayMap: Record<string, string> = {
    'MON': 'mon',
    'TUE': 'tue',
    'WED': 'wed',
    'THU': 'thu',
    'FRI': 'fri'
  };
  return dayMap[day] || day.toLowerCase();
};
