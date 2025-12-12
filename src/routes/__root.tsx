import { createRootRoute, Outlet, useLocation } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import Layout from '@layouts/MainLayout'
import { requireLogin } from '@/utils/authCheck'

const publicPaths = ['/', '/signup', '/login']

const RootLayout = () => {
  const locatation = useLocation();
  console.log(location.pathname);

  return (
    <div>
      {publicPaths.includes(locatation.pathname) ?
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

export const Route = createRootRoute({
  component: RootLayout,
  beforeLoad: ({ location }) => {
    if (!publicPaths.includes(location.pathname)) {
      requireLogin()
    }
  }
})