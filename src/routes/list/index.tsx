import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { fontStyles } from '@/utils/styles'
import { cn } from '@/utils/util'

import { PlanButtonLink } from '@/components/buttons/schedule-List'
import { BasicButton } from '@/components/buttons/BasicButton'
import { TimeTable } from '@/components/timetable'
import { mockGetTimeTables, mockGetTimeTableDetail } from '@/apis/TimeTableAPI/timeTableApi'
import type { TimeTableItem, TimeTableDetail } from './types'

export const Route = createFileRoute('/list/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [timeTables, setTimeTables] = useState<TimeTableItem[]>([])
  const [selectedTimeTable, setSelectedTimeTable] = useState<TimeTableDetail | null>(null)

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
  }, [])

  const handleTimeTableClick = async (timetableId: number) => {
    try {
      const response = await mockGetTimeTableDetail(timetableId)
      if (response.success) {
        setSelectedTimeTable(response.data)
      }
    } catch (error) {
      console.error('시간표 상세 조회 실패:', error)
    }
  }

  return (
    <div className="flex flex-col px-20 gap-6 pt-11 pb-20 no-scrollbar">
      <p className={fontStyles.title}> 시간표 목록 </p>
      <div className="flex justify-evenly gap-6 items-center h-[570px] ">
        <div className="flex flex-col w-[684px] h-full pl-5 pr-10.5 pb-5 bg-[#303030] overflow-y-auto">
          <p className={cn("pt-5 text-[#767676]", fontStyles.subtitle, "sticky top-0 bg-[#303030] z-10 pb-4")}> 생성된 시간표 </p>
          <div className="flex flex-col gap-6">
            {timeTables.map((timetable) => (
              <PlanButtonLink
                key={timetable.timetable_id}
                title={"#" + timetable.timetable_name}
                date={timetable.created_at}
                onClick={() => handleTimeTableClick(timetable.timetable_id)}
              />
            ))}
          </div>
          <div className="mt-auto self-end pt-6">
            <BasicButton onClick={() => {}}>+ 새 시간표 추가</BasicButton>
          </div>
        </div>
        <div className="flex w-[50px] justify-center">
          <p className={cn(fontStyles.subtitle, "font-bold")}>--&gt;</p>
        </div>
        <div className="flex flex-col w-[617px] h-full p-5 pt-0 bg-[#303030] overflow-y-auto no-scrollbar">
          <p className={cn("pt-5 text-[#767676]", fontStyles.subtitle, "sticky top-0 bg-[#303030] z-10 pb-4")}> 선택된 시간표 </p>
          {selectedTimeTable && <TimeTable courses={selectedTimeTable.courses} />}
        </div>
      </div>
      <div>

      </div>
    </div>
  )
}
