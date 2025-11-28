/* SideBar와 TopBar가 동시에 있는 페이지에 사용하는 레이아웃 */

import { useState, useEffect } from 'react';
import type { LayoutProps } from './type';
import SideBar from "@components/common/SideBar";
import TopBar from "@components/common/TopBar";

const MainLayout = ({ children }: LayoutProps) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
            // 화면이 넓어지면 사이드바 자동 표시
            if (!mobile) {
                setIsSidebarOpen(true);
            } else {
                // 화면이 좁아지면 사이드바 자동 숨김
                setIsSidebarOpen(false);
            }
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="flex h-screen relative overflow-hidden w-full">
            <SideBar isOpen={isSidebarOpen} isMobile={isMobile} />
            <div className="flex flex-col flex-1 min-w-0 overflow-y-auto">
                <TopBar onToggleSidebar={toggleSidebar} showToggle={isMobile} />
                <div className="pt-[108px] pb-10 px-4 lg:px-18">
                    {children}
                </div>
            </div>
            {/* 모바일에서 사이드바 열렸을 때 오버레이 */}
            {isMobile && isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/30 z-20"
                    onClick={toggleSidebar}
                />
            )}
        </div>
    );
};

export default MainLayout;