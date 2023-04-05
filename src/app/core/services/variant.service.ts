import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class VariantService {
    private static readonly defaultKey = 'default';

    private readonly _keyToVariant: Record<string, Variant> = {};
    private readonly _subPathToVariant: Record<string, Variant> = {};
    private readonly _keys: string[] = [];
    private readonly _variants: Variant[] = [];

    constructor(translateService: TranslateService) {
        for (const key in environment.variants) {
            const variant: Variant = new VariantImpl(
                key,
                environment.variants[key],
                () => this.getDefault(),
                translateService
            );
            this._keyToVariant[key] = variant;
            this._subPathToVariant[variant.subPath] = variant;
            this._keys.push(key);
            this._variants.push(variant);
        }
        if (!this.findDefault()) {
            throw new Error(`No "${VariantService.defaultKey}" variant environment configured.`);
        }
    }

    private findDefault(): Variant | undefined {
        return this.find(VariantService.defaultKey);
    }

    private getDefault(): Variant {
        return this.findDefault()!;
    }

    find(key: string): Variant | undefined {
        return this._keyToVariant[key];
    }

    findBySubPath(subPath: string | undefined): Variant | undefined {
        return this._subPathToVariant[subPath || ''];
    }

    get keys(): string[] {
        return this._keys.copyWithin(0, 0);
    }

    get all(): Variant[] {
        return this._variants.copyWithin(0, 0);
    }
}

class VariantImpl implements Variant, Authority {
    constructor(
        readonly key: string,
        private readonly environment: any,
        private readonly defaultProvider: () => Variant,
        private readonly translateService: TranslateService
    ) {}

    get subPath(): string {
        const v = this.environment['subPath'];
        if (!v && typeof v !== 'string') {
            return '';
        }
        return v;
    }

    get doesSupportSignup(): boolean {
        return this.key !== 'magicLink';
    }

    get authority(): Authority {
        return this;
    }

    get clientId(): string {
        const v = this.environment['clientId'];
        if (!v && typeof v !== 'string') {
            throw new Error(`Variant environment "${this.key}" lacks clientId.`);
        }
        return v as string;
    }

    get stsAuthority(): string {
        const v = this.environment['stsAuthority'];
        if (!v && typeof v !== 'string') {
            throw new Error(`Variant environment "${this.key}" lacks stsAuthority.`);
        }
        return v as string;
    }

    get apiRoot(): string {
        const v = this.environment['apiRoot'];
        if (!v && typeof v !== 'string') {
            return this.stsAuthority;
        }
        return v as string;
    }

    translate(key: string): Observable<any> {
        const keyWithVariant = `${key}.${this.key}`;
        return this.translateOr(keyWithVariant, () => {
            const keyWithDefault = `${key}.${this.defaultProvider().key}`;
            return this.translateOr(keyWithDefault, () => this.translateService.get(key));
        });
    }

    private translateOr(key: string, or: () => Observable<any>): Observable<any> {
        return this.translateService.get(key).pipe(
            mergeMap((candidate: any): Observable<any> => {
                if (candidate !== key) {
                    return of(candidate);
                }
                return or();
            })
        );
    }
}

export interface Variant {
    readonly key: string;
    readonly subPath: string;
    readonly authority: Authority;
    readonly doesSupportSignup: boolean;

    translate(key: string): Observable<any>;
}

export interface Authority {
    readonly stsAuthority: string;
    readonly apiRoot: string;
    readonly clientId: string;
}
