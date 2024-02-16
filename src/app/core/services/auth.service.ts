import { Injectable, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ErrorResponse, Log, OidcMetadata, User, UserManager, WebStorageStateStore } from 'oidc-client-ts';
import { concat, firstValueFrom, map, Observable, of, Subject, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Variant, VariantService } from './variant.service';

if (!environment.production) {
    Log.setLogger(console);
    Log.setLevel(Log.DEBUG);
}

@Injectable({
    providedIn: 'root',
})
export class AuthService implements OnDestroy {
    private _userRaw: User | undefined = undefined;
    private readonly _userSubject = new Subject<User | undefined>();

    private _userManagerAssignmentRaw: UserManagerAssignment | undefined = undefined;
    private readonly _userManagerAssignmentSubject = new Subject<UserManagerAssignment | undefined>();

    private readonly _variantSubscription: Subscription;

    private _initializeTriggered: boolean = false;
    private _initializedRaw: boolean = false;
    private readonly _initializedSubject = new Subject<boolean>();

    private _explicitActiveRequestsRaw: number = 0;
    private readonly _explicitActiveRequestsSubject = new Subject<number>();

    constructor(
        private readonly _variantService: VariantService,
        private readonly _translateService: TranslateService,
    ) {
        this._variantSubscription = this._variantService.active.subscribe((variant) =>
            this._switchUserManagerAssignment(variant),
        );
    }

    public async initialize(): Promise<void> {
        if (!this._initializeTriggered) {
            this._initializeTriggered = true;
            await this.renew();
            this._initializedRaw = true;
            this._initializedSubject.next(true);
        }
    }

    private _createUserManagerAssignmentFor(variant: Variant): UserManagerAssignment {
        const uriPrefix = `${environment.clientRoot}${variant.subPath ? variant.subPath + '/' : ''}`;
        const um = new UserManager({
            authority: variant.authority.stsAuthority,
            client_id: variant.authority.clientId,
            redirect_uri: `${uriPrefix}after-login`,
            silent_redirect_uri: `${uriPrefix}after-silent-login`,
            response_type: 'code',
            silentRequestTimeoutInSeconds: 5000,
            scope: 'openid profile email contacts',
            userStore: new WebStorageStateStore({
                prefix: `${variant ? variant.key : ''}.`,
                store: window.localStorage,
            }),
            ui_locales: this._translateService.currentLang,
        });
        const uma: UserManagerAssignment = {
            variant: variant,
            userManager: um,
            uriPrefix: uriPrefix,
        };
        um.events.addAccessTokenExpired(this.onAccessTokenExpired);
        um.events.addAccessTokenExpiring(this.onAccessTokenExpiring);
        um.events.addUserLoaded(this._onUserLoaded);
        um.events.addUserUnloaded(this._onUserUnloaded);
        return uma;
    }

    private _switchUserManagerAssignment(toVariant: Variant | undefined) {
        const current = this._userManagerAssignmentRaw;
        if (current) {
            if (toVariant && current.variant === toVariant) {
                // No change needed...
                return;
            }

            if (!toVariant) {
                this._destroyUserManagerAssignment(current);
                this._userManagerAssignmentRaw = undefined;
                this._userManagerAssignmentSubject.next(undefined);
                return;
            }

            const next = this._createUserManagerAssignmentFor(toVariant);
            this._destroyUserManagerAssignment(current);
            this._userManagerAssignmentRaw = next;
            this._userManagerAssignmentSubject.next(next);
            return;
        }

        if (!toVariant) {
            // No change needed...
            return;
        }

        const next = this._createUserManagerAssignmentFor(toVariant);
        this._userManagerAssignmentRaw = next;
        this._userManagerAssignmentSubject.next(next);
    }

    private _destroyUserManagerAssignment(what: UserManagerAssignment) {
        const events = what.userManager.events;
        events.removeAccessTokenExpired(this.onAccessTokenExpired);
        events.removeAccessTokenExpiring(this.onAccessTokenExpiring);
        events.removeUserLoaded(this._onUserLoaded);
        events.removeUserUnloaded(this._onUserUnloaded);
    }

    private get _userManagerAssignmentObservable(): Observable<UserManagerAssignment> {
        const current = this._userManagerAssignmentRaw;
        if (current) {
            return concat(of(current), this._userManagerAssignmentSubject);
        }
        return this._userManagerAssignmentSubject;
    }

    private get _userManagerAssignment(): Promise<UserManagerAssignment> {
        return firstValueFrom(this._userManagerAssignmentObservable);
    }

    private get _userManager(): Promise<UserManager> {
        return this._userManagerAssignment.then((uma) => uma.userManager);
    }

    ngOnDestroy(): void {
        this._variantSubscription.unsubscribe();
        const uma = this._userManagerAssignmentRaw;
        if (uma) {
            this._destroyUserManagerAssignment(uma);
        }
    }

    get metadata(): Promise<Partial<OidcMetadata>> {
        return this._userManager.then((um) => um.metadataService.getMetadata());
    }

    get user(): Observable<User | undefined> {
        return concat(of(this._userRaw), this._userSubject);
    }

    async login(prompt: string = 'login'): Promise<void> {
        this._modifyExplicitActiveRequests(1);
        try {
            const uma = await this._userManagerAssignment;
            return await uma.userManager.signinRedirect({
                prompt: prompt,
                extraQueryParams: {
                    cancel_redirect_uri: uma.uriPrefix,
                },
            });
        } finally {
            this._modifyExplicitActiveRequests(-1);
        }
    }

    async loginCallback(silent: boolean = false): Promise<void> {
        this._modifyExplicitActiveRequests(1);
        try {
            const um = await this._userManager;
            silent ? await um.signinSilentCallback() : await um.signinCallback();
        } finally {
            this._modifyExplicitActiveRequests(-1);
        }
    }

    async logout(silent: boolean = false): Promise<void> {
        this._modifyExplicitActiveRequests(1);
        try {
            const uma = await this._userManagerAssignment;
            silent
                ? await uma.userManager.signoutSilent({
                      post_logout_redirect_uri: `${uma.uriPrefix}after-silent-logout`,
                  })
                : await uma.userManager.signoutRedirect({
                      post_logout_redirect_uri: `${uma.uriPrefix}after-logout`,
                  });
        } finally {
            this._modifyExplicitActiveRequests(-1);
        }
    }

    async logoutCallback(silent: boolean = false): Promise<User | void> {
        this._modifyExplicitActiveRequests(1);
        try {
            const um = await this._userManager;
            silent ? await um.signoutSilentCallback() : await um.signoutCallback();
        } finally {
            this._modifyExplicitActiveRequests(-1);
        }
    }

    async renew(): Promise<User | null> {
        const um = await this._userManager;
        return await this.renewWith(um);
    }

    private async renewWith(um: UserManager): Promise<User | null> {
        this._modifyExplicitActiveRequests(1);
        try {
            return await um.signinSilent();
        } catch (e) {
            if (e instanceof ErrorResponse) {
                switch (e.error) {
                    case 'access_denied':
                        console.info('Looks like that our refresh token is not longer valid. Assuming as logged out.');
                        await um.removeUser();
                        return null;
                    case 'interaction_required':
                    case 'login_required':
                    case 'account_selection_required':
                        await um.removeUser();
                        return null;
                }
            }
            throw e;
        } finally {
            this._modifyExplicitActiveRequests(-1);
        }
    }

    private readonly onAccessTokenExpired = async (): Promise<void> =>
        await this.renewWithMessage('Current token is expired. Trying renew token...');

    private readonly onAccessTokenExpiring = async (): Promise<void> =>
        await this.renewWithMessage('Token will expire soon. Trying renew token...');

    private async renewWithMessage(message: string): Promise<void> {
        const uma = this._userManagerAssignmentRaw;
        if (uma) {
            console.log(message);
            try {
                await this.renewWith(uma.userManager);
            } catch (ignored) {
                await uma.userManager.removeUser();
            }
        }
    }

    private readonly _onUserLoaded = (next: User): void => {
        this._switchUser(next);
    };

    private readonly _onUserUnloaded = (): void => {
        this._switchUser(undefined);
    };

    private _switchUser(next: User | undefined) {
        const current = this._userRaw;
        if (!current && !next) {
            return;
        }
        if (current && next && current.access_token === next.access_token) {
            return;
        }
        console.debug(`User switched`, next);
        this._userRaw = next;
        this._userSubject.next(next);
    }

    get initialized(): Observable<boolean> {
        return concat(of(this._initializedRaw), this._initializedSubject);
    }

    private _modifyExplicitActiveRequests(difference: number) {
        this._explicitActiveRequestsRaw += difference;
        this._explicitActiveRequestsSubject.next(this._explicitActiveRequestsRaw);
    }

    get hasExplicitActiveRequests(): Observable<boolean> {
        return concat(of(this._explicitActiveRequestsRaw), this._explicitActiveRequestsSubject).pipe(map((n) => !!n));
    }
}

interface UserManagerAssignment {
    readonly variant: Variant;
    readonly userManager: UserManager;
    readonly uriPrefix: string;
}
