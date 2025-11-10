import { useNavigate } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { fontStyles } from '@/utils/styles';
import { cn } from '@/utils/util';

import { PlanButton } from '@/components/buttons/ScheduleList';
import { PinkButton } from '@/components/buttons/PinkButton';
import { BasicButton } from '@/components/buttons/BasicButton';
import { TimeTable } from '@/components/TimeTable';
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
    <div className="flex flex-col px-[72px] gap-[22px] pt-[40px] pb-[72px]">
      {/* 페이지 제목 */}
      <p className={cn("min-w-full", fontStyles.title)}> 시간표 목록 </p>

      <div className="flex justify-between h-full">
        {/* [왼쪽] 사용자 시간표 리스트 영역 */}
        <div className="flex-3 flex flex-col h-[513px] min-w-[350px] px-[18px] pb-[18px] bg-[#303030] no-scrollbar overflow-y-auto">
          <p className={cn("py-[18px] text-[#767676]", fontStyles.subtitle, "sticky top-0 bg-[#303030] z-10")}> 생성된 시간표 </p>

          {/* 시간표들 */}
          <div className="flex flex-col gap-[22px]">
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
          <div className="mt-auto self-end pt-[22px]">
            <BasicButton onClick={() => {navigate({to: '/generate'})}} className="min-w-60">+ 새 시간표 추가</BasicButton>
          </div>
        </div>

        {/* [가운데] 화살표 */}
        <div className="flex-1 flex w-[45px] justify-center">
          <p className={cn(fontStyles.subtitle, "font-bold my-auto whitespace-nowrap")}>--&gt;</p>
        </div>

        {/* [오른쪽] 선택한 시간표 상세 영역 */}
        <div className="flex-3 flex flex-col min-w-[350px] gap-8">
          {/* 시간표 */}
          <div className="flex flex-col h-[513px] p-[18px] pt-0 bg-[#303030] overflow-y-auto no-scrollbar">
            <p className={cn("py-[18px] text-[#767676]", fontStyles.subtitle, "sticky top-0 bg-[#303030] z-10")}> 선택된 시간표 </p>
            {selectedTimeTableDetail && <TimeTable courses={selectedTimeTableDetail.courses} />}
          </div>

          {/* 시간표 관련 버튼들 */}
          <div className="flex flex-col p-[14px] gap-[14px] bg-[#303030]">
            {/* 삭제, 튜닝, 자세히보기 */}
            <div className="flex justify-evenly gap-[29px]">
              <BasicButton variant="danger" onClick={() => {}} className="flex-1">삭제</BasicButton>
              <BasicButton onClick={() => {}} className="flex-1">튜닝</BasicButton>
              <BasicButton onClick={() => navigate({to: '/list/$timetableId', params: {timetableId: String(activeTimeTable)}})} className="flex-1">
                  자세히보기
              </BasicButton>
            </div>

            {/* 이 시간표로 플래너 짜기 버튼 */}
            <PinkButton
              width='full'
              size='sm'
              onClick={() => {}}
              className={cn(fontStyles.button)}>
                이 시간표로 플래너 짜기
            </PinkButton>
          </div>
        </div>
      </div>
    </div>
  )
}
