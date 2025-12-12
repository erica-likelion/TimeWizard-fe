import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { redirectIfLoggedIn } from '@/utils/authCheck'
import backgroundImage from '../assets/images/background.png'
import logoIcon from '../assets/icons/billnut_col.svg'
import timewizardLogo from '../assets/icons/timewizard.svg' 

export const Route = createFileRoute('/')({
  beforeLoad: redirectIfLoggedIn,
  component: Index,
})

function Index() {
  const navigate = useNavigate();

  return (
    <div
      className="relative flex min-h-screen w-full flex-col bg-cover bg-center text-white "
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 z-0 bg-black/60" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <nav className="flex w-full h-[60px] items-center text-[12px]
                        justify-between bg-[#303030]/45 px-8 text-gray-300 md:px-12 
                        text-xl font-bold backdrop-blur-md">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <img src={timewizardLogo} alt="TimeWizard Logo" className="h-8 w-auto" />
              <span className="hover:text-white">Dev By TimeWizard</span>
            </div>
            <span className="hover:text-white">About Us</span>
          </div>
          <span>이용약관 개인정보 수집 이용 명의서</span>
        </nav>

        <main className="flex-grow flex flex-col items-center justify-center text-center p-8 md:p-12">
          <h2 className="mb-6 text-[16px] font-bold whitespace-nowrap font-['Galmuri11']">
            대학생들의 든든한 시간표 & 수강신청 AI 플래너
          </h2>
          
          <img 
            src={logoIcon} 
            alt="빌넣 로고" 
            className="mb-12 w-[300px] h-[auto] drop-shadow-[0_0_15px_rgba(236,72,153,0.7)]" 
          />

          
          <div className="flex w-full max-w-[448px] flex-col gap-4">
            
            <button
              type="button" 
              className="w-full flex items-center justify-center border-2 border-white bg-transparent py-4 text-lg font-bold transition hover:bg-white/10 font-['Galmuri11']"
              onClick={() => navigate({to: '/login'})}
            >
              로그인 페이지로 이동
            </button>
            
            <button
              type="button" 
              className="w-full flex items-center justify-center bg-[#e65787] py-4 text-lg font-bold text-white transition hover:bg-pink-600 font-['Galmuri11']"
              onClick={() => navigate({to: '/signup'})}
            >
              회원가입
            </button>
          </div>
        </main>
      </div>
    </div>
  )
}