import TimeTable from "@assets/icons/time_table.png";
import { Card } from "@/components/Card";
import { fontStyles } from "@/utils/styles";
import { cn } from "@/utils/util";
import { useUser } from "@/contexts/UserContext";
import { useNavigate } from "@tanstack/react-router";

export function MainPage() {
  const { user, loading } = useUser();
  const navigate = useNavigate();

  // 수강신청 날짜까지 남은 일수 계산
  const calculateDaysLeft = () => {
    const targetDate = new Date('2026-02-09');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    targetDate.setHours(0, 0, 0, 0);
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const daysLeft = calculateDaysLeft();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className={fontStyles.title}>로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col lg:flex-row justify-between gap-6 items-start lg:items-center">
        <div>
          <p className={cn(fontStyles.title, "text-[#FBFBFB]")}>안녕하세요 <span className="font-bold">{user?.nickname || 'User'}</span>님!</p>
          <p className={cn(fontStyles.title, "text-[#C1446C]")}>수강신청까지 <span className="font-bold">{daysLeft}일</span> 남았어요</p>
        </div>
        <img
            src={TimeTable}
            alt="시간표 아이콘"
            className="w-0 lg:w-[150px]"
        />
      </div>

      <div className="flex flex-col xl:flex-row gap-5 xl:gap-10">
        <Card
          title="나의 정보"
          buttonText="수정 →"
          onClick={() => navigate ({ to: '/mypage'})} // 나중에 연결 추가
          className="w-full xl:flex-1"
        >
          <div className="flex flex-col gap-4">
            <div className="flex">
              <span className={cn(fontStyles.body, "flex-1")}>학교</span>
              <span className={cn(fontStyles.body, "flex-2 break-words")}>{user?.university || '-'}</span>
            </div>
            <div className="flex">
              <span className={cn(fontStyles.body, "flex-1")}>전공</span>
              <span className={cn(fontStyles.body, "flex-2 break-words")}>{user?.major || '-'}</span>
            </div>
            <div className="flex">
              <span className={cn(fontStyles.body, "flex-1")}>학년</span>
              <span className={cn(fontStyles.body, "flex-2")}>{user?.grade ? `${user.grade}학년` : '-'}</span>
            </div>
            <div className="flex">
              <span className={cn(fontStyles.body, "flex-1")}>이수 학점</span>
              <span className={cn(fontStyles.body, "flex-2")}>{user?.completed_credits || 0}학점</span>
            </div>
            <div className="flex hidden">
              <span className={cn(fontStyles.body, "flex-1")}>전공 학점</span>
              {
                //<span className={cn(fontStyles.body, "flex-2")}>{user?.major_credits || 0}학점</span>
              }
            </div>
          </div>
        </Card>

        <Card title="남은 크레딧" className="w-full xl:flex-1">
          <div className="flex flex-col gap-6">
            <div className="flex items-end">
                <span className={cn(fontStyles.title, "text-[60px] leading-none")}>3,800</span>
                <span className="text-[24px] pb-1">&nbsp;/&nbsp;</span>
                <span className={cn(fontStyles.title, "text-[30px] leading-none")}>5,000</span>
              </div>
            <div className="flex flex-col gap-4">
              <div className="flex">
                <span className={cn(fontStyles.body, "flex-1")}>플랜</span>
                <span className={cn(fontStyles.body, "flex-2")}>라이트</span>
              </div>
              <div className="flex">
                <span className={cn(fontStyles.body, "flex-1")}>오늘 사용량</span>
                <span className={cn(fontStyles.body, "flex-2")}>100</span>
              </div>
              <div className="flex">
                <span className={cn(fontStyles.body, "flex-1")}>최근 7일</span>
                <span className={cn(fontStyles.body, "flex-2")}>1,200</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
