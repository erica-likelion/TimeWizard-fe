import { useNavigate } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { fontStyles } from '@/utils/styles';
import { cn } from '@/utils/util';

import { PlanButton } from '@/components/buttons/ScheduleList';
import { PinkButton } from '@/components/buttons/PinkButton';
import { BasicButton } from '@/components/buttons/BasicButton';
import { TimeTable } from '@/components/TimeTable';
import { Card } from '@/components/Card';

import { mockGetTimeTables, mockGetTimeTableDetail } from '@/apis/TimeTableAPI/timeTableApi';
import type { TimeTableItem, TimeTableDetail } from './types';

// 시간표 목록 페이지
export function TimeTableListPage() {
  // 사용자의 시간표 목록들
  const [timeTables, setTimeTables] = useState<TimeTableItem[]>([])
  // 현재 선택된 시간표 ID
  const [activeTimeTable, setActiveTimeTable] = useState<number | null>(1)
  // 선택한 시간표의 상세 정보
  const [selectedTimeTableDetail, setSelectedTimeTableDetail] = useState<TimeTableDetail | null>(null)
  const navigate = useNavigate();

  /*
    마운트 시 시간표 목록을 불러오고,
    첫 번째 시간표 자동으로 선택하여 시간표 보여줌
  */
  useEffect(() => {
    const fetchTimeTables = async () => {
      try {
        const response = await mockGetTimeTables()
        setTimeTables(response.data.timetables)
      } catch (error) {
        console.error('시간표 목록 조회 실패:', error)
      }
    }

    fetchTimeTables()
    handleTimeTableClick(Number(activeTimeTable))
  }, [])

  /*
    시간표 클릭 시 상세 정보 조회
    인자 - 조회할 시간표 ID
  */
  const handleTimeTableClick = async (timetableId: number) => {
    try {
      const response = await mockGetTimeTableDetail(timetableId)
      if (response.success) {
        setSelectedTimeTableDetail(response.data)
        setActiveTimeTable(timetableId)
      }
    } catch (error) {
      console.error('시간표 상세 조회 실패:', error)
    }
  }

  return (
    <div className="flex flex-col px-18 gap-5 py-10 flex-1">
      {/* 페이지 제목 */}
      <p className={cn("min-w-full", fontStyles.title)}> 시간표 목록 </p>

      <div className="flex flex-col gap-10 lg:flex-row justify-between flex-1">
        <div className="w-full lg:flex-4 lg:w-auto flex flex-col gap-5">
          <Card title="생성된 시간표" className="w-full lg:w-auto lg:h-[70%]">
            {/* 시간표들 */}
            <div className="flex flex-col gap-[22px] mb-5">
              {timeTables.map((timetable) => (
                <PlanButton
                  key={timetable.timetable_id}
                  title={"#" + timetable.timetable_name}
                  date={timetable.created_at}
                  onClick={() => handleTimeTableClick(timetable.timetable_id)}
                  isActive={activeTimeTable === timetable.timetable_id}
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
          <Card title="선택된 시간표" className="w-full lg:w-auto lg:h-[70%]">
            {/* 시간표 */}
            <div className="flex flex-col overflow-y-auto no-scrollbar lg:h-full">
              {selectedTimeTableDetail && <TimeTable courses={selectedTimeTableDetail.courses} />}
            </div>
          </Card>
          
          {/* 시간표 관련 버튼들 */}
          <Card className="w-full lg:w-auto gap-3">
              {/* 삭제, 튜닝, 자세히보기 */}
              <div className="flex justify-evenly gap-5">
                <BasicButton variant="danger" onClick={() => {}} className="flex-1">삭제</BasicButton>
                <BasicButton onClick={() => {}} className="flex-1">튜닝</BasicButton>
                <BasicButton onClick={() => navigate({to: '/list/$timetableId', params: {timetableId: String(activeTimeTable)}})} className="flex-2">
                    자세히보기
                </BasicButton>
              </div>

              {/* 플래너 짜기 버튼 */}
              <PinkButton
                width='full'
                size='lg'
                onClick={() => {}}
                className={cn(fontStyles.button)}>
                  플래너 짜기
              </PinkButton>
          </Card>
        </div>
        
      </div>
    </div>
  )
}
