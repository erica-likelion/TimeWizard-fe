import { createFileRoute } from '@tanstack/react-router'
import TimeTable from "@assets/icons/time_table.svg";


export const Route = createFileRoute('/main/')({
  component: RouteComponent,
})

function RouteComponent() {
  
  return (
    <div className="flex flex-col gap-6 px-20 pt-31 justify-between">
      <div className="flex">
        <div>
          <p className="text-[40px]">안녕하세요 <span className="font-bold">TimeWizard</span>님!</p>
          <p className="text-[40px] text-[#090809]">수강신청까지 <span className="font-bold">12일</span> 남았어요</p>
        </div>
        <img
            src={TimeTable}
            alt="시간표 아이콘"
            className="w-[200px]"
        />
      </div>
    </div>
  )
}
