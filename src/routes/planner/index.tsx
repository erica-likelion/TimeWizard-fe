import { createFileRoute } from '@tanstack/react-router'
import { PlannerPage } from '@/pages/planner/PlannerPage';

export const Route = createFileRoute('/planner/')({
  validateSearch: (search: Record<string, unknown>) => ({
    timetableId: (search.timetableId as string) || undefined,
  }),
  component: PlannerPage,
})
