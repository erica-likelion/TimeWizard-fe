import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'


const RootLayout = () => (

  <div className="min-h-screen bg-black text-white">
    
    <Outlet />
    
    <TanStackRouterDevtools />
  </div>
)

export const Route = createRootRoute({ component: RootLayout })