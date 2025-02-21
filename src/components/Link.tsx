import type React from 'react';
import { NavLink as RLink, type NavLinkProps as RLinkProps, type To } from 'react-router';

interface LinkProps extends RLinkProps, React.RefAttributes<HTMLAnchorElement> {
    children?: React.ReactNode;
    to: To;
    title?: string;
}

export function Link(props: LinkProps) {
    return (
        <RLink {...props}>
            {props.children}
            {props.title}
        </RLink>
    );
}
