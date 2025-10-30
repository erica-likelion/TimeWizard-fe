import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/tuning/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/tuning/"!</div>
}
