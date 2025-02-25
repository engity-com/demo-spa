import './Breadcrumb.css';
import { Link } from '@/components/Link';
import { useResolvedRoutes } from '@/lib/routes';

export function Breadcrumb() {
    const routes = useResolvedRoutes();
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
