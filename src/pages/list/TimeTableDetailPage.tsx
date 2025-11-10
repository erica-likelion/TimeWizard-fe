import { useNavigate } from '@tanstack/react-router';
import { useState, useEffect, useMemo } from 'react';
import { fontStyles } from '@/utils/styles';
import { cn } from '@/utils/util';
import { assignCourseColors } from '@/utils/timetable';

import { BasicButton } from '@/components/buttons/BasicButton';
import { TimeTable } from '@/components/TimeTable';
import { CourseItem } from '@/pages/list/CourseItem';
import { Card } from '@/components/Card';
import { mockGetTimeTableDetail } from '@/apis/TimeTableAPI/timeTableApi';
import type { TimeTableDetail } from './types';

interface TimeTableDetailPageProps {
  timetableId: string;
}

// 시간표 상세보기 페이지
export function TimeTableDetailPage({ timetableId }: TimeTableDetailPageProps) {
  const navigate = useNavigate();
  // 조회한 시간표 상세 정보
  const [timetable, setTimetable] = useState<TimeTableDetail | null>(null);
  // 현재 선택된(하이라이팅된) 강의 ID
  const [activeCourseId, setActiveCourseId] = useState<number | undefined>(1);

  /*
    마운트 시 URL 파라미터의 timetableId로
    해당 시간표 상세 정보 조회
  */
  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const response = await mockGetTimeTableDetail(Number(timetableId));
        if (response.success) {
          setTimetable(response.data);
        }
      } catch (error) {
        console.error('시간표 상세 조회 실패:', error);
      }
    };

    fetchTimetable();
  }, [timetableId]);

  // 강의별 색상 할당 (같은 course_id는 같은 색, 다른 course_id는 최대한 다른 색)
  const courseColors = useMemo(() => {
    if (!timetable) return new Map<number, string>();
    return assignCourseColors(timetable.courses);
  }, [timetable]);

  /*
    강의 호버 시 해당 강의를 활성화(하이라이팅)
    인자 - 호버한 강의 ID
  */
  const handleCourseItemHover = (course_id: number) => {
    setActiveCourseId(course_id);
  }

  // 시간표 로딩 중일 때 표시
  if (!timetable) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className={fontStyles.title}>로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col px-18 gap-5 py-10 flex-1">
      {/* [위] 시간표 이름 + 목록으로 돌아가기 버튼 */}
      <div className="flex items-end">
        <p className={fontStyles.title}>#{timetable.timetable_name}</p>
        <BasicButton onClick={() => navigate({to: '/list'})} className={cn("ml-auto px-5 py-1 bg-[#000]", fontStyles.caption)}>← 목록으로</BasicButton>
      </div>

      <div className="flex flex-col gap-10 lg:flex-row justify-between flex-1">
        {/* [왼쪽] 등록된 강의 목록 */}
        <div className="w-full lg:flex-4 lg:w-auto">
          <Card title="등록된 강의" className="w-full lg:w-auto lg:h-[90%]">
            {/* 강의들 (호버하면 시간표에서 하이라이팅됨) */}
            <div className="flex flex-col gap-[14px]">
              {timetable.courses.map((course) => (
                <CourseItem
                  key={`${course.course_id}-${course.day_of_week}`}
                  course={course}
                  color={courseColors.get(course.course_id) || '#f97316'}
                  isActive={activeCourseId === course.course_id}
                  onMouseEnter={() => handleCourseItemHover(course.course_id)}
                />
              ))}
            </div>
          </Card>
        </div>

        {/* [오른쪽] 시간표 */}
        <div className="w-full lg:flex-6 lg:w-auto">
          <Card title="시간표" className="w-full lg:w-auto lg:h-[90%]">
            <div className="w-full overflow-y-auto no-scrollbar lg:h-full">
              {timetable && <TimeTable courses={timetable.courses} activeCourseId={activeCourseId}/>}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
