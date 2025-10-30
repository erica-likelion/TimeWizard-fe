import { createFileRoute } from '@tanstack/react-router'
import MainLayout from '@layouts/MainLayout'

export const Route = createFileRoute('/_main_layout')({
  component: LayoutComponent,
})

function LayoutComponent() {
  return <MainLayout />
}
