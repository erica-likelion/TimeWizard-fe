/* SideBar와 TopBar가 동시에 있는 페이지에 사용하는 레이아웃 */

import { Outlet } from '@tanstack/react-router';

import SideBar from "@components/common/SideBar";
import TopBar from "@components/common/TopBar";

const MainLayout = () => {
    return (
        <div className="flex w-full h-screen mx-auto">
            <SideBar />
            <div className="flex flex-col w-full h-screen">
                <TopBar />
                <Outlet />
            </div>
        </div>
    );
};

export default MainLayout;