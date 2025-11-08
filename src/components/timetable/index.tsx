import React from 'react';

import { cn } from '@/utils/util';
import { fontStyles } from '@/utils/styles';
import {
  DAYS_KR,
  assignCourseColors,
  getDayColumn,
  getTimeRow,
  generateTimeSlots,
} from '@/utils/timetable';
import type { TimeTableProps } from './types';

/**
 * 시간표 컴포넌트
 *
 * Grid 레이아웃을 사용하여 주간 시간표를 렌더링합니다.
 * - 가로축: 요일 (월~금)
 * - 세로축: 시간 (9:00 ~ 21:00, 30분 단위)
 * - 각 수업은 Grid의 특정 영역에 배치됨
 */
export const TimeTable: React.FC<TimeTableProps> = ({ courses, activeCourseId }) => {

  // 시간 슬롯 생성
  const timeSlots = generateTimeSlots();

  // 수업별 색상 할당 (같은 course_id는 같은 색, 다른 course_id는 최대한 다른 색)
  const courseColors = assignCourseColors(courses);




  return (
    <div className="w-full">
      {/*
        Grid 컨테이너 설정:
        - gridTemplateColumns:
          - 첫 번째 열(30px): 시간 라벨 표시
          - 나머지 5개 열(1fr씩): 월/화/수/목/금 요일 칸 (동일한 크기로 분할)

        - gridTemplateRows:
          - 첫 번째 행(40px): 요일 헤더
          - 나머지 행들(각 30px): 시간 슬롯 수만큼 반복 (총 25개)
      */}
      <div
        className="grid gap-0"
        style={{
          gridTemplateColumns: '30px repeat(5, 1fr)',
          gridTemplateRows: `40px repeat(${timeSlots.length}, 30px)`,
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

          const isActive = activeCourseId === undefined || course.course_id === activeCourseId;

          return (
            <div
              key={`${course.course_id}-${course.day_of_week}`}
              className={cn(
                `p-2 flex flex-col justify-evenly items-center overflow-hidden`,
                fontStyles.caption,
                !isActive && "opacity-30"
              )}
              style={{
                gridColumn: dayColumn,
                gridRow: `${startRow} / ${endRow}`,
                backgroundColor: color
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