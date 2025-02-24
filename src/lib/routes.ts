import type { IndexRouteObject, NonIndexRouteObject, UIMatch } from 'react-router';

export interface RouteHandle {
    readonly title?: string;
    readonly titleKey?: string;
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
