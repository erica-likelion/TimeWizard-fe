import { createFileRoute } from '@tanstack/react-router';
import LoginPage from '@/pages/login'; // 위에서 만든 페이지 import

export const Route = createFileRoute('/login/')({
  component: LoginPage,
});