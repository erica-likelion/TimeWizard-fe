/* 시간표 자세히 보기 페이지 */

import { createFileRoute } from '@tanstack/react-router';
import { TimeTableDetailPage } from '@/pages/list/TimeTableDetailPage';

export const Route = createFileRoute('/list/$timetableId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { timetableId } = Route.useParams();

  return <TimeTableDetailPage timetableId={timetableId} />;
}
