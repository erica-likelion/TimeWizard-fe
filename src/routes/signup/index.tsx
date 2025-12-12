import { createFileRoute } from '@tanstack/react-router';
import { redirectIfLoggedIn } from '@/utils/authCheck';
import SignupPage from '@/pages/SignUp'; 

export const Route = createFileRoute('/signup/')({
  beforeLoad: redirectIfLoggedIn,
  component: SignupPage,
});