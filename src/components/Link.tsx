import { type HasShortTitle, type HasShortTitleKey, type HasTitle, type HasTitleKey, resolveShortTitle, resolveTitle } from '@/lib';
import type React from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink as RLink, type NavLinkProps as RLinkProps, type To } from 'react-router';

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
        <RLink {...downstreamProps} to={to} data-accent-color className={`rt-Text rt-reset rt-Link rt-underline-auto ${props.className}`}>
            {props.children}
            {title}
        </RLink>
    );
}
