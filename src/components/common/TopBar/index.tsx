import { Link } from '@tanstack/react-router';
import UserIcon from '@assets/icons/user_icon.svg';
import { cn } from '@/utils/util';
import { fontStyles } from '@/utils/styles';
import { useUser } from '@/contexts/UserContext';

const TopBar = () => {
    const { user, loading } = useUser();

    return (
        <div className="flex items-center w-full px-5 py-3 gap-5 bg-[#303030]">
            <div className="flex p-1 w-10 h-10 rounded-full bg-[#666]">
                <img
                    src={UserIcon}
                    alt="유저 프로필사진"
                />
            </div>
            <p className={cn(fontStyles.body, "text-[#FBFBFB]")}>{loading ? 'Loading...' : `${user?.nickname || 'User'}님`}</p>
            <nav className="ml-5">
                <Link
                    to='/'
                    className={cn(fontStyles.body, "text-[#FBFBFB]")}
                >
                    <p>로그아웃</p>
                </Link>
            </nav>
        </div>
    )
}

export default TopBar;