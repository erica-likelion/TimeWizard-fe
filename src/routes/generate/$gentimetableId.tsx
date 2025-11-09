import { createFileRoute } from '@tanstack/react-router';
import { GenerateResultPage } from '@/pages/generate/GenerateResultPage';

export const Route = createFileRoute('/generate/$gentimetableId')({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      message: (search.message as string) || '',
    }
  },
})

function RouteComponent() {
  const { gentimetableId } = Route.useParams();
  const search = Route.useSearch();

  return <GenerateResultPage gentimetableId={gentimetableId} message={search.message} />;
}
