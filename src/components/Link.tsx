import { type HasShortTitle, type HasShortTitleKey, type HasTitle, type HasTitleKey, resolveShortTitle, resolveTitle } from '@/lib';
import type React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'react-oidc-context';
import { NavLink as RLink, type NavLinkProps as RLinkProps, type To } from 'react-router';
import type { NamedEnvironmentVariant } from '../environments';

interface LinkProps
    extends Omit<RLinkProps, 'to' | 'title'>,
        React.RefAttributes<HTMLAnchorElement>,
        HasTitle,
        HasShortTitle,
        HasTitleKey,
        HasShortTitleKey {
    readonly children?: React.ReactNode;
    readonly titleFrom?: HasTitle | HasTitleKey | undefined;
    readonly shortTitleFrom?: HasShortTitle | HasShortTitleKey | undefined;
}

interface ToLinkProps extends LinkProps {
    readonly to: To;
}

interface ToKeyLinkProps extends LinkProps {
    readonly toKey: string;
}
export function Link(props: ToLinkProps | ToKeyLinkProps) {
    const { t } = useTranslation();
    const auth = useAuth();
    const variant = ('internalVariant' in auth && (auth.internalVariant as NamedEnvironmentVariant)) || undefined;
    const title =
        resolveTitle(props, t) ||
        (props.shortTitleFrom && resolveShortTitle(props.shortTitleFrom, t)) ||
        (props.titleFrom && resolveShortTitle(props.titleFrom, t)) ||
        undefined;
    const to = ('to' in props && props.to) || (('toKey' in props && props.toKey && t(props.toKey)) as To);
    const downstreamProps: Omit<
        ToLinkProps | ToKeyLinkProps,
        'toKey' | 'titleFrom' | 'titleKey' | 'shortTitleFrom' | 'shortTitle' | 'shortTitleKey'
        // @ts-ignore
    > = (({ toKey, titleFrom, titleKey, shortTitleFrom, shortTitle, shortTitleKey, ...rest }) => rest)(props);

    return (
        <RLink
            {...downstreamProps}
            to={variant?.subPath && typeof to === 'string' ? `/${variant?.subPath}${to}` : to}
            data-accent-color
            className={`rt-Text rt-reset rt-Link rt-underline-auto ${props.className}`}
        >
            {props.children}
            {title}
        </RLink>
    );
}
