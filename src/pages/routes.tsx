import { Bar } from '@/pages/Bar';
import { Directory } from '@/pages/Directory';
import { Foo } from '@/pages/Foo';
import { Index } from '@/pages/Index';
import { NotFound } from '@/pages/NotFound';
import type { RouteConfiguration } from '../lib/routes';

export const routes: RouteConfiguration[] = [
    {
        index: true,
        Component: Index,
        handle: {
            titleKey: 'home',
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
        },
    },
];
