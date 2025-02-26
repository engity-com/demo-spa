import './App.css';
import { Breadcrumb, Header, SideBar, SideBarProvider, Theme } from '@/components/page';
import { type RouteConfiguration, authenticationRouteConfigurations, resolveTitle, useResolvedRoutes } from '@/lib';
import { Problem, ProblemInRouter, routes as pageRoutes } from '@/pages';
import { useTranslation } from 'react-i18next';
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router';

function Heading() {
    const routes = useResolvedRoutes();
    if (routes.length <= 0) {
        return;
    }

    const { t } = useTranslation();
    const route = routes[routes.length - 1];

    if (route.handle.displayHeading === false) {
        return;
    }

    const title = resolveTitle(route.handle, t) || undefined;
    if (!title) {
        return;
    }
    return <h1>{title}</h1>;
}

function Layout() {
    return (
        <SideBarProvider>
            <SideBar id='app-sidebar' />
            <div className='container'>
                <Header id='app-header' />
                <Breadcrumb />
                <main id='app-main'>
                    <Heading />
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
]).map((r) => ({ ...r, ErrorBoundary: ProblemInRouter }));

export const router = createBrowserRouter(routes);

export function App() {
    return (
        <Theme className='App' id='app'>
            <Problem>
                <RouterProvider router={router} />
            </Problem>
        </Theme>
    );
}
