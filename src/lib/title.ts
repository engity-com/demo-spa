import type { TFunction } from 'i18next';

export interface HasTitle {
    readonly title?: string | undefined;
}

export interface HasTitleKey {
    readonly titleKey?: string | undefined;
}

export function resolveTitle(from: HasTitle | undefined): string | undefined;

export function resolveTitle(from: HasTitle | HasTitleKey | undefined, t: TFunction, tOpts?: Record<string, any> | undefined): string | undefined;

export function resolveTitle(
    from: HasTitle | HasTitleKey | undefined,
    t?: TFunction | undefined,
    tOpts?: Record<string, any> | undefined,
): string | undefined {
    if (!from) {
        return undefined;
    }

    if ('title' in from && from.title) {
        return from.title;
    }

    if ('titleKey' in from && from.titleKey && t) {
        const resolved = t(from.titleKey, tOpts);
        if (resolved) {
            return resolved;
        }
    }

    return undefined;
}

export type HasShortTitleKind = HasShortTitle | HasShortTitleKey;

export interface HasShortTitle {
    readonly shortTitle?: string | undefined;
}

export interface HasShortTitleKey {
    readonly shortTitleKey?: string | undefined;
}

export function resolveShortTitle(from: HasShortTitle | HasTitle | undefined): string | undefined;

export function resolveShortTitle(
    from: HasShortTitle | HasShortTitleKey | HasTitle | HasTitleKey | undefined,
    t: TFunction,
    tOpts?: Record<string, any> | undefined,
): string | undefined;

export function resolveShortTitle(
    from: HasShortTitle | HasShortTitleKey | HasTitle | HasTitleKey | undefined,
    t?: TFunction | undefined,
    tOpts?: Record<string, any> | undefined,
): string | undefined {
    if (!from) {
        return undefined;
    }

    if ('shortTitle' in from && from.shortTitle) {
        return from.shortTitle;
    }

    if ('shortTitleKey' in from && from.shortTitleKey && t) {
        const resolved = t(from.shortTitleKey, tOpts);
        if (resolved) {
            return resolved;
        }
    }

    // @ts-expect-error
    return resolveTitle(from as HasTitle | HasTitleKey | undefined, t, tOpts);
}
