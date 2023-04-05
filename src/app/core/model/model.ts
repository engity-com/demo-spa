import { TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

export enum ContactType {
    emailAddress = 'emailAddress',
    phoneNumber = 'phoneNumber',
}

export enum ContactState {
    unverified = 'unverified',
    verified = 'verified',
}

export interface Contact {
    type: ContactType;
    value: string;
    state?: ContactState;
}

export enum Variant {
    default = '',
    magicLink = 'magic-link',
}

export const variantToKey = (variant: Variant): string => {
    for (const k in Variant) {
        if (Variant[k] === variant) {
            return k;
        }
    }
    throw new Error(`Illegal variant: ${variant}`);
};

export const doesVariantSupportSignup = (variant: Variant): boolean => {
    switch (variant) {
        case Variant.magicLink:
            return false;
        default:
            return true;
    }
};

export const translateVariantAware = (
    using: TranslateService,
    key: string,
    variant: Variant
): Observable<any> => {
    const keyWithVariant = `${key}.${variantToKey(variant)}`;
    const keyWithDefault = `${key}.${variantToKey(Variant.default)}`;
    return translateOr(using, keyWithVariant, () =>
        translateOr(using, keyWithDefault, () => using.get(key))
    );
};

const translateOr = (
    using: TranslateService,
    key: string,
    or: () => Observable<any>
): Observable<any> => {
    return using.get(key).pipe(
        mergeMap((candidate: any): Observable<any> => {
            if (candidate !== key) {
                return of(candidate);
            }
            return or();
        })
    );
};
