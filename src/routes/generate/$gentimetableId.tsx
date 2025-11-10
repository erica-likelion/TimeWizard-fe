/* AI 생성 결과 페이지 */

import { createFileRoute, useLocation } from '@tanstack/react-router';
import { GenerateResultPage } from '@/pages/generate/GenerateResultPage';

export const Route = createFileRoute('/generate/$gentimetableId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { gentimetableId } = Route.useParams();
  const location = useLocation();

  // state로부터 message 읽기 (URL 노출 방지)
  const message = (location.state as { message?: string })?.message || '';

  return <GenerateResultPage gentimetableId={gentimetableId} message={message} />;
}

