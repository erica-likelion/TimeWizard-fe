import React, { useMemo } from 'react';

import { cn } from '@/utils/util';
import { fontStyles } from '@/utils/styles';
import {
  DAYS_EN,
  convertDaysToKorean,
  assignCourseColors,
  getDayColumn,
  getTimeRow,
  generateTimeSlots,
  mergeConsecutiveCourseTimes
} from '@/utils/timetable';
import type { TimeTableProps } from './types'
import type { Course } from '@/apis/TimeTableAPI/types';

/*
  그리드 레이아웃을 사용하여 시간표를 렌더링
  - 가로축: 요일 (월~금, 토요일/일요일 강의가 있으면 동적으로 확장)
  - 세로축: 시간 (9:00 ~ 21:00, 30분 단위)
  - 각 수업은 Grid의 특정 영역에 배치됨
 */
export const TimeTable: React.FC<TimeTableProps> = ({ courses, activeCourseId }) => {
  // 연속 된 시간 강의의 경우 합치기
  const modifyCourses = mergeConsecutiveCourseTimes(courses);
  // 시간 슬롯 생성
  const timeSlots = generateTimeSlots(modifyCourses);
  // 수업별 색상 할당 (같은 course_id는 같은 색, 다른 course_id는 최대한 다른 색)
  const courseColors = assignCourseColors(modifyCourses);

  // 표시할 요일 결정 및 강의 필터링
  const { visibleDays, gridCourses, noTimeCourses } = useMemo(() => {
    let hasSaturday = false;
    let hasSunday = false;

    const grid: Course[] = [];
    const noTime: Course[] = [];

    modifyCourses.forEach((course) => {
      // 시간이 지정 강의 확인
      const hasScheduledTime = course.courseTimes.some((courseTime) => {
        const dayUpper = courseTime.dayOfWeek?.toUpperCase();

        if (dayUpper === 'SAT' && courseTime.startTime > 0) hasSaturday = true;
        if (dayUpper === 'SUN' && courseTime.startTime > 0) hasSunday = true;

        return courseTime.startTime > 0;
      });

      // 시간 미지정 강의 확인
      const hasNoTime = course.courseTimes.some((courseTime) => {
        return courseTime.startTime === 0;
      });

      if (hasNoTime) {
        noTime.push(course);
      } else if (hasScheduledTime) {
        grid.push(course);
      } else {
        noTime.push(course);
      }
    });

    // 표시할 요일 배열 생성 (영문만)
    const days = [...DAYS_EN];

    // 일요일 강의가 있으면 토요일과 일요일 모두 추가
    if (hasSunday) {
      days.push('SAT', 'SUN');
    }
    // 토요일 강의만 있으면 토요일만 추가
    else if (hasSaturday) {
      days.push('SAT');
    }

    return {
      visibleDays: days,
      gridCourses: grid,
      noTimeCourses: noTime
    };
  }, [modifyCourses]);

  const visibleDaysKr = convertDaysToKorean(visibleDays);

  return (
    <div className="w-full h-full">
      {/*
        Grid 컨테이너 설정:
        - gridTemplateColumns:
          - 첫 번째 열(30px): 시간 라벨 표시
          - 나머지 열들(1fr씩): 표시할 요일 칸 (동적으로 조정)

        - gridTemplateRows:
          - 첫 번째 행(40px): 요일 헤더
          - 나머지 행들(각 1fr): 시간 슬롯 수만큼 반복 (총 25개)
      */}
      <div
        className="grid gap-0"
        style={{
          gridTemplateColumns: `30px repeat(${visibleDays.length}, 1fr)`,
          gridTemplateRows: `40px repeat(${timeSlots.length}, 1dvh)`,
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

        {/* 요일 헤더 (동적으로 생성) - 명시적 배치 */}
        {visibleDaysKr.map((day, index) => (
          <div
            key={day}
            className={cn("flex items-center justify-center font-bold border-b-2 border-[#BBB]",
              fontStyles.caption,
              index % 2 === 0 ? "bg-[#3f3f3f]" : "bg-[#383838]")
            }
            style={{
                gridColumn: index + 2,  // 2, 3, 4, 5, 6, 7, 8열 (동적)
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
          - 빈 셀들: 동적으로 생성 (표시할 요일 수만큼)
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
              {time.includes(':') ? "" : time}
            </div>

            {/* 각 요일별 빈 셀 (동적으로 생성)*/}
            {visibleDaysKr.map((day, dayIndex) => {
              // 짝수 인덱스: #3f3f3f, 홀수 인덱스: #383838
              const bgColor = dayIndex % 2 === 0
                ? 'bg-[#3f3f3f]'
                : 'bg-[#383838]';

              return (
                <div
                  key={`${day}-${time}`}
                  className={cn(bgColor)}
                  style={{
                    gridColumn: dayIndex + 2,   // 2열부터 시작 (동적)
                    gridRow: timeIndex + 2,     // 2행부터 시작
                  }}
                >
                </div>
              );
            })}
          </React.Fragment>
        ))}

        {/* 시간이 지정된 강의를 그리드에 렌더링 (평일 + 시간 있는 주말 강의) */}
        {gridCourses.map((course) => {
          const color = courseColors.get(course.courseId);       // 수업별 색상
          const isActive = activeCourseId === undefined || course.courseId === activeCourseId;

          // 각 강의의 여러 시간대를 모두 렌더링
          return course.courseTimes.map((courseTime, index) => {
            const dayColumn = getDayColumn(courseTime.dayOfWeek, visibleDays);     // 요일 → 열 번호 (동적)
            const startRow = getTimeRow(courseTime.startTime);         // 시작 시간 → 시작 행
            const endRow = getTimeRow(courseTime.endTime);             // 종료 시간 → 종료 행

            // active 바뀔때 0.3초 투명도 트랜지션 효과 꼭 추가!!!!
            return (
              <div
                key={`${course.courseId}-${courseTime.dayOfWeek}-${index}`}
                className={cn(
                  `p-2 flex flex-col overflow-scroll transition-opacity duration-300 no-scollbar`,
                  fontStyles.caption,
                  !isActive && "opacity-30"
                )}
                style={{
                  gridColumn: dayColumn,
                  gridRow: `${startRow} / ${endRow}`,
                  backgroundColor: color,
                }}
              >
                {/* 수업 이름 */}
                <p className="text-lg leading-none w-full mb-1">{course.courseName}</p>
                {/* 교수명 */}
                <p className="font-bold w-full mb-1">{course.professor}</p>
                {/* 강의실 위치 */}
                {courseTime.classroom && (
                  <p className="w-full">{courseTime.classroom}</p>
                )}
              </div>
            );
          });
        })}
      </div>

      {/* 시간 미지정 강의 섹션 */}
      {noTimeCourses.length > 0 && (
        <div className="mt-6 flex flex-col gap-3">
          <p className={cn(fontStyles.subtitle, "text-[#888]")}>시간 미지정 강의</p>
          <div className="flex flex-col gap-2">
            {noTimeCourses.map((course) => {
              const color = courseColors.get(course.courseId);
              const isActive = activeCourseId === undefined || course.courseId === activeCourseId;

              return (
                <div
                  key={course.courseId}
                  className={cn(
                    "p-4 flex flex-col gap-2",
                    !isActive && "opacity-30"
                  )}
                  style={{ backgroundColor: color }}
                >
                  <div className="flex items-center justify-between">
                    <p className={cn(fontStyles.body, "font-bold")}>{course.courseName}</p>
                    <p className={cn(fontStyles.caption, "font-bold")}>{course.professor}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};