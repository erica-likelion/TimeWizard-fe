import { useNavigate, useLocation } from '@tanstack/react-router';
import { useState, useEffect, useMemo } from 'react';
import { fontStyles } from '@/utils/styles';
import { cn } from '@/utils/util';
import { assignCourseColors } from '@/utils/timetable';

import { BasicButton } from '@/components/buttons/BasicButton';
import { TimeTable } from '@/components/TimeTable';
import { CourseItem } from '@/pages/list/CourseItem';
import { Card } from '@/components/Card';
import { getTimeTableDetail } from '@/apis/TimeTableAPI/timeTableApi';
import type { Course } from '@/apis/TimeTableAPI/types';

interface TimeTableDetailPageProps {
  timetableId: string;
}

// 시간표 상세보기 페이지
export function TimeTableDetailPage({ timetableId }: TimeTableDetailPageProps) {
  const navigate = useNavigate();
  const location = useLocation();

  // ListPage에서 넘어온 state (courses, name)
  const stateData = location.state as { courses?: Course[], name?: string } | undefined;

  // 조회한 시간표의 강의 목록
  const [courses, setCourses] = useState<Course[]>(stateData?.courses || []);
  // 시간표 이름
  const [timetableName, _setTimetableName] = useState<string>(stateData?.name || '');
  // 현재 선택된(하이라이팅된) 강의 ID
  const [activeCourseId, setActiveCourseId] = useState<number | undefined>(1);

  /*
    마운트 시 state가 없는 경우에만 API 호출
    (직접 URL 접근 등의 경우를 위한 fallback)
  */
  useEffect(() => {
    // state로 데이터를 받았으면 API 호출 스킵
    if (stateData?.courses && stateData?.courses.length > 0) {
      return;
    }

    // state가 없으면 API 호출
    const fetchCourses = async () => {
      try {
        const coursesData = await getTimeTableDetail(timetableId);
        setCourses(coursesData);
      } catch (error) {
        console.error('시간표 강의 목록 조회 실패:', error);
      }
    };

    fetchCourses();
  }, [timetableId, stateData]);

  // 강의별 색상 할당 (같은 course_id는 같은 색, 다른 course_id는 최대한 다른 색)
  const courseColors = useMemo(() => {
    return assignCourseColors(courses);
  }, [courses]);

  /*
    강의 호버 시 해당 강의를 활성화(하이라이팅)
    인자 - 호버한 강의 ID
  */
  const handleCourseItemHover = (courseId: number) => {
    setActiveCourseId(courseId);
  }

  return (
    <div className="flex flex-col gap-5 flex-1">
      {/* [위] 시간표 이름 + 목록으로 돌아가기 버튼 */}

      <div className="flex justify-between items-center min-h-10">
        <h1 className={cn("text-white", fontStyles.title)}>{timetableName ? `#${timetableName}` : `시간표 #${timetableId}`}</h1>
        <BasicButton onClick={() => navigate({to: '/list'})} className={cn("ml-auto px-5 py-1 bg-[#000]", fontStyles.caption)}>← 목록으로</BasicButton>
      </div>

      <div className="flex flex-col gap-10 lg:flex-row justify-between flex-1">
        {/* [왼쪽] 등록된 강의 목록 */}
        <div className="w-full lg:flex-4 lg:w-auto">
          <Card title="등록된 강의" className="w-full lg:w-auto lg:h-[calc(100dvh-200px)]">
            {/* 강의들 (호버하면 시간표에서 하이라이팅됨) */}
            <div className="flex flex-col gap-[14px]">
              {courses.map((course) => (
                <CourseItem
                  key={course.courseId}
                  course={course}
                  color={courseColors.get(course.courseId) || '#f97316'}
                  isActive={activeCourseId === course.courseId}
                  onMouseEnter={() => handleCourseItemHover(course.courseId)}
                />
              ))}
            </div>
          </Card>
        </div>

        {/* [오른쪽] 시간표 */}
        <div className="w-full lg:flex-6 lg:w-auto">
          <Card title="시간표" className="w-full lg:w-auto lg:h-[calc(100dvh-200px)]">
            <div className="w-full overflow-y-auto no-scrollbar lg:h-full">
              {courses.length > 0 && <TimeTable courses={courses} activeCourseId={activeCourseId}/>}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
