import { Link } from '@tanstack/react-router';
import logoIcon from '@assets/icons/billnut_col_noneoutline.svg';

const navItems = [
    { to: '/main', label: '메인' },
    { to: '/list', label: '목록' },
    { to: '/generate', label: '생성' },
    { to: '/tuning', label: '튜닝' },
    { to: '/planner', label: '플래너' },
    { to: '/planb', label: '플랜B' }
];

const SideBar = () => {

    return (
        <div className="flex flex-col w-[313px] h-full">
            <div className="flex items-end px-7.5 w-full h-[160px] bg-[#E65787]">
                <img
                    src={logoIcon}
                    alt="빌넣 로고"
                    className="h-25"
                />
            </div>

            <nav className="my-[37px]">
                <ul className="flex flex-col">
                    {navItems.map((item) => (
                        <li key={item.to}
                            className="px-7.5 py-4.5">
                            <Link
                                to={item.to}
                                className="text-[28px]"
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