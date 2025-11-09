import { createFileRoute } from '@tanstack/react-router';
import { TimeTableListPage } from '@/pages/list/TimeTableListPage';

export const Route = createFileRoute('/list/')({
  component: TimeTableListPage,
})
