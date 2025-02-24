import './Breadcrumb.css';
import { Link } from '@/components/Link';
import type { ResolvedRoute } from '@/lib/routes';
import { type UIMatch, useMatches } from 'react-router';

function filterIndexDuplicates(routes: UIMatch[]): UIMatch[] {
    const result: UIMatch[] = [];
    for (const route of routes) {
        if (result.length > 0 && result[result.length - 1].pathname === route.pathname) {
            result[result.length - 1] = route;
            continue;
        }
        result.push(route);
    }
    return result;
}

function resolve(routes: UIMatch[]): ResolvedRoute[] {
    return routes.filter(
        // @ts-ignore
        (route) => route.handle && (('title' in route.handle && route.handle.title) || ('titleKey' in route.handle && route.handle.titleKey)),
    ) as ResolvedRoute[];
}

export function Breadcrumb() {
    const routes = resolve(filterIndexDuplicates(useMatches()));
    return (
        <ul className='Breadcrumb'>
            {routes.map((r) => (
                <li key={r.id}>
                    <Link to={r.pathname} titleFrom={r.handle} />
                </li>
            ))}
        </ul>
    );
}
