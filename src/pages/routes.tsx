import type { RouteConfiguration } from '@/lib';
import { Bar, Dashboard, Directory, Foo, NotFound } from '@/pages';

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
