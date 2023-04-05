import { Injectable, OnDestroy } from '@angular/core';
import {
    ErrorResponse,
    OidcMetadata,
    User,
    UserManager,
    WebStorageStateStore,
} from 'oidc-client-ts';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Variant } from '../model/model';

@Injectable({
    providedIn: 'root',
})
export class AuthService implements OnDestroy {
    private readonly userManagers: Record<Variant, UserManagerAssignment>;
    private readonly subject = new Subject<User | null>();

    constructor() {
        this.userManagers = AuthService.createUserManagers(this.subject);
    }

    private static createUserManagers(
        subject: Subject<User | null>
    ): Record<Variant, UserManagerAssignment> {
        // @ts-ignore
        const result: Record<Variant, UserManagerAssignment> = {};
        for (const v in Variant) {
            const variant = Variant[v];
            const authority = environment.authorities[v];
            const uriPrefix = `${environment.clientRoot}${
                variant && variant + '/'
            }`;

            const um = new UserManager({
                authority: authority.stsAuthority,
                client_id: authority.clientId,
                redirect_uri: `${uriPrefix}after-login`,
                silent_redirect_uri: `${uriPrefix}silent-callback.html`,
                post_logout_redirect_uri: `${uriPrefix}`,
                response_type: 'code',
                scope: 'openid profile email',
                userStore: new WebStorageStateStore({
                    prefix: `${variant ? variant + '-' : ''}oidc`,
                    store: window.localStorage,
                }),
            });

            const uma = new UserManagerAssignment(
                um,
                variant,
                subject,
                uriPrefix
            );
            um.events.addAccessTokenExpired(uma.onAccessTokenExpired);
            um.events.addAccessTokenExpiring(uma.onAccessTokenExpiring);
            um.events.addUserLoaded(uma.onUserLoaded);
            um.events.addUserUnloaded(uma.onUserUnloaded);

            result[variant] = uma;
        }
        return result;
    }

    public ngOnDestroy(): void {
        for (const k in this.userManagers) {
            this.userManagers[k].destroy();
        }
    }

    private userManager(of: Variant): UserManagerAssignment {
        const uma = this.userManagers[of];
        if (!uma) {
            throw new Error(`Illegal variant: "${uma}".`);
        }
        return uma;
    }

    metadata(of: Variant): Promise<Partial<OidcMetadata>> {
        return this.userManager(of).metadata;
    }

    get user(): Observable<User | null> {
        return this.subject;
    }

    async updateState(variant: Variant): Promise<void> {
        const user = await this.getUser(variant);
        this.subject.next(user);
    }

    async getUser(variant: Variant): Promise<User | null> {
        return await this.userManager(variant).getUser();
    }

    async login(variant: Variant): Promise<void> {
        return await this.userManager(variant).login();
    }

    async signup(variant: Variant): Promise<void> {
        return await this.userManager(variant).signup();
    }

    async renewToken(variant: Variant): Promise<User | void> {
        return this.userManager(variant).renewToken();
    }

    async logout(variant: Variant): Promise<void> {
        return await this.userManager(variant).logout();
    }

    async signinCallback(variant: Variant): Promise<User | void> {
        return await this.userManager(variant).signinCallback();
    }
}

class UserManagerAssignment {
    constructor(
        public readonly userManager: UserManager,
        public readonly variant: Variant,
        private readonly subject: Subject<User | null>,
        private readonly uriPrefix: string
    ) {}

    get metadata(): Promise<Partial<OidcMetadata>> {
        return this.userManager.metadataService.getMetadata();
    }

    async getUser(): Promise<User | null> {
        return await this.userManager.getUser();
    }

    readonly onAccessTokenExpired = () => {
        console.log(`Current token is expired. Trying renew token...`);
        this.renewToken().catch(() => this.logout());
    };

    readonly onAccessTokenExpiring = () => {
        console.log(`Token will expire soon. Trying renew token...`);
        this.renewToken().catch(() => this.logout());
    };
    readonly onUserLoaded = (user: User) => {
        this.subject.next(user);
    };
    readonly onUserUnloaded = () => {
        this.subject.next(null);
    };

    async renewToken(): Promise<User | void> {
        try {
            return await this.userManager.signinSilent();
        } catch (e) {
            if (e instanceof ErrorResponse && e.error === 'access_denied') {
                console.info(
                    'Looks like that our refresh token is not longer valid. Assuming as logged out.'
                );
                return this.logout();
            }
            throw e;
        }
    }

    async login(): Promise<void> {
        return await this.userManager.signinRedirect({
            extraQueryParams: {
                cancel_redirect_uri: this.uriPrefix,
            },
        });
    }

    async signup(): Promise<void> {
        return await this.userManager.signinRedirect({
            extraQueryParams: {
                procedure: 'signup',
                cancel_redirect_uri: this.uriPrefix,
            },
        });
    }

    async logout(): Promise<void> {
        return await this.userManager.signoutRedirect();
    }

    async signinCallback(): Promise<User | void> {
        return await this.userManager.signinCallback();
    }

    destroy() {
        const um = this.userManager;
        um.events.removeAccessTokenExpired(this.onAccessTokenExpired);
        um.events.removeAccessTokenExpiring(this.onAccessTokenExpiring);
        um.events.removeUserLoaded(this.onUserLoaded);
        um.events.removeUserUnloaded(this.onUserUnloaded);
    }
}
