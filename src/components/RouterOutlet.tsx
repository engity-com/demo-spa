import { NotFound } from '@/pages/NotFound';
import type React from 'react';
import { Outlet, type OutletProps, useLocation, useResolvedPath } from 'react-router';

interface RouterOutletProps extends OutletProps {
    onExactMatch?: {
        Component?: React.ComponentType | undefined;
        element?: React.ReactNode | undefined;
        notFound?: boolean | undefined;
        children?: boolean | undefined;
    };
    children?: React.ReactNode;
}

export function RouterOutlet(props: RouterOutletProps) {
    const path = useResolvedPath('');
    const location = useLocation();

    if (props.onExactMatch && path.pathname === location.pathname && path.search === location.search && path.hash === location.hash) {
        if (props.onExactMatch.Component) {
            return <props.onExactMatch.Component />;
        }
        if (props.onExactMatch.element) {
            return props.onExactMatch.element;
        }
        if (props.onExactMatch.notFound === true) {
            return <NotFound />;
        }
        if (props.onExactMatch.children === true) {
            return props.children;
        }
    }

    const downstreamProps: Omit<RouterOutletProps, 'onExactMatch'> = (({ onExactMatch, ...rest }) => rest)(props);
    return <Outlet {...downstreamProps} />;
}
