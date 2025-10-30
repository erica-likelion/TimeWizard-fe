import { createRootRoute, Outlet, useLocation } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import Layout from '@layouts/MainLayout'

const RootLayout = () => {
  const locatation = useLocation();
  console.log(location.pathname);

  return (
    <div className="min-h-screen bg-black text-white">
      {locatation.pathname == '/' ? <Outlet/>
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