/* SideBar와 TopBar가 동시에 있는 페이지에 사용하는 레이아웃 */

import { useState, useEffect } from 'react';
import type { LayoutProps } from './type';
import SideBar from "@components/common/SideBar";
import TopBar from "@components/common/TopBar";

const MainLayout = ({ children }: LayoutProps) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    
    // localStorage에서 축소 상태 불러오기
    const [isCollapsed, setIsCollapsed] = useState(() => {
        const saved = localStorage.getItem('sidebarCollapsed');
        return saved === 'true';
    });
    
    // 모바일로 전환되기 전 축소 상태를 기억
    const [wasCollapsedBeforeMobile, setWasCollapsedBeforeMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 1024;
            const wasMobile = isMobile;
            setIsMobile(mobile);
            
            if (!mobile) {
                // 화면이 넓어지면 사이드바 자동 표시
                setIsSidebarOpen(true);
                // 모바일에서 데스크톱으로 전환될 때 이전 축소 상태 복원
                if (wasMobile) {
                    setIsCollapsed(wasCollapsedBeforeMobile);
                }
            } else {
                // 화면이 좁아지면 사이드바 자동 숨김
                setIsSidebarOpen(false);
                // 데스크톱에서 모바일로 전환될 때 현재 축소 상태 저장
                if (!wasMobile) {
                    setWasCollapsedBeforeMobile(isCollapsed);
                }
                setIsCollapsed(false); // 모바일에서는 축소 상태 해제
            }
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, [isMobile, isCollapsed, wasCollapsedBeforeMobile]);

    const toggleSidebar = () => {
        if (isMobile) {
            // 모바일에서는 열기/닫기만
            setIsSidebarOpen(!isSidebarOpen);
        } else {
            // 데스크톱에서는 확장/축소
            const newCollapsed = !isCollapsed;
            setIsCollapsed(newCollapsed);
            localStorage.setItem('sidebarCollapsed', String(newCollapsed));
        }
    };

    return (
        <div className="flex h-screen relative overflow-hidden w-full">
            <SideBar isOpen={isSidebarOpen} isMobile={isMobile} isCollapsed={isCollapsed} />
            <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                <TopBar onToggleSidebar={toggleSidebar} showToggle={true} />
                <div className="flex-1 overflow-y-auto pt-11 pb-10 px-4 lg:px-18">
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