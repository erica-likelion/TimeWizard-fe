import api from "@utils/apiClient";
import type { GetTimeTablesResponse, GetTimeTableDetailResponse } from './types'; 

export const getTimeTables = async () => {
    try {
        const response = await api.get(`/timetable`);
        return response.data;
    } catch (error) {
        console.error('시간표 조회 에러:', error);
        throw error;
  }
}

/**
 * 개발/테스트용 시간표 목록 모의 API
 */
export const mockGetTimeTables = async (): Promise<GetTimeTablesResponse> => {
  return {
    success: true,
    data: {
      timetables: [
        {
          timetable_id: 1,
          timetable_name: "25-2학기 플랜A",
          semester: "2025-2학기",
          total_credits: 18,
          is_ai_generated: true,
          is_main: true,
          course_count: 6,
          created_at: "2025-08-02"
        },
        {
          timetable_id: 2,
          timetable_name: "25-2학기 플랜B",
          semester: "2025-2학기",
          total_credits: 15,
          is_ai_generated: false,
          is_main: false,
          course_count: 5,
          created_at: "2025-07-29"
        },
        {
          timetable_id: 3,
          timetable_name: "25-2학기 플랜C",
          semester: "2025-1학기",
          total_credits: 21,
          is_ai_generated: false,
          is_main: false,
          course_count: 7,
          created_at: "2025-02-02"
        }
      ]
    }
  };
}

/**
 * 시간표 상세 조회
 */
export const getTimeTableDetail = async (timetableId: number) => {
  try {
    const response = await api.get(`/timetables/${timetableId}`);
    return response.data;
  } catch (error) {
    console.error('시간표 상세 조회 에러:', error);
    throw error;
  }
}

/**
 * 개발/테스트용 시간표 상세 조회 모의 API
 */
export const mockGetTimeTableDetail = async (timetableId: number): Promise<GetTimeTableDetailResponse> => {

  const mockData: Record<number, GetTimeTableDetailResponse> = {
    1: {
      success: true,
      data: {
        timetable_id: 1,
        timetable_name: "25-2학기 플랜A",
        semester: "2025-2학기",
        total_credits: 18,
        is_ai_generated: true,
        is_main: true,
        course_count: 6,
        courses: [
          {
            course_id: 1,
            course_name: "데이터구조",
            professor: "김교수",
            day_of_week: "mon",
            start_time: 540,
            finish_time: 630,
            location: "공학관 301"
          },
          {
            course_id: 2,
            course_name: "알고리즘",
            professor: "박교수",
            day_of_week: "tue",
            start_time: 660,
            finish_time: 750,
            location: "IT관 205"
          },
          {
            course_id: 3,
            course_name: "운영체제",
            professor: "이교수",
            day_of_week: "wed",
            start_time: 720,
            finish_time: 870,
            location: "공학관 401"
          },
          {
            course_id: 4,
            course_name: "데이터베이스",
            professor: "최교수",
            day_of_week: "thu",
            start_time: 600,
            finish_time: 690,
            location: "IT관 302"
          },
          {
            course_id: 1,
            course_name: "데이터구조",
            professor: "김교수",
            day_of_week: "wed",
            start_time: 540,
            finish_time: 630,
            location: "공학관 301"
          },
          {
            course_id: 5,
            course_name: "컴퓨터네트워크",
            professor: "정교수",
            day_of_week: "fri",
            start_time: 780,
            finish_time: 870,
            location: "IT관 501"
          }
        ]
      }
    },
    2: {
      success: true,
      data: {
        timetable_id: 2,
        timetable_name: "25-2학기 플랜B",
        semester: "2025-2학기",
        total_credits: 15,
        is_ai_generated: false,
        is_main: false,
        course_count: 5,
        courses: [
          {
            course_id: 6,
            course_name: "인공지능",
            professor: "강교수",
            day_of_week: "mon",
            start_time: 600,
            finish_time: 750,
            location: "AI센터 101"
          },
          {
            course_id: 7,
            course_name: "머신러닝",
            professor: "윤교수",
            day_of_week: "wed",
            start_time: 540,
            finish_time: 630,
            location: "AI센터 203"
          },
          {
            course_id: 8,
            course_name: "딥러닝",
            professor: "송교수",
            day_of_week: "fri",
            start_time: 660,
            finish_time: 810,
            location: "AI센터 301"
          }
        ]
      }
    },
    3: {
      success: true,
      data: {
        timetable_id: 3,
        timetable_name: "25-2학기 플랜C",
        semester: "2025-1학기",
        total_credits: 21,
        is_ai_generated: false,
        is_main: false,
        course_count: 7,
        courses: [
          {
            course_id: 9,
            course_name: "웹프로그래밍",
            professor: "한교수",
            day_of_week: "mon",
            start_time: 840,
            finish_time: 990,
            location: "IT관 401"
          },
          {
            course_id: 10,
            course_name: "모바일프로그래밍",
            professor: "장교수",
            day_of_week: "tue",
            start_time: 720,
            finish_time: 810,
            location: "IT관 402"
          },
          {
            course_id: 11,
            course_name: "소프트웨어공학",
            professor: "임교수",
            day_of_week: "thu",
            start_time: 900,
            finish_time: 1050,
            location: "공학관 501"
          }
        ]
      }
    }
  };

  if (!mockData[timetableId]) {
    throw new Error("시간표를 찾을 수 없습니다.");
  }

  return mockData[timetableId];
}