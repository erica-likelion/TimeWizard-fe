import { createFileRoute } from '@tanstack/react-router'
import TimeTable from "@assets/icons/time_table.png";


export const Route = createFileRoute('/main/')({
  component: RouteComponent,
})

function RouteComponent() {
  
  return (
    <div className="flex flex-col gap-6 px-20 pt-31">
      <div className="flex justify-between">
        <div>
          <p className="text-[40px]">안녕하세요 <span className="font-bold">TimeWizard</span>님!</p>
          <p className="text-[40px] text-[#C1446C]">수강신청까지 <span className="font-bold">12일</span> 남았어요</p>
        </div>
        <img
            src={TimeTable}
            alt="시간표 아이콘"
            className="w-[200px]"
        />
      </div>

      <div className="flex gap-[91px]">
        <section className="flex-1 bg-[#303030] p-5">
          <div className="flex justify-between items-center">
            <h3 className="text-[32px] text-[#767676]">나의 정보</h3>
            <button className="bg-[#111] px-[21px] py-[5px] hover:bg-white/5 transition-colors">
              수정 →
            </button>
          </div>
          <div>
            <div className="flex justify-between py-2.5"><span className="text-gray-400">학교</span><span>한양대학교 ERICA캠퍼스</span></div>
            <div className="flex justify-between py-2.5"><span className="text-gray-400">학번</span><span>2023456789</span></div>
            <div className="flex justify-between py-2.5"><span className="text-gray-400">대학 / 학과</span><span>소프트웨어융합대학 컴퓨터학부</span></div>
            <div className="flex justify-between py-2.5"><span className="text-gray-400">학년 / 학기</span><span>3학년 2학기</span></div>
            <div className="flex justify-between py-2.5"><span className="text-gray-400">상태</span><span>재학중</span></div>
          </div>
        </section>

        <aside className="flex-1 bg-[#303030] p-5 text-gray-200">
          <div className="mb-3.5">
            <h3 className="text-lg font-normal m-0">남은 크레딧</h3>
          </div>
          <div>
            <div className="text-[44px] font-bold text-gray-200 mb-2">3,800</div>
            <div className="space-y-2 text-gray-300 mt-3">
              <div className="flex justify-between">
                <span className="text-gray-400 w-[120px]">플랜</span>
                <span>라이트</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 w-[120px]">오늘 사용량</span>
                <span>100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 w-[120px]">최근 7일</span>
                <span>1,200</span>
              </div>
            </div>
            <button className="w-full mt-4 bg-transparent border border-white/5 text-gray-300 px-3 py-2 rounded hover:bg-white/5 transition-colors">
              시간표 페이지로 →
            </button>
          </div>
        </aside>
      </div>
    </div>
  )
}
