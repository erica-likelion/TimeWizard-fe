/* AI 생성 결과 페이지 */

import { createFileRoute, useLocation } from '@tanstack/react-router';
import { GenerateResultPage } from '@/pages/generate/GenerateResultPage';
import type { GeneratedCourse, GenerateTimetableRequest } from '@/apis/AIGenerateAPI/types';

export const Route = createFileRoute('/generate/$gentimetableId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { gentimetableId } = Route.useParams();
  const location = useLocation();
  const stateData = location.state as { courses?: GeneratedCourse[]; ai_comment?: string; requestData?: GenerateTimetableRequest } | undefined;

  return (
    <GenerateResultPage
      gentimetableId={gentimetableId}
      courses={stateData?.courses || []}
      ai_comment={stateData?.ai_comment || ''}
      requestData={stateData?.requestData}
    />
  );
}

