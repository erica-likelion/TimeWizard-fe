import { createFileRoute } from '@tanstack/react-router'
import { MainPage } from '@/pages/main/MainPage'

export const Route = createFileRoute('/main/')({
  component: MainPage,
})
