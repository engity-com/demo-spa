import type { RouteConfiguration } from '@/lib/routes';
import { Bar } from '@/pages/Bar';
import { Dashboard } from '@/pages/Dashboard';
import { Directory } from '@/pages/Directory';
import { Foo } from '@/pages/Foo';
import { NotFound } from '@/pages/NotFound';

export const routes: RouteConfiguration[] = [
    {
        index: true,
        Component: Dashboard,
        handle: {
            titleKey: 'dashboard',
        },
    },
    {
        path: 'directory',
        Component: Directory,
        handle: {
            title: 'Directory',
        },
        children: [
            {
                path: 'foo',
                Component: Foo,
                handle: {
                    title: 'A Foo',
                },
            },
            {
                path: 'bar',
                Component: Bar,
                handle: {
                    title: 'A Bar',
                },
            },
        ],
    },
    {
        path: '*',
        Component: NotFound,
        handle: {
            titleKey: 'notFound',
            displayHeading: false,
        },
    },
];
