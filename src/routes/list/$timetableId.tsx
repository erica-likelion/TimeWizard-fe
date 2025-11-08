import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState, useEffect, useMemo } from 'react';
import { fontStyles } from '@/utils/styles';
import { cn } from '@/utils/util';
import { assignCourseColors } from '@/utils/timetable';

import { BasicButton } from '@/components/buttons/BasicButton';
import { TimeTable } from '@/components/TimeTable';
import { CourseItem } from '@/pages/list/CourseItem';
import { mockGetTimeTableDetail } from '@/apis/TimeTableAPI/timeTableApi';
import type { TimeTableDetail } from './types';

export const Route = createFileRoute('/list/$timetableId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { timetableId } = Route.useParams();
  const navigate = useNavigate();
  const [timetable, setTimetable] = useState<TimeTableDetail | null>(null);
  const [activeCourseId, setActiveCourseId] = useState<number | undefined>(1);

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

  const handleCourseItemClick = (course_id: number) => {
    setActiveCourseId(course_id);
  }

  if (!timetable) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className={fontStyles.title}>로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col px-[72px] gap-[22px] pt-[40px] pb-[72px]">
      <div className="flex items-end">
        <p className={fontStyles.title}>#{timetable.timetable_name}</p>
        <BasicButton onClick={() => navigate({to: '/list'})} className={cn("ml-auto h-9 w-40 p-1 mb-[-22px] bg-[#000] text-white", fontStyles.caption)}>← 목록으로</BasicButton>
      </div>
      <div className="flex justify-between gap-[22px] items-start h-[513px]">
        <div className="flex-1 flex flex-col max-w-[500px] h-full px-[18px] pb-[18px] bg-[#303030] overflow-y-auto no-scrollbar">
          <p className={cn("py-[18px] text-[#767676]", fontStyles.subtitle, "sticky top-0 bg-[#303030] z-10")}>
            등록된 강의
          </p>
          <div className="flex flex-col gap-[14px]">
            {timetable.courses.map((course) => (
              <CourseItem
                key={`${course.course_id}-${course.day_of_week}`}
                course={course}
                color={courseColors.get(course.course_id) || '#f97316'}
                isActive={activeCourseId === course.course_id}
                onClick={() => handleCourseItemClick(course.course_id)}
              />
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col h-full p-[18px] pt-0 bg-[#303030] overflow-y-auto no-scrollbar">
          <p className={cn("py-[18px] text-[#767676]", fontStyles.subtitle, "sticky top-0 bg-[#303030] z-10")}>
            시간표
          </p>
          <TimeTable courses={timetable.courses} activeCourseId={activeCourseId}/>
        </div>
      </div>
    </div>
  );
}
