import './Breadcrumb.css';
import { Link } from '@/components/Link';
import { type UIMatch, useMatches } from 'react-router';
import type { ResolvedRoute } from '../lib/routes';

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
    return (
        routes
            // @ts-ignore
            .filter((route) => route.handle?.title) as ResolvedRoute[]
    );
}

export function Breadcrumb() {
    const routes = resolve(filterIndexDuplicates(useMatches()));

    return (
        <ul className='Breadcrumb'>
            {routes.map((r) => (
                <li key={r.id}>
                    <Link to={r.pathname}>{r.handle.title}</Link>
                </li>
            ))}
        </ul>
    );
}
