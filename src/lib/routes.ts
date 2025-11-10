import type { HasShortTitle, HasShortTitleKey, HasTitle, HasTitleKey } from '@/lib/title';
import type { ComponentType } from 'react';
import { type IndexRouteObject, type NonIndexRouteObject, type UIMatch, useMatches } from 'react-router';

export interface RouteHandle extends HasTitle, HasTitleKey, HasShortTitle, HasShortTitleKey {
    readonly displayHeading?: boolean | undefined;
    readonly icon?: ComponentType | undefined;

    readonly sideBar?:
        | {
              readonly visible?: boolean | undefined;
              readonly priority?: number | undefined;
          }
        | undefined;
}

interface AdditionalRouteConfiguration {
    readonly handle?: RouteHandle;
    readonly children?: RouteConfiguration[];
}

type IndexedRouteConfiguration = IndexRouteObject & AdditionalRouteConfiguration;
type NonIndexedRouteConfiguration = NonIndexRouteObject & AdditionalRouteConfiguration;

export type RouteConfiguration = IndexedRouteConfiguration | NonIndexedRouteConfiguration;

export interface ResolvedRoute extends UIMatch {
    readonly handle: RouteHandle;
}

function asResolvedRoute(given: any): ResolvedRoute | undefined {
    if (!given || !('handle' in given) || !given.handle) {
        return undefined;
    }
    const handle = given.handle;
    return (
        ((('title' in handle && typeof handle.title === 'string') ||
            ('titleKey' in handle && typeof handle.titleKey === 'string') ||
            ('displayHeading' in handle && typeof handle.displayHeading === 'boolean')) &&
            (given as ResolvedRoute)) ||
        undefined
    );
}

export function useResolvedRoutes(routes?: UIMatch[]): ResolvedRoute[] {
    const used = useMatches();
    const actualRoutes = routes || used;
    const result: ResolvedRoute[] = [];
    for (const route of actualRoutes) {
        const resolved = asResolvedRoute(route);
        if (!resolved) {
            continue;
        }
        if (result.length > 0 && result[result.length - 1].pathname === resolved.pathname) {
            result[result.length - 1] = resolved;
            continue;
        }
        result.push(resolved);
    }
    return result;
}
