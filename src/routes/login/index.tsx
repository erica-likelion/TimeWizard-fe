import { createFileRoute } from '@tanstack/react-router';
import { redirectIfLoggedIn } from '@/utils/authCheck';
import LoginPage from '@/pages/login'; 

export const Route = createFileRoute('/login/')({
  beforeLoad: redirectIfLoggedIn,
  component: LoginPage,
});