import type React from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink as RLink, type NavLinkProps as RLinkProps, type To } from 'react-router';
import {
    type HasShortTitle,
    type HasShortTitleKey,
    type HasTitle,
    type HasTitleKey,
    resolveShortTitle,
    resolveTitle,
    useEnvironmentVariant,
} from '@/lib';

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
    readonly addSubPath?: boolean | undefined;
}

interface ToKeyLinkProps extends LinkProps {
    readonly toKey: string;
}

export function Link(props: ToLinkProps | ToKeyLinkProps) {
    const { t } = useTranslation();
    const variant = useEnvironmentVariant();
    const title =
        resolveTitle(props, t) ||
        (props.shortTitleFrom && resolveShortTitle(props.shortTitleFrom, t)) ||
        (props.titleFrom && resolveShortTitle(props.titleFrom, t)) ||
        undefined;
    let to = ('to' in props && props.to) || (('toKey' in props && props.toKey && t(props.toKey)) as To);
    if (variant?.subPath && typeof to === 'string' && (!('addSubPath' in props) || props.addSubPath !== false)) {
        try {
            new URL(to);
        } catch (_) {
            to = `/${variant?.subPath}${to}`;
        }
    }

    const {
        addSubPath: _addSubPath,
        toKey: _toKey,
        titleFrom: _titleFrom,
        titleKey: _titleKey,
        shortTitleFrom: _shortTitleFrom,
        shortTitle: _shortTitle,
        shortTitleKey: _shortTitleKey,
        ...downstreamProps
    } = props as ToLinkProps & Partial<ToKeyLinkProps>;

    return (
        <RLink {...downstreamProps} to={to} data-accent-color className={`rt-Text rt-reset rt-Link rt-underline-auto ${props.className}`}>
            {props.children}
            {title}
        </RLink>
    );
}
