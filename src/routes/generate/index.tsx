import { createFileRoute } from '@tanstack/react-router'
import { GeneratePage } from '@/pages/generate/GeneratePage'

export const Route = createFileRoute('/generate/')({
  component: GeneratePage,
})
