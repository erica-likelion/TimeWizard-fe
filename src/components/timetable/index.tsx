import React from 'react';

import { cn } from '@/utils/util';
import { fontStyles } from '@/utils/styles';
import type { TimeTableProps } from './types';

// EN: api에서 받아오는 값
// KR: EN을 기반으로 화면에 띄울 값
const DAYS_KR = ['월', '화', '수', '목', '금'];
const DAYS_EN = ['mon', 'tue', 'wed', 'thu', 'fri'];

// 시간표 시작 시간, 끝 시간, 시간표 간격
const START_HOUR = 9;
const END_HOUR = 21;
const SLOT_DURATION = 30;

/**
 * 수업 별로 다른 색깔
 * (강의 코드 기반)
 */
const COLORS = [
  'bg-orange-500',   
  'bg-cyan-500',      
  'bg-purple-500',    
  'bg-green-500',     
  'bg-pink-500',      
  'bg-yellow-500',    
  'bg-blue-500',      
  'bg-red-500',       
];

/**
 * 시간표 컴포넌트
 *
 * Grid 레이아웃을 사용하여 주간 시간표를 렌더링합니다.
 * - 가로축: 요일 (월~금)
 * - 세로축: 시간 (9:00 ~ 21:00, 30분 단위)
 * - 각 수업은 Grid의 특정 영역에 배치됨
 */
export const TimeTable: React.FC<TimeTableProps> = ({ courses }) => {

  // 시간 슬롯 
  /**
   * ['9', '9:30', '10', '10:30', ..., '21']
   */
  const timeSlots: string[] = [];
  for (let hour = START_HOUR; hour <= END_HOUR; hour++) {
    timeSlots.push(`${hour}`);
    if (hour < END_HOUR) {
      timeSlots.push(`${hour}:30`);
    }
  }

  // 유틸리티 함수들

  // 요일을 Grid의 column 번호로 변환하는 함수
  const getDayColumn = (day: string): number => {
    const index = DAYS_EN.indexOf(day.toLowerCase());
    return index + 2; // 1열은 시간 라벨이므로 +2
  };

  /* 시간(분 단위)을 Grid의 row 번호로 변환하는 함수
   * 예시:
   * - 540분(9:00) → (540 - 540) / 30 = 0 → row 2 (1행은 헤더)
   * - 570분(9:30) → (570 - 540) / 30 = 1 → row 3
   * - 630분(10:30) → (630 - 540) / 30 = 3 → row 5
   */
  const getTimeRow = (minutes: number): number => {
    const startMinutes = START_HOUR * 60; // 9시 = 540분
    const slotIndex = Math.floor((minutes - startMinutes) / SLOT_DURATION);
    return slotIndex + 2; // 1행은 요일 헤더이므로 +2
  };

  // 수업별 색상 할당
  const courseColors = new Map<number, string>();
  courses.forEach((course, index) => {
    if (!courseColors.has(course.course_id)) {
      courseColors.set(course.course_id, COLORS[index % COLORS.length]);
    }
  });




  return (
    <div className="w-full">
      {/*
        Grid 컨테이너 설정:
        - gridTemplateColumns:
          - 첫 번째 열(60px): 시간 라벨 표시
          - 나머지 5개 열(1fr씩): 월/화/수/목/금 요일 칸 (동일한 크기로 분할)

        - gridTemplateRows:
          - 첫 번째 행(40px): 요일 헤더
          - 나머지 행들(각 40px): 시간 슬롯 수만큼 반복 (총 25개)
      */}
      <div
        className="grid gap-0"
        style={{
          gridTemplateColumns: '30px repeat(5, 1fr)',
          gridTemplateRows: `40px repeat(${timeSlots.length}, 40px)`,
        }}
      >
        {/* 좌측 상단 빈 칸 (1행 1열) - 명시적 배치 */}
        <div
          className=""
          style={{
            gridColumn: 1,
            gridRow: 1
          }}
        ></div>

        {/* 요일 헤더 (1행 2~6열: 월/화/수/목/금) - 명시적 배치 */}
        {DAYS_KR.map((day, index) => (
          <div
            key={day}
            className={cn("flex items-center justify-center font-bold border-b-2 border-[#BBB]",
              fontStyles.caption,
              index % 2 === 0 ? "bg-[#767676]" : "bg-[#505050]")
            }
            style={{
                gridColumn: index + 2,  // 2, 3, 4, 5, 6열
                gridRow: 1              // 1행
            }}
          >
            {day}
          </div>
        ))}

        {/* ========== 시간표 본문 영역 ========== */}

        {/*
          각 시간 슬롯마다 행을 생성
          - 시간 라벨: 1열, index+2행
          - 빈 셀들: 2~6열, index+2행
          모든 요소의 위치를 명시적으로 지정
        */}
        {timeSlots.map((time, timeIndex) => (
          <React.Fragment key={time}>
            {/* 시간 라벨 (1열, 해당 시간의 행)*/}
            <div
              className={cn("flex justify-center font-bold", fontStyles.caption)}
              style={{
                gridColumn: 1,              // 1열 (시간 라벨 열)
                gridRow: timeIndex + 2,     // 2행부터 시작 (1행은 헤더)
              }}
            >
              {timeIndex % 2 ? "": time}
            </div>

            {/* 각 요일별 빈 셀 (2~6열, 해당 시간의 행*/}
            {DAYS_KR.map((day, dayIndex) => {
              // 월(0), 수(2), 금(4): #767676
              // 화(1), 목(3): #505050
              const bgColor = dayIndex === 0 || dayIndex === 2 || dayIndex === 4
                ? 'bg-[#767676]'
                : 'bg-[#505050]';

              return (
                <div
                  key={`${day}-${time}`}
                  className={cn(bgColor)}
                  style={{
                    gridColumn: dayIndex + 2,   // 2~6열 (월~금)
                    gridRow: timeIndex + 2,     // 2행부터 시작
                  }}
                >
                </div>
              );
            })}
          </React.Fragment>
        ))}

        {courses.map((course) => {
          const dayColumn = getDayColumn(course.day_of_week);     // 요일 → 열 번호 (2~6)
          const startRow = getTimeRow(course.start_time);         // 시작 시간 → 시작 행
          const endRow = getTimeRow(course.finish_time) + 1;      // 종료 시간 → 종료 행 (+1은 exclusive)
          const color = courseColors.get(course.course_id);       // 수업별 색상
          
          return (
            <div
              key={`${course.course_id}-${course.day_of_week}`}
              className={cn(`${color} p-2 flex flex-col justify-evenly items-center overflow-hidden`, fontStyles.caption)}
              style={{
                gridColumn: dayColumn,              
                gridRow: `${startRow} / ${endRow}`, 
              }}
            >
              {/* 수업 이름 */}
              <p className="font-bold text-center">{course.course_name}</p>
              {/* 교수명 */}
              <p className="font-bold text-center">{course.professor}</p>
              {/* 강의실 위치 */}
              {course.location && (
                <p className="text-center">{course.location}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
