import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/generate/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/generate/"!</div>
}
