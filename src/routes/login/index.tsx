import { useState, useEffect } from 'react';
import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';
import { TextInput } from '@/components/boxes/InputBox';
import { PinkButton } from '@/components/buttons/PinkButton';
import LoginBgImage from '@assets/images/login.png'; 
import LogoSvg from '@assets/icons/time_table.png'; 
import TitleSvg from '@assets/icons/billnut_col.svg'; 
import { cn } from '@/utils/util';
import { fontStyles } from '@/utils/styles';
import { loginUser } from '@/apis/Auth/authService'; 
import axios from 'axios'; 
import { useUser } from '@/contexts/UserContext'; 

export const Route = createFileRoute('/login/')({

  component: LoginPage,
});

// 2. 로그인 페이지 컴포넌트
function LoginPage() {
  // 3. 폼 상태 관리
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 4. 라우터 네비게이션
  const navigate = useNavigate();

  // 5. Context에서 로그인 상태와 로딩 상태를 가져옵니다.
  const { login, isAuthenticated, loading: authLoading } = useUser();

  // 6. 로그인 상태 감지 및 리디렉션
  useEffect(() => {
    // Context가 유저 정보 로딩 중이면 대기
    if (authLoading) return;

    // 로딩이 끝났는데, 이미 로그인된 상태라면
    if (isAuthenticated) {
      alert("이미 로그인되어 있습니다."); // 1. Alert 띄우기
      navigate({ to: '/main', replace: true }); // 2. /main으로 이동
    }
  }, [isAuthenticated, authLoading, navigate]); // 상태 변경 시마다 검사

  // 7. 폼 제출 핸들러 (API 연동)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // 1. authService.ts의 loginUser 함수 호출
      const accessToken = await loginUser(email, password);

      // 2. Context의 login 함수 호출 (토큰 저장 + 유저 정보 조회)
      await login(accessToken);
      
      navigate({ to: '/main' }); // 메인 페이지로 이동

    } catch (error: any) {
      // 3. 에러 핸들링
      console.error('로그인 실패:', error);
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.message || '로그인에 실패했습니다.');
      } else {
        setError(error.message || '로그인 중 알 수 없는 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };


  // 8. 렌더링 
  return (
    <div className="relative min-h-screen w-full">
      
      {/* 6-1. 왼쪽 섹션: 로고 (회색 벽) - fixed로 고정 */}
      <div className="
        hidden md:flex md:w-1/3 lg:w-1/4 
        fixed left-0 top-0 h-screen
        items-center justify-center 
        bg-[#2C2C2C] p-8
      ">
        <img 
          src={LogoSvg}
          alt="로고" 
          className="w-full max-w-[150px]"
        />
      </div>

      {/* 6-2. 오른쪽 섹션: 폼 + 배경 이미지 - 왼쪽 여백 추가 */}
      <div 
        style={{
          backgroundImage: `url(${LoginBgImage})`, 
        }}
        className="
          flex w-full md:w-2/3 lg:w-3/4 
          md:ml-[33.333333%] lg:ml-[25%]
          min-h-screen
          items-center justify-center md:justify-start 
          p-8 md:p-16 lg:p-24 
          bg-[#1A1A1A] 
          bg-cover bg-center bg-no-repeat
        "
      >
        {/* 폼 컨테이너 */}
        <div className="w-full max-w-md"> 
          <div className="flex items-center gap-x-2 mb-3">
            <img 
              src={TitleSvg} 
              alt="빌넣 로고" 
              className="w-20 h-auto ms-[-6px]" 
            />
            <span className="font-galmuri text-3xl text-white">로그인</span>
          </div>
          <p className={cn(fontStyles.bodySmall, "mb-2 text-gray-400")}>
            시간마법사는 당신의 올클을 기원합니다.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <TextInput
                size="md"
                placeholder="아이디 (이메일)"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            <div>
              <TextInput
                size="md"
                placeholder="비밀번호"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            {error && (
              <div className="pt-1 text-center text-sm text-red-500">
                {error}
              </div>
            )}
            <div>
              <PinkButton
                type="submit"
                size="md"
                width="full"
                disabled={isLoading}
              >
                {isLoading ? '로그인 중...' : '로그인!'}
              </PinkButton>
            </div>
          </form>
          <div className="mt-6 text-center text-sm">
            <span className="text-gray-400">아직 계정이 없나요? </span>
            <Link
              to="/signup"
              className="font-medium text-[#E84393] hover:underline"
            >
              회원가입하기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}