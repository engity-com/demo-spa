import { Injectable, OnDestroy } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, ActivationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { concat, Observable, of, Subject, Subscription } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class VariantService implements OnDestroy {
    private static readonly defaultKey = 'default';

    private readonly _keyToVariant: Record<string, Variant> = {};
    private readonly _subPathToVariant: Record<string, Variant> = {};
    private readonly _keys: string[] = [];
    private readonly _variants: Variant[] = [];

    private readonly _routerSubscription: Subscription;
    private _active: Variant | undefined = undefined;
    private readonly _activeSubject = new Subject<Variant>();

    constructor(translateService: TranslateService, route: ActivatedRoute, router: Router) {
        for (const key in environment.variants) {
            const variant: Variant = new VariantImpl(
                key,
                environment.variants[key],
                () => this._findDefault(),
                translateService,
            );
            this._keyToVariant[key] = variant;
            this._subPathToVariant[variant.subPath] = variant;
            this._keys.push(key);
            this._variants.push(variant);
        }
        if (!this._findDefault()) {
            throw new Error(`No "${VariantService.defaultKey}" variant environment configured.`);
        }

        this._onActivatedRouteSnapshot(route.snapshot);
        this._routerSubscription = router.events.subscribe((e) => this._onRouterEvent(e));
    }

    public ngOnDestroy(): void {
        this._routerSubscription.unsubscribe();
    }

    private _findDefault(): Variant | undefined {
        return this.find(VariantService.defaultKey);
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

    get active(): Observable<Variant> {
        const current = this._active;
        if (current) {
            return concat(of(current), this._activeSubject);
        }
        return this._activeSubject;
    }

    private _onRouterEvent(e: any) {
        if (e instanceof ActivationEnd) {
            this._onRouterActivationEnd(e);
        }
    }

    private _onRouterActivationEnd(e: ActivationEnd) {
        this._onActivatedRouteSnapshot(e.snapshot);
    }

    private _onActivatedRouteSnapshot(snapshot: ActivatedRouteSnapshot) {
        const plainVariant = snapshot.paramMap.get('variant');
        const variant = this.findBySubPath(plainVariant);
        this._switchActiveVariant(variant);
    }

    private _switchActiveVariant(next: Variant | undefined) {
        const current = this._active;
        if (current === next) {
            // Nothing to be done...
            return;
        }
        this._active = next;
        if (next) {
            this._activeSubject.next(next);
        }
    }
}

class VariantImpl implements Variant, Authority {
    constructor(
        readonly key: string,
        private readonly _environment: any,
        private readonly _defaultProvider: () => Variant,
        private readonly _translateService: TranslateService,
    ) {}

    get subPath(): string {
        const v = this._environment['subPath'];
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
        const v = this._environment['clientId'];
        if (!v && typeof v !== 'string') {
            throw new Error(`Variant environment "${this.key}" lacks clientId.`);
        }
        return v as string;
    }

    get stsAuthority(): string {
        const v = this._environment['stsAuthority'];
        if (!v && typeof v !== 'string') {
            throw new Error(`Variant environment "${this.key}" lacks stsAuthority.`);
        }
        return v as string;
    }

    get apiRoot(): string {
        const v = this._environment['apiRoot'];
        if (!v && typeof v !== 'string') {
            return this.stsAuthority;
        }
        return v as string;
    }

    translate(key: string): Observable<any> {
        const keyWithVariant = `${key}.${this.key}`;
        return this._translateOr(keyWithVariant, () => {
            const keyWithDefault = `${key}.${this._defaultProvider().key}`;
            return this._translateOr(keyWithDefault, () => this._translateService.get(key));
        });
    }

    private _translateOr(key: string, or: () => Observable<any>): Observable<any> {
        return this._translateService.get(key).pipe(
            mergeMap((candidate: any): Observable<any> => {
                if (candidate !== key) {
                    return of(candidate);
                }
                return or();
            }),
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
