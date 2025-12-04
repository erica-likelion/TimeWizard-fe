import { useNavigate } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { fontStyles } from '@/utils/styles';
import { cn } from '@/utils/util';

import { PlanButton } from '@/components/buttons/ScheduleList';
import { PinkButton } from '@/components/buttons/PinkButton';
import { BasicButton } from '@/components/buttons/BasicButton';
import { TimeTable } from '@/components/TimeTable';
import { Card } from '@/components/Card';

import { getTimeTables, getTimeTableDetail, deleteTimetable } from '@/apis/TimeTableAPI/timeTableApi';

import type { Course, TimeTable as TimeTableAPI } from '@/apis/TimeTableAPI/types';

// 시간표 목록 페이지
export function TimeTableListPage() {
  // 사용자의 시간표 목록들
  const [timeTables, setTimeTables] = useState<TimeTableAPI[]>([])
  // 현재 선택된 시간표 ID
  const [activeTimeTable, setActiveTimeTable] = useState<string | null>()
  // 선택한 시간표의 강의 목록
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([])
  const navigate = useNavigate();

  /*
    마운트 시 시간표 목록을 불러오고,
    첫 번째 시간표 자동으로 선택하여 시간표 보여줌
  */
  useEffect(() => {
    const fetchTimeTables = async () => {
      try {
        const timeTables = await getTimeTables()
        setTimeTables(timeTables);
        // 첫 번째 시간표가 있으면 자동 선택
        if (timeTables.length > 0) {
          const firstId = timeTables[0].timetableId;
          setActiveTimeTable(firstId);
          handleTimeTableClick(firstId);
        }
      } catch (error) {
        console.error('시간표 목록 조회 실패:', error);
      }
    }

    fetchTimeTables();
  }, [])

  /*
    시간표 클릭 시 강의 목록 조회
    인자 - 조회할 시간표 ID
  */
  const handleTimeTableClick = async (timetableId: string) => {
    try {
      const courses = await getTimeTableDetail(timetableId);
      setSelectedCourses(courses);
      setActiveTimeTable(timetableId);
      console.log(courses);
    } catch (error) {
      console.error('시간표 강의 목록 조회 실패:', error);
    }
  }

  /*
    시간표 삭제 클릭 시 삭제
  */
  const handleDeleteTimetable = async () => {
    const confirmed = window.confirm("정말 이 시간표를 삭제하시겠습니까?");
    if (!confirmed){return}

    try {
      if(activeTimeTable){
        await deleteTimetable(activeTimeTable);
        alert('시간표가 삭제되었습니다!');

        const remainTimeTables = timeTables.filter((table) =>
          table.timetableId !== activeTimeTable);

        if (remainTimeTables.length > 0) {
          const firstId = remainTimeTables[0].timetableId;
          handleTimeTableClick(firstId); 
        } else {
          setActiveTimeTable("");
          setSelectedCourses([]);
        }
        setTimeTables(remainTimeTables);
      }
    } catch (error) {
      console.error('시간표 삭제 실패:', error);
      alert('시간표 삭제에 실패했습니다. 다시 시도해주세요.');
    } finally {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="flex flex-col gap-5 flex-1">
      {/* 페이지 제목 */}

      <div className="flex justify-between items-center min-h-10">
        <h1 className={cn("text-white", fontStyles.title)}>시간표 목록</h1>
      </div>

      <div className="flex flex-col gap-10 lg:flex-row justify-between flex-1">
        <div className="w-full lg:flex-4 lg:w-auto flex flex-col gap-5">
          <Card title="생성된 시간표" className="w-full lg:w-auto lg:h-[calc(80dvh-200px)]">
            {/* 시간표들 */}
            <div className="flex flex-col gap-[22px] mb-5">
              {timeTables.map((timetable) => (
                <PlanButton
                  key={timetable.timetableId}
                  title={"#" + timetable.name}
                  onClick={() => handleTimeTableClick(timetable.timetableId)}
                  isActive={activeTimeTable === timetable.timetableId}
                />
              ))}
            </div>
            {/* 새 시간표 추가 버튼 */}
            <div className="self-end mt-auto">
              <BasicButton onClick={() => {navigate({to: '/generate'})}} className="min-w-60">+ 새 시간표 추가</BasicButton>
            </div>
          </Card>
        </div>

        {/* [오른쪽 카드] 선택된 시간표 및 버튼 */}
        <div className="w-full lg:flex-6 lg:w-auto flex flex-col gap-5">
          <Card title="선택된 시간표" className="w-full lg:w-auto lg:h-[calc(80dvh-200px)]">
            {/* 시간표 */}
            <div className="flex flex-col overflow-y-auto no-scrollbar lg:h-full">
              {selectedCourses.length > 0 && <TimeTable courses={selectedCourses} />}
            </div>
          </Card>
          
          {/* 시간표 관련 버튼들 */}
          <Card className="w-full lg:w-auto gap-3 lg:h-auto flex flex-col justify-center">
              {/* 삭제, 튜닝, 자세히보기 */}
              <div className="flex justify-evenly gap-5">
                <BasicButton variant="danger" onClick={() => handleDeleteTimetable()} className="flex-1" disabled={!activeTimeTable}>삭제</BasicButton>
                <BasicButton onClick={() => {}} className="flex-1" disabled={!activeTimeTable}>튜닝</BasicButton>
                <BasicButton
                  onClick={() => {
                    const selectedTimeTable = timeTables.find(t => t.timetableId === activeTimeTable);
                    navigate({
                      to: '/list/$timetableId',
                      params: {timetableId: String(activeTimeTable)},
                      state: {
                        courses: selectedCourses as Course[],
                        name: selectedTimeTable?.name
                      } as any
                    });
                  }}
                  disabled={!activeTimeTable}
                  className="flex-2">
                    자세히보기
                </BasicButton>
              </div>

              {/* 플래너 짜기 버튼 */}
              <PinkButton
                width='full'
                size='lg'
                onClick={() => {
                  if (activeTimeTable) {
                    navigate({
                      to: '/planner',
                      search: { timetableId: activeTimeTable }
                    });
                  }
                }}
                className={cn(fontStyles.button)}
                disabled={!activeTimeTable}>
                  플래너 짜기
              </PinkButton>
          </Card>
        </div>
        
      </div>
    </div>
  )
}
