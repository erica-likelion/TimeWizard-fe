/* SideBar와 TopBar가 동시에 있는 페이지에 사용하는 레이아웃 */

import type { LayoutProps } from './type';
import SideBar from "@components/common/SideBar";
import TopBar from "@components/common/TopBar";

const MainLayout = ({ children }: LayoutProps) => {
    return (
        <div className="flex min-w-screen min-h-screen mx-auto">
            <SideBar />
            <div className="flex flex-col flex-1">
                <TopBar />
                {children}
            </div>
        </div>
    );
};

export default MainLayout;