import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { User } from 'oidc-client-ts';
import { firstValueFrom, map, Observable } from 'rxjs';
import { Contact, ContactState } from '../model/model';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { SettingsService } from '../services/settings.service';
import { VariantService } from '../services/variant.service';
import { BasePageComponent } from './base-page.component';

@Component({
    template: `
        <app-header [loading]="authService.hasExplicitActiveRequests | async"></app-header>
        <div class="forms" *ngIf="(authService.initialized | async) && variant | async as variant">
            <ng-container *ngIf="user | async as usr">
                <div
                    class="control input-like"
                    [translate]="
                        !usr?.profile?.nickname || usr?.profile?.nickname === usr?.profile?.email
                            ? 'messages.loggedIn'
                            : 'messages.loggedInWithEmail'
                    "
                    [translateParams]="{
                        user: usr?.profile?.nickname || usr?.profile?.email,
                        email: usr?.profile?.email
                    }"
                ></div>

                <div class="control" *ngIf="unverifiedContacts | async as contacts">
                    <ul class="statuses input-like">
                        <li class="has-problems" *ngFor="let contact of contacts">
                            <span
                                [translate]="
                                    contact.type == 'emailAddress'
                                        ? 'errors.emailAddressNotVerified'
                                        : 'errors.notVerified'
                                "
                                [translateParams]="{ contact: contact }"
                            ></span
                            >&nbsp;<a
                                (click)="onTriggerVerifyContact(contact)"
                                href="#"
                                translate="triggerContactVerificationAgain"
                                [translateParams]="{ contact: contact }"
                            ></a>
                        </li>
                    </ul>
                </div>
            </ng-container>

            <div class="control" *ngIf="problem">
                <label for="status" translate="status"></label>
                <ul class="statuses input-like">
                    <li class="has-problems" [translate]="problem.key" [translateParams]="problem.params"></li>
                </ul>
            </div>

            <div class="button-bar">
                <button
                    (click)="onSignup()"
                    *ngIf="!(user | async) && variant.doesSupportSignup"
                    class="primary"
                    translate="signup.title"
                    [disabled]="authService.hasExplicitActiveRequests | async"
                ></button>
                <button
                    (click)="onLogin()"
                    *ngIf="!(user | async) && variant.doesSupportSignup"
                    translate="login.title"
                    [disabled]="authService.hasExplicitActiveRequests | async"
                ></button>
                <button
                    (click)="onLogin()"
                    *ngIf="!(user | async) && !variant.doesSupportSignup"
                    class="primary"
                    translate="loginOrSignup.title"
                    [disabled]="authService.hasExplicitActiveRequests | async"
                ></button>
                <button
                    (click)="onLogout()"
                    *ngIf="user | async"
                    class="primary"
                    translate="logout.title"
                    [disabled]="authService.hasExplicitActiveRequests | async"
                ></button>
            </div>

            <ng-container *ngIf="!(user | async) && withLoginHint">
                <div class="horizontal-divider">
                    <span translate="information.title"></span>
                </div>

                <p>
                    {{ 'information.description' | translate }}:<br />
                    <strong translate="username"></strong>: <code>user1&#64;example.com</code><br />
                    <strong translate="password"></strong>:
                    <code>greatPlaceToBe!</code>
                </p>
            </ng-container>

            <ng-container>
                <div class="horizontal-divider">
                    <span translate="forDevelopers.title"></span>
                </div>

                <p *ngIf="developerMode" [innerHTML]="'forDevelopers.description' | translate"></p>

                <div class="button-bar">
                    <button
                        (click)="onToggleDeveloperMode()"
                        [translate]="developerMode ? 'view.hide' : 'view.enableAdvanced'"
                    ></button>
                    <button
                        (click)="onShowConsole()"
                        *ngIf="developerMode"
                        [disabled]="!(user | async) || consoleVisible"
                        translate="debug.showToken"
                    ></button>
                    <button
                        (click)="onRenewToken()"
                        *ngIf="developerMode"
                        [disabled]="!(user | async) || (authService.hasExplicitActiveRequests | async)"
                        translate="debug.renewToken"
                    ></button>
                </div>
            </ng-container>
        </div>
        <app-console [visible]="consoleVisible" [content]="consoleContent" (onClose)="onCloseConsole()"></app-console>
    `,
})
export class HomeComponent extends BasePageComponent implements OnInit, OnDestroy {
    protected titleKey = 'home';

    problem: Message;

    @HostBinding('attr.data-developer-mode')
    developerMode: boolean = false;
    consoleVisible: boolean = false;
    consoleContent: string;
    readonly withLoginHint = false;

    constructor(
        title: Title,
        public readonly authService: AuthService,
        private readonly _apiService: ApiService,
        private readonly _settingsService: SettingsService,
        translateService: TranslateService,
        variantService: VariantService,
    ) {
        super(title, translateService, variantService);
        this.developerMode = this._settingsService.settings['developerMode'] === true;

        this._subscribe(this.user, (user) => {
            const html = document.getElementsByTagName('html')[0];
            if (html) {
                if (user) {
                    html.classList.add('logged-in');
                } else {
                    html.classList.remove('logged-in');
                }
            }
        });
    }

    get user(): Observable<User | undefined> {
        return this.authService.user;
    }

    async ngOnInit() {
        await super.ngOnInit();
        await this.authService.initialize();
        window.addEventListener('focus', this._onWindowActivation);
    }

    ngOnDestroy() {
        super.ngOnDestroy();
        window.removeEventListener('focus', this._onWindowActivation);
    }

    private readonly _onWindowActivation = async () => {
        if (document.hidden) {
            // Document is not visible (because another tab is active), so nothing is required to do here...
            return;
        }
        await this._validateContactIfNeeded();
    };

    private async _validateContactIfNeeded() {
        if (!(await firstValueFrom(this.unverifiedContacts))) {
            // All contacts already verified, so nothing is required to do here...
            return;
        }

        // We're triggering a token renew, to ensure that we get the validated state...
        await this.authService.renew();
    }

    get unverifiedContacts(): Observable<Contact[]> {
        return this.user.pipe(
            map((user) => {
                if (!user) {
                    return null;
                }
                const contacts = (user.profile?.contacts as Contact[])?.filter(
                    (v) => v.state !== ContactState.verified,
                );
                return contacts && contacts.length > 0 ? contacts : null;
            }),
        );
    }

    private _clearProblem() {
        this.problem = null;
    }

    private _addProblem(key: string, error?: any, params?: any) {
        if (error) {
            console.error(error);
        }
        this.problem = { key: key, params: params };
    }

    async onSignup() {
        this._clearProblem();
        try {
            await this.authService.login('signup');
        } catch (e) {
            this._addProblem('errors.cannotSignup', e);
        }
    }

    async onLogin() {
        this._clearProblem();
        try {
            await this.authService.login();
        } catch (e) {
            this._addProblem('errors.cannotLogin', e);
        }
    }

    async onRenewToken() {
        this._clearProblem();
        try {
            await this.authService.renew();
        } catch (e) {
            this._addProblem('errors.cannotRenewToken', e);
        }
    }

    async onLogout() {
        this._clearProblem();
        try {
            await this.authService.logout(true);
        } catch (e) {
            this._addProblem('errors.cannotLogout', e);
        }
    }

    async onShowConsole() {
        const user = await firstValueFrom(this.user);
        this.consoleContent = JSON.stringify(user, null, 2);
        this.consoleVisible = true;
    }

    async onCloseConsole() {
        this.consoleVisible = false;
        this.consoleContent = '';
    }

    async onToggleDeveloperMode() {
        this.developerMode = !this.developerMode;
        this._settingsService.setSetting('developerMode', this.developerMode);
    }

    async onTriggerVerifyContact(contact: Contact) {
        await this._apiService.triggerVerifyContact(contact);
    }
}

interface Message {
    important?: boolean;
    key: string;
    params?: any;
}
