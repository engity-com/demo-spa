import { Injectable, OnDestroy } from '@angular/core';
import {
    OidcMetadata,
    User,
    UserManager,
    WebStorageStateStore,
} from 'oidc-client-ts';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class AuthService implements OnDestroy {
    private readonly userManager: UserManager;
    private readonly subject = new Subject<User | null>();

    constructor() {
        this.userManager = new UserManager({
            authority: environment.stsAuthority,
            client_id: environment.clientId,
            redirect_uri: `${environment.clientRoot}after-login`,
            silent_redirect_uri: `${environment.clientRoot}silent-callback.html`,
            post_logout_redirect_uri: `${environment.clientRoot}`,
            response_type: 'code',
            scope: 'openid profile email',
            userStore: new WebStorageStateStore({ store: window.localStorage }),
        });
        this.userManager.events.addAccessTokenExpired(
            this.onAccessTokenExpired
        );
        this.userManager.events.addAccessTokenExpiring(
            this.onAccessTokenExpiring
        );
        this.userManager.events.addUserLoaded(this.onUserLoaded);
        this.userManager.events.addUserUnloaded(this.onUserUnloaded);
    }

    public ngOnDestroy(): void {
        this.userManager.events.removeAccessTokenExpired(
            this.onAccessTokenExpired
        );
        this.userManager.events.removeAccessTokenExpiring(
            this.onAccessTokenExpiring
        );
        this.userManager.events.removeUserLoaded(this.onUserLoaded);
        this.userManager.events.removeUserUnloaded(this.onUserUnloaded);
    }

    public get metadata(): Promise<Partial<OidcMetadata>> {
        return this.userManager.metadataService.getMetadata();
    }

    public get user(): Observable<User | null> {
        return this.subject;
    }

    private readonly onAccessTokenExpired = () => {
        console.log(`Current token is expired. Trying renew token...`);
        this.renewToken();
    };

    private readonly onAccessTokenExpiring = () => {
        console.log(`Token will expire soon. Trying renew token...`);
        this.renewToken();
    };
    private readonly onUserLoaded = (user: User) => {
        this.subject.next(user);
    };
    private readonly onUserUnloaded = () => {
        this.subject.next(null);
    };

    public updateState() {
        this.getUser().then((user) => {
            this.subject.next(user);
        });
    }

    public getUser(): Promise<User | null> {
        return this.userManager.getUser();
    }

    public login(): Promise<void> {
        return this.userManager.signinRedirect({
            extraQueryParams: {
                cancel_redirect_uri: environment.clientRoot,
            },
        });
    }

    public signup(): Promise<void> {
        return this.userManager.signinRedirect({
            extraQueryParams: {
                procedure: 'signup',
                cancel_redirect_uri: environment.clientRoot,
            },
        });
    }

    public renewToken(): Promise<User> {
        return this.userManager.signinSilent();
    }

    public logout(): Promise<void> {
        return this.userManager.signoutRedirect();
    }

    public signinCallback(): Promise<void | User> {
        return this.userManager.signinCallback();
    }
}
