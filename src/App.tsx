import './App.css';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Header } from '@/components/Header';
import { SideBar, SideBarProvider } from '@/components/SideBar';
import { Theme } from '@/components/Theme';
import { authenticationRouteConfigurations } from '@/lib/authentication';
import { routes as pageRoutes } from '@/pages/routes';
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router';
import type { RouteConfiguration } from './lib/routes';

function Layout() {
    return (
        <SideBarProvider>
            <SideBar id='app-sidebar' />
            <div className='container'>
                <Header id='app-header' />
                <Breadcrumb />
                <main id='app-main'>
                    <Outlet />
                </main>
            </div>
        </SideBarProvider>
    );
}

export const routes: RouteConfiguration[] = authenticationRouteConfigurations([
    {
        Component: Layout,
        children: pageRoutes,
        handle: {
            titleKey: 'home',
        },
    },
]);

export const router = createBrowserRouter(routes);

export function App() {
    return (
        <Theme className='App' id='app'>
            <RouterProvider router={router} />
        </Theme>
    );
}
