import api from "@utils/apiClient";
import type { GetTimeTablesResponse, GetTimeTableDetailResponse, Course, SaveTimetableRequest } from './types';

/*
  시간표 목록 조회
*/
export const getTimeTables = async (): Promise<GetTimeTablesResponse> => {
    try {
        const response = await api.get(`/timetable/lists`);
        return response.data;
    } catch (error) {
        console.error('시간표 조회 에러:', error);
        throw error;
  }
}

/*
  목업 시간표 목록 조회
*/
export const mockGetTimeTables = async (): Promise<GetTimeTablesResponse> => {
  return [
    {
      timetableId: "1",
      name: "25-2학기 플랜A"
    },
    {
      timetableId: "2",
      name: "25-2학기 플랜B"
    },
    {
      timetableId: "3",
      name: "25-2학기 플랜C"
    }
  ];
};

/*
  시간표의 강의 목록 조회
  인자 - 시간표 ID
  반환 - Course 배열
*/
export const getTimeTableDetail = async (timetableId: string): Promise<Course[]> => {
  try {
    const response = await api.get<GetTimeTableDetailResponse>(`/timetable/${timetableId}/courses`);
    return response.data;
  } catch (error) {
    console.error('시간표 강의 목록 조회 에러:', error);
    throw error;
  }
};

/*
  목업 시간표 강의 목록 조회
*/
export const mockGetTimeTableDetail = async (timetableId: string): Promise<Course[]> => {
  const mockData: Record<string, GetTimeTableDetailResponse> = {
    1: [
        {
          courseId: 1,
          courseCode: "CSE201",
          courseName: "데이터구조",
          courseEnglishName: "Data Structures",
          courseNumber: 1073741824,
          professor: "김교수",
          major: "컴퓨터공학과",
          section: 1,
          grade: 2,
          credits: 3,
          lectureHours: 3,
          practiceHours: 0,
          courseType: "전공필수",
          capacity: 40,
          semester: "2025-2",
          courseTimes: [
            {
              dayOfWeek: "MON",
              startTime: 540,
              endTime: 630,
              classroom: "공학관 301"
            },
            {
              dayOfWeek: "WED",
              startTime: 540,
              endTime: 630,
              classroom: "공학관 301"
            }
          ]
        },
        {
          courseId: 2,
          courseCode: "CSE301",
          courseName: "알고리즘",
          courseEnglishName: "Algorithms",
          courseNumber: 1073741825,
          professor: "박교수",
          major: "컴퓨터공학과",
          section: 1,
          grade: 3,
          credits: 3,
          lectureHours: 3,
          practiceHours: 0,
          courseType: "전공필수",
          capacity: 35,
          semester: "2025-2",
          courseTimes: [
            {
              dayOfWeek: "TUE",
              startTime: 660,
              endTime: 750,
              classroom: "IT관 205"
            }
          ]
        },
        {
          courseId: 3,
          courseCode: "CSE302",
          courseName: "운영체제",
          courseEnglishName: "Operating Systems",
          courseNumber: 1073741826,
          professor: "이교수",
          major: "컴퓨터공학과",
          section: 1,
          grade: 3,
          credits: 3,
          lectureHours: 2,
          practiceHours: 2,
          courseType: "전공필수",
          capacity: 40,
          semester: "2025-2",
          courseTimes: [
            {
              dayOfWeek: "WED",
              startTime: 720,
              endTime: 870,
              classroom: "공학관 401"
            }
          ]
        },
        {
          courseId: 4,
          courseCode: "CSE303",
          courseName: "데이터베이스",
          courseEnglishName: "Database Systems",
          courseNumber: 1073741827,
          professor: "최교수",
          major: "컴퓨터공학과",
          section: 1,
          grade: 3,
          credits: 3,
          lectureHours: 3,
          practiceHours: 0,
          courseType: "전공선택",
          capacity: 30,
          semester: "2025-2",
          courseTimes: [
            {
              dayOfWeek: "THU",
              startTime: 600,
              endTime: 690,
              classroom: "IT관 302"
            }
          ]
        },
        {
          courseId: 5,
          courseCode: "CSE401",
          courseName: "컴퓨터네트워크",
          courseEnglishName: "Computer Networks",
          courseNumber: 1073741828,
          professor: "정교수",
          major: "컴퓨터공학과",
          section: 1,
          grade: 4,
          credits: 3,
          lectureHours: 3,
          practiceHours: 0,
          courseType: "전공선택",
          capacity: 35,
          semester: "2025-2",
          courseTimes: [
            {
              dayOfWeek: "FRI",
              startTime: 780,
              endTime: 870,
              classroom: "IT관 501"
            }
          ]
        }
      ],
    2: [
        {
          courseId: 6,
          courseCode: "AI101",
          courseName: "인공지능",
          courseEnglishName: "Artificial Intelligence",
          courseNumber: 1073741829,
          professor: "강교수",
          major: "인공지능학과",
          section: 1,
          grade: 3,
          credits: 3,
          lectureHours: 2,
          practiceHours: 2,
          courseType: "전공필수",
          capacity: 30,
          semester: "2025-2",
          courseTimes: [
            {
              dayOfWeek: "MON",
              startTime: 600,
              endTime: 750,
              classroom: "AI센터 101"
            }
          ]
        },
        {
          courseId: 7,
          courseCode: "AI201",
          courseName: "머신러닝",
          courseEnglishName: "Machine Learning",
          courseNumber: 1073741830,
          professor: "윤교수",
          major: "인공지능학과",
          section: 1,
          grade: 3,
          credits: 3,
          lectureHours: 3,
          practiceHours: 0,
          courseType: "전공필수",
          capacity: 25,
          semester: "2025-2",
          courseTimes: [
            {
              dayOfWeek: "WED",
              startTime: 540,
              endTime: 630,
              classroom: "AI센터 203"
            }
          ]
        },
        {
          courseId: 8,
          courseCode: "AI301",
          courseName: "딥러닝",
          courseEnglishName: "Deep Learning",
          courseNumber: 1073741831,
          professor: "송교수",
          major: "인공지능학과",
          section: 1,
          grade: 4,
          credits: 3,
          lectureHours: 2,
          practiceHours: 2,
          courseType: "전공선택",
          capacity: 20,
          semester: "2025-2",
          courseTimes: [
            {
              dayOfWeek: "FRI",
              startTime: 660,
              endTime: 810,
              classroom: "AI센터 301"
            }
          ]
        }
      ],
    3: [
        {
          courseId: 9,
          courseCode: "WEB101",
          courseName: "웹프로그래밍",
          courseEnglishName: "Web Programming",
          courseNumber: 1073741832,
          professor: "한교수",
          major: "소프트웨어학과",
          section: 1,
          grade: 2,
          credits: 3,
          lectureHours: 2,
          practiceHours: 2,
          courseType: "전공선택",
          capacity: 40,
          semester: "2025-2",
          courseTimes: [
            {
              dayOfWeek: "MON",
              startTime: 840,
              endTime: 990,
              classroom: "IT관 401"
            }
          ]
        },
        {
          courseId: 10,
          courseCode: "MOB101",
          courseName: "모바일프로그래밍",
          courseEnglishName: "Mobile Programming",
          courseNumber: 1073741833,
          professor: "장교수",
          major: "소프트웨어학과",
          section: 1,
          grade: 3,
          credits: 3,
          lectureHours: 3,
          practiceHours: 0,
          courseType: "전공선택",
          capacity: 35,
          semester: "2025-2",
          courseTimes: [
            {
              dayOfWeek: "TUE",
              startTime: 720,
              endTime: 810,
              classroom: "IT관 402"
            }
          ]
        },
        {
          courseId: 11,
          courseCode: "SE101",
          courseName: "소프트웨어공학",
          courseEnglishName: "Software Engineering",
          courseNumber: 1073741834,
          professor: "임교수",
          major: "소프트웨어학과",
          section: 1,
          grade: 3,
          credits: 3,
          lectureHours: 2,
          practiceHours: 2,
          courseType: "전공필수",
          capacity: 30,
          semester: "2025-2",
          courseTimes: [
            {
              dayOfWeek: "THU",
              startTime: 900,
              endTime: 1050,
              classroom: "공학관 501"
            }
          ]
        }
      ]
  };

  if (!mockData[timetableId]) {
    throw new Error("시간표를 찾을 수 없습니다.");
  }

  return mockData[timetableId];
};

/*
  시간표 저장 API
*/
export const saveTimetable = async (request: SaveTimetableRequest): Promise<void> => {
  try {
    await api.post('/save-timetable', request);
  } catch (error) {
    console.error('시간표 저장 에러:', error);
    throw error;
  }
};

/*
  시간표 삭제 API
*/
export const deleteTimetable = async (timetableId: string): Promise<void> => {
  try {
    await api.post(`/timetable/${timetableId}`);
  } catch (error) {
    console.error('시간표 삭제 에러:', error);
    throw error;
  }
};