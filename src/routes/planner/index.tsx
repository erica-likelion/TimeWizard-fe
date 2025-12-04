import { createFileRoute } from '@tanstack/react-router'
import { PlannerPage } from '@/pages/planner/PlannerPage';

export const Route = createFileRoute('/planner/')({
  component: PlannerPage,
})
