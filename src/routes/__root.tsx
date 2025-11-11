import { createRootRoute, Outlet, useLocation } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import Layout from '@layouts/MainLayout'

const RootLayout = () => {
  const locatation = useLocation();
  console.log(location.pathname);

  return (
    <div>
      {locatation.pathname == '/' || locatation.pathname == '/signup' || locatation.pathname == '/login' || locatation.pathname == '/mypage' ? 
      <Outlet/>
      : 
      <Layout>
        <Outlet />
      </Layout>
      }
      
      <TanStackRouterDevtools />
    </div>
  )
}

export const Route = createRootRoute({ component: RootLayout })