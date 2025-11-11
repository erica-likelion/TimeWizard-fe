import { useState } from 'react';
import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';
import { TextInput } from '@/components/boxes/InputBox';
import { PinkButton } from '@/components/buttons/PinkButton';
import LoginBgImage from '@assets/images/login.png'; 
import LogoSvg from '@assets/icons/time_table.png'; 
import TitleSvg from '@assets/icons/billnut_col.svg'; 


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

  // 5. 폼 제출 핸들러 (내용 동일)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // --- 가짜 API 호출 시뮬레이션 ---
    try {
      await new Promise((resolve, reject) =>
        setTimeout(() => {
          if (email === 'test@example.com' && password === 'password') {
            resolve(true);
          } else {
            reject(new Error('이메일 또는 비밀번호가 올바르지 않습니다.'));
          }
        }, 1000),
      );
      navigate({ to: '/' }); 
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('알 수 없는 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // [✨ 수정됨] 6. 렌더링 (회원가입 페이지와 동일한 2단 레이아웃)
  return (
    <div className="flex min-h-screen w-full">
      
      {/* 6-1. 왼쪽 섹션: 로고 (회색 벽) */}
      <div className="
        hidden md:flex md:w-1/3 lg:w-1/4 
        items-center justify-center 
        bg-[#2C2C2C] p-8
      ">
        <img 
          src={LogoSvg}
          alt="로고" 
          className="w-full max-w-[150px]"
        />
      </div>

      {/* 6-2. 오른쪽 섹션: 폼 + 배경 이미지 */}
      <div 
        style={{
          backgroundImage: `url(${LoginBgImage})`, 
        }}
        className="
          flex w-full md:w-2/3 lg:w-3/4 
          items-center justify-center md:justify-start /* 폼을 왼쪽 정렬 (디자인 시안 기준) */
          p-8 md:p-16 lg:p-24 /* 폼의 왼쪽 여백 */
          bg-[#1A1A1A] /* 이미지 로드 실패 시 배경색 */
          bg-cover bg-center bg-no-repeat
        "
      >
        {/* 폼 컨테이너 */}
        <div className="w-full max-w-md"> 
          <div className="flex items-center gap-x-2 mb-3">
            <img 
              src={TitleSvg} 
              alt="빌넣 로고" 
              className="w-20 h-auto" 
            />
            <span className="font-galmuri text-3xl text-white">로그인</span>
          </div>
          <p>
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