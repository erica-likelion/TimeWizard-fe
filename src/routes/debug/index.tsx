import { createFileRoute } from '@tanstack/react-router'
import { DebugingPage } from '@/pages/debug/DebugingPage'

export const Route = createFileRoute('/debug/')({
  component: DebugingPage,
})

