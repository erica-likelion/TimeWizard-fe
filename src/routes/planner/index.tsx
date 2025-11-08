import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/planner/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/planner/"!</div>
}
