import type React from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink as RLink, type NavLinkProps as RLinkProps, type To } from 'react-router';

interface LinkProps extends Omit<RLinkProps, 'to'>, React.RefAttributes<HTMLAnchorElement> {
    readonly children?: React.ReactNode;
    readonly title?: string | undefined;
    readonly titleKey?: string | undefined;
    readonly titleFrom?: HasTitle | HasTitleKey | undefined;
}

interface ToLinkProps extends LinkProps {
    readonly to: To;
}

interface ToKeyLinkProps extends LinkProps {
    readonly toKey: string;
}

interface HasTitle {
    readonly title?: string | undefined;
}

interface HasTitleKey {
    readonly titleKey?: string | undefined;
}

export function Link(props: ToLinkProps | ToKeyLinkProps) {
    const { t } = useTranslation();
    const title =
        props.title ||
        (props.titleKey && t(props.titleKey)) ||
        (props.titleFrom && 'title' in props.titleFrom && props.titleFrom.title) ||
        (props.titleFrom && 'titleKey' in props.titleFrom && props.titleFrom.titleKey && t(props.titleFrom.titleKey)) ||
        undefined;
    const to = ('to' in props && props.to) || (('toKey' in props && props.toKey && t(props.toKey)) as To);
    // @ts-ignore
    const downstreamProps: Omit<ToLinkProps | ToKeyLinkProps, 'toKey' | 'titleFrom' | 'titleKey'> = (({ toKey, titleFrom, titleKey, ...rest }) =>
        rest)(props);

    return (
        <RLink {...downstreamProps} to={to} data-accent-color className={`rt-Text rt-reset rt-Link rt-underline-auto ${props.className}`}>
            {props.children}
            {title}
        </RLink>
    );
}
