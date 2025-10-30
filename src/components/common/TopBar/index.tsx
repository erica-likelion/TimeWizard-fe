import { Link } from '@tanstack/react-router';
import UserIcon from '@assets/icons/user_icon.svg';

const TopBar = () => {

    return (
        <div className="flex items-center w-full h-22 px-5 py-4 gap-5 bg-[#303030]">
            <div className="flex p-1 w-14 h-14 rounded-full bg-[#888]">
                <img
                    src={UserIcon}
                    alt="유저 프로필사진"
                />
            </div>
            <p>TimeWizard님</p>
            <nav className="ml-5">
                <Link
                    to='/'
                    className="text-[28px] text-[#888]"
                >
                    <p>로그아웃</p>
                </Link>
            </nav>
        </div>
    )
}

export default TopBar;