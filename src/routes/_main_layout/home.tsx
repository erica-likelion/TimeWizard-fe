import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_main_layout/home')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex flex-col gap-6 px-20 pt-31">
      <p className="text-[40px]">안녕하세요 <span className="font-bold">TimeWizard</span>님!</p>
      <p className="text-[40px] text-[#C1446C]">수강신청까지 <span className="font-bold">12일</span> 남았어요</p>
    </div>
  )
}
