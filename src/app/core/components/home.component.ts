import { Component, ElementRef, HostBinding, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { SimpleModalService } from 'ngx-simple-modal';
import { User } from 'oidc-client-ts';
import { firstValueFrom, Observable } from 'rxjs';
import { Contact, ContactState } from '../model/model';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { SettingsService } from '../services/settings.service';
import { BasePageComponent } from './base-page.component';
import { ConsoleComponent } from './console.component';

@Component({
    template: `
        <app-header></app-header>
        <div class="forms">
            <ng-container *ngIf="user">
                <div
                    class="control input-like"
                    [translate]="'messages.loggedIn'"
                    [translateParams]="{
                        user: user?.profile?.nickname,
                        email: user?.profile?.email
                    }"
                ></div>

                <div
                    class="control"
                    *ngIf="toUnverifiedContacts(user) as contacts"
                >
                    <ul class="statuses input-like">
                        <li
                            class="has-problems"
                            *ngFor="let contact of contacts"
                        >
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
                    <li
                        class="has-problems"
                        [translate]="problem.key"
                        [translateParams]="problem.params"
                    ></li>
                </ul>
            </div>

            <div class="button-bar">
                <button
                    (click)="onSignup()"
                    *ngIf="!user"
                    class="primary"
                    translate="signup"
                ></button>
                <button
                    (click)="onLogin()"
                    *ngIf="!user"
                    translate="login"
                ></button>
                <button
                    (click)="onLogout()"
                    *ngIf="user"
                    class="primary"
                    translate="logout"
                ></button>
            </div>

            <ng-container *ngIf="!user">
                <div class="horizontal-divider">
                    <span translate="information.title"></span>
                </div>

                <p>
                    {{ 'information.description' | translate }}:<br />
                    <strong translate="username"></strong>:
                    <code>user1@example.com</code><br />
                    <strong translate="password"></strong>:
                    <code>greatPlaceToBe!</code>
                </p>
            </ng-container>

            <div class="horizontal-divider">
                <span translate="forDevelopers.title"></span>
            </div>

            <p
                *ngIf="developerMode"
                [innerHTML]="'forDevelopers.description' | translate"
            ></p>

            <div class="button-bar">
                <button
                    (click)="onToggleDeveloperMode()"
                    [translate]="
                        developerMode ? 'view.simple' : 'view.enableAdvanced'
                    "
                ></button>
                <button
                    (click)="onShowConsole()"
                    *ngIf="developerMode"
                    [disabled]="!user || consoleVisible"
                    translate="debug.showToken"
                ></button>
                <button
                    (click)="onRenewToken()"
                    *ngIf="developerMode"
                    [disabled]="!user"
                    translate="debug.renewToken"
                ></button>
            </div>
        </div>
    `,
})
export class HomeComponent extends BasePageComponent implements OnInit {
    user: User;
    problem: Message;
    @HostBinding('attr.data-developer-mode')
    developerMode: boolean = false;
    consoleVisible: boolean = false;

    constructor(
        title: Title,
        private readonly authService: AuthService,
        private readonly apiService: ApiService,
        private readonly settingsService: SettingsService,
        private readonly simpleModalService: SimpleModalService,
        private readonly elementRef: ElementRef,
        public readonly translate: TranslateService
    ) {
        super(title, translate);
        this.developerMode =
            this.settingsService.settings['developerMode'] === true;

        this.subscribe(this.authService.user, (user) => {
            this.user = user;
            const element = this.elementRef.nativeElement;
            const document = element.ownerDocument;
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

    public ngOnInit() {
        super.ngOnInit();
        this.authService.updateState();
    }

    protected get titleKey(): string {
        return 'home';
    }

    public toUnverifiedContacts(user: User): Contact[] {
        if (!user) {
            return null;
        }
        const contacts = (user.profile?.contacts as Contact[]).filter(
            (v) => v.state !== ContactState.verified
        );
        return contacts.length > 0 ? contacts : null;
    }

    private clearProblem() {
        this.problem = null;
    }

    private addProblem(key: string, error?: any, params?: any) {
        if (error) {
            console.error(error);
        }
        this.problem = { key: key, params: params };
    }

    public onSignup() {
        this.clearProblem();
        this.authService.signup().catch((err) => {
            this.addProblem('errors.cannotSignup', err);
        });
    }

    public onLogin() {
        this.clearProblem();
        this.authService.login().catch((err) => {
            this.addProblem('errors.cannotLogin', err);
        });
    }

    public onRenewToken() {
        this.clearProblem();
        this.authService
            .renewToken()
            .then(() => {})
            .catch((err) => this.addProblem('errors.cannotRenewToken', err));
    }

    public onLogout() {
        this.clearProblem();
        this.authService
            .logout()
            .catch((err) => this.addProblem('errors.cannotLogout', err));
    }

    public onShowConsole() {
        this.consoleVisible = true;
        this.simpleModalService
            .addModal(ConsoleComponent, {
                content: JSON.stringify(this.user, null, 2),
            })
            .subscribe(() => {
                this.consoleVisible = false;
            });
    }

    public onToggleDeveloperMode() {
        this.developerMode = !this.developerMode;
        this.settingsService.setSetting('developerMode', this.developerMode);
    }

    public onTriggerVerifyContact(contact: Contact) {
        // noinspection JSIgnoredPromiseFromCall
        this.apiService.triggerVerifyContact(contact);
    }
}

interface Message {
    important?: boolean;
    key: string;
    params?: any;
}
