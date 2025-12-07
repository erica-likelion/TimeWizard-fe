import { Link } from '@tanstack/react-router';
// import logoIcon from '@assets/icons/billnut_col_noneoutline.svg';
import { cn } from '@/utils/util';
import { fontStyles } from '@/utils/styles';

import mainIcon from '@assets/icons/sidebar/main.webp';
import mainIconAccent from '@assets/icons/sidebar/main_accent.webp';
import listIcon from '@assets/icons/sidebar/list.webp';
import listIconAccent from '@assets/icons/sidebar/list_accent.webp';
import generateIcon from '@assets/icons/sidebar/generate.webp';
import generateIconAccent from '@assets/icons/sidebar/generate_accent.webp';
import tuningIcon from '@assets/icons/sidebar/tuning.webp';
import tuningIconAccent from '@assets/icons/sidebar/tuning_accent.webp';
import plannerIcon from '@assets/icons/sidebar/planner.webp';
import plannerIconAccent from '@assets/icons/sidebar/planner_accent.webp';
import planbIcon from '@assets/icons/sidebar/planb.webp';
import planbIconAccent from '@assets/icons/sidebar/planb_accent.webp';
import debugIcon from '@assets/icons/sidebar/debug.webp';
import debugIconAccent from '@assets/icons/sidebar/debug_accent.webp';

interface SideBarProps {
    isOpen: boolean;
    isMobile: boolean;
}

const navItems = [
    { to: '/main', label: '메인', icon: mainIcon, iconAccent: mainIconAccent },
    { to: '/list', label: '목록', icon: listIcon, iconAccent: listIconAccent },
    { to: '/generate', label: '생성', icon: generateIcon, iconAccent: generateIconAccent },
    { to: '/tuning', label: '튜닝', icon: tuningIcon, iconAccent: tuningIconAccent },
    { to: '/planner', label: '플래너', icon: plannerIcon, iconAccent: plannerIconAccent },
    { to: '/planb', label: '플랜B', icon: planbIcon, iconAccent: planbIconAccent },
    { to: '/debug', label: '디버깅', icon: debugIcon, iconAccent: debugIconAccent }
];

const SideBar = ({ isOpen, isMobile }: SideBarProps) => {

    return (
        <div 
            className={cn(
                "flex flex-col w-65 h-screen transition-transform duration-300 ease-in-out",
                isMobile ? "fixed left-0 top-0 z-30 shadow-2xl shrink-0" : "relative z-10 shrink-0",
                isMobile && !isOpen && "-translate-x-full"
            )}
        >
            <div className="flex items-end ps-5 pb-4 w-full min-h-35 bg-[#E65787]">
                {/* <img
                    src={logoIcon}
                    alt="빌넣 로고"
                    className="w-20"
                    style={{
                        filter: "drop-shadow(4px 4px 0px rgba(0, 0, 0, 0.3))"
                    }}
                /> */}
                <p className={cn(fontStyles.logo, "text-white ms-3 mb-2")}
                style={{textShadow: '4px 4px 0px rgba(0, 0, 0, 0.47)'}}>빌넣</p>
                
            </div>

            <nav className="pt-10 bg-[#141414] h-full">
                <ul className="flex flex-col gap-4">
                    {navItems.map((item) => (
                        <li key={item.to}>
                            <Link
                                to={item.to}
                                className="block"
                            >
                                {({ isActive }) => (
                                    <div className={cn("flex items-center gap-5 pl-6 py-2 transition-colors duration-300 ease-in-out border-l-4", fontStyles.bodyLarge, isActive ? "text-[#E65787] border-l-[#E65787]" : "text-white border-l-transparent")}>
                                        <img
                                            src={isActive ? item.iconAccent : item.icon}
                                            alt={item.label}
                                            className="w-7 h-7"
                                        />
                                        <p>{item.label}</p>
                                    </div>
                                )}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    )
}

export default SideBar;