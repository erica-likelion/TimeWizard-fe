import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/planb/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/planb/"!</div>
}
