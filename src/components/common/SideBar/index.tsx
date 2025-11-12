import { Link } from '@tanstack/react-router';
import logoIcon from '@assets/icons/billnut_col_noneoutline.svg';
import { cn } from '@/utils/util';
import { fontStyles } from '@/utils/styles';

const navItems = [
    { to: '/main', label: '메인' },
    { to: '/list', label: '목록' },
    { to: '/generate', label: '생성' },
    { to: '/tuning', label: '튜닝' },
    { to: '/planner', label: '플래너' },
    { to: '/planb', label: '플랜B' },
    { to: '/debug', label: '디버깅'}
];

const SideBar = () => {

    return (
        <div className="flex flex-col min-w-60 min-h-screen z-10">
            <div className="flex items-end ps-5 pb-4 w-full min-h-32 bg-[#E65787]">
                <img
                    src={logoIcon}
                    alt="빌넣 로고"
                    className="w-20"
                />
            </div>

            <nav className="pt-10 bg-[#111111] h-full">
                <ul className="flex flex-col gap-5">
                    {navItems.map((item) => (
                        <li key={item.to}
                            className="px-8">
                            <Link
                                to={item.to}
                                className={cn(fontStyles.bodyLarge)}
                                activeProps={{
                                    className: "text-[#C1446C]"
                                }}
                            >
                                <p>{item.label}</p>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    )
}

export default SideBar;