import './App.css';
import { Breadcrumb, Header, SideBar, SideBarProvider, Theme } from '@/components/page';
import { authenticationRouteConfigurations, resolveTitle, type RouteConfiguration, useResolvedRoutes } from '@/lib';
import { Problem, ProblemInRouter, routes as pageRoutes } from '@/pages';
import { type RefObject, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router';

function Heading() {
    const { t } = useTranslation();

    const routes = useResolvedRoutes();
    if (routes.length <= 0) {
        return;
    }
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

interface AppProps {
    readonly problemSinkRef: RefObject<((e: unknown, msg?: string) => void) | null>;
}

export function App(props: AppProps) {
    const problemRef = useRef<Problem | null>(null);

    useEffect(() => {
        props.problemSinkRef.current = (e: unknown, msg?: string) => problemRef.current?.doOnProblem(e, msg);
        return () => {
            props.problemSinkRef.current = null;
        };
    }, [props.problemSinkRef]);

    return (
        <Theme className='App' id='app'>
            <Problem ref={problemRef}>
                <RouterProvider router={router} />
            </Problem>
        </Theme>
    );
}
