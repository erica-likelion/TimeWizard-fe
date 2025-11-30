import { Link, useNavigate } from '@tanstack/react-router';
import UserIcon from '@assets/icons/user_icon.svg';
import { cn } from '@/utils/util';
import { fontStyles } from '@/utils/styles';
import { useUser } from '@/contexts/UserContext';

interface TopBarProps {
    onToggleSidebar?: () => void;
    showToggle?: boolean;
}

const TopBar = ({ onToggleSidebar, showToggle = false }: TopBarProps) => {
    const { user, loading, logout } = useUser();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate({ to: '/' });
    };

    return (
        <div className="w-full
                        flex px-5 py-3
                        justify-between
                        bg-[#272727] z-10">
            <div className="flex items-center gap-5">
                {/* 햄버거 메뉴 버튼 */}
                {showToggle && (
                    <button
                        onClick={onToggleSidebar}
                        className="flex flex-col justify-center items-center w-10 h-10 mr-2 hover:bg-[#404040] rounded transition-colors"
                        aria-label="메뉴 토글"
                    >
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M3 12H21M3 6H21M3 18H21"
                                stroke="#FBFBFB"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                )}
                <div className="flex p-1 w-10 h-10 rounded-full bg-[#666]">
                    <img
                        src={UserIcon}
                        alt="유저 프로필사진"
                    />
                </div>
                <p className={cn(fontStyles.body, "text-[#FBFBFB]")}>{loading ? 'Loading...' : `${user?.nickname || 'User'}님`}</p>
            </div>
            <div className="flex items-center gap-3">
                <Link
                    to='/mypage'
                    className={cn(fontStyles.body, "text-[#FBFBFB]")}
                >
                    <p>마이페이지</p>
                </Link>
                <button
                    onClick={handleLogout}
                    className={cn(fontStyles.body, "text-[#FBFBFB]")}
                >
                    <p>로그아웃</p>
                </button>
            </div>
        </div>
    )
}

export default TopBar;