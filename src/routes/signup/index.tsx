import { createFileRoute } from '@tanstack/react-router';
import SignupPage from '@/pages/SignUp'; // 위에서 만든 페이지 import

export const Route = createFileRoute('/signup/')({
  component: SignupPage,
});