import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_main_layout/gen')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">생성 페이지</h1>
    </div>
  )
}
