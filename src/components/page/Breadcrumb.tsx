import './Breadcrumb.css';
import { Link } from '@/components';
import { useResolvedRoutes } from '@/lib';

export function Breadcrumb() {
    const routes = useResolvedRoutes();
    return (
        <ul className='Breadcrumb'>
            {routes.map((r) => (
                <li key={r.id}>
                    <Link to={r.pathname} shortTitleFrom={r.handle} />
                </li>
            ))}
        </ul>
    );
}
