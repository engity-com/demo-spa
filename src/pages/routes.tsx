import type { RouteConfiguration } from '@/lib';
import { Billing, Chat, Dashboard, Developer, NotFound, Notifications } from '@/pages';
import { Bell, Coins, FileCode, Home, MessageCircleMore } from 'lucide-react';

export const routes: RouteConfiguration[] = [
    {
        index: true,
        Component: Dashboard,
        handle: {
            titleKey: 'dashboard',
            icon: Home,
            sideBar: { visible: true },
        },
    },
    {
        path: 'developer',
        Component: Developer,
        handle: {
            titleKey: 'developer',
            icon: FileCode,
            sideBar: { visible: true },
        },
    },
    {
        path: 'chat',
        Component: Chat,
        handle: {
            titleKey: 'chat',
            icon: MessageCircleMore,
            sideBar: { visible: true },
        },
    },
    {
        path: 'billing',
        Component: Billing,
        handle: {
            titleKey: 'billing',
            icon: Coins,
            sideBar: { visible: true },
        },
    },
    {
        path: 'notifications',
        Component: Notifications,
        handle: {
            titleKey: 'notifications',
            icon: Bell,
            sideBar: { visible: true },
        },
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
