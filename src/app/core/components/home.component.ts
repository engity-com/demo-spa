import {AfterViewInit, Component, ElementRef, HostBinding, OnChanges, OnInit, SimpleChanges, ViewChild} from "@angular/core";
import {SimpleModalService} from 'ngx-simple-modal';
import {User} from 'oidc-client-ts';
import {AuthService} from "../services/auth.service";
import {ApiService} from '../services/api.service';
import {ConsoleComponent} from './console.component';

@Component({
    selector: "app-home",
    template: `
        <header>
            <img src='/logo.svg' alt="Logo" height="96" />
            <h1>Engity IdP Demo</h1>
            <p>This pages demonstrates the power of a <a href="https://en.wikipedia.org/wiki/Single-page_application" rel="noopener" target="_blank">Single Page Application</a>
               together with our <a href="https://engity.com" target="_blank">Engity IdP.</a></p>

        </header>
        <div class="forms">
            <div class="control" *ngIf="hasAtLeastOneImportantMessage || developerMode">
                <label for="status">Status</label>
                <ul class="statuses input-like">
                    <li *ngIf="messages.length == 0">...</li>
                    <li *ngFor='let message of messages' class="{{message.isProblem ? 'has-problems' : ''}}">{{message.content}}</li>
                </ul>
            </div>

            <div class="button-bar">
                <button (click)='onLogin()' *ngIf="!currentUser" class="primary">Login</button>
                <button (click)='onLogout()' *ngIf="currentUser" class="primary">Logout</button>
            </div>

            <ng-container *ngIf="!currentUser">
                <div class="horizontal-divider">
                    <span>Information</span>
                </div>

                <p>
                    For login you can use a demo user with the following credentials:<br>
                    <strong>Username</strong>: <code>user1@example.com</code><br>
                    <strong>Password</strong>: <code>greatPlaceToBe!</code>
                </p>
            </ng-container>

            <div class="horizontal-divider">
                <span>For developers</span>
            </div>

            <p *ngIf="developerMode">
                Please find the full source code and documentation of this demo
                <a href="https://github.com/engity-com/demo-spa" rel="noopener" target="_blank">here</a>.
            </p>

            <div class="button-bar">
                <button (click)='onToggleDeveloperMode()'>{{developerMode ? "Simple View" : "Enable Advanced View" }}</button>
                <button (click)='onShowConsole()' *ngIf="developerMode" [disabled]="!currentUser || consoleVisible">Show Token</button>
                <button (click)='onRenewToken()' *ngIf="developerMode" [disabled]="!currentUser">Renew Token</button>
            </div>
        </div>
    `,
    styles: [],
})
export class HomeComponent implements OnInit {
    constructor(
        public authService: AuthService,
        public apiService: ApiService,
        private simpleModalService: SimpleModalService,
        private elementRef: ElementRef,
    ) {
    }

    messages: Message[] = [];
    currentUser: User;
    @HostBinding('attr.data-developer-mode')
    developerMode: boolean = false;
    consoleVisible: boolean = false;

    get currentUserJson(): string {
        return JSON.stringify(this.currentUser, null, 2);
    }

    private triggerGetUser(): void {
        this.authService.getUser().then(user => {
            this.currentUser = user;
            this.ensureHtmlElementState(user);
            if (user) {
                this.messages.push({ content: `Logged In as: ${user.profile['nickname']} (${user.profile['email']})` });
            } else {
                this.messages.push({ important: false, content: 'Not Logged In' });
            }
        }).catch(err => this.addError(err));
    }

    ngOnInit(): void {
        this.triggerGetUser();
    }

    private ensureHtmlElementState(user: User): void {
        const html = this.elementRef.nativeElement.ownerDocument.getElementsByTagName("html")[0];
        if (html) {
            if (user) {
                html.classList.add("logged-in");
            } else {
                html.classList.remove("logged-in");
            }
        }
    }

    clearMessages() {
        while (this.messages.length) {
            this.messages.pop();
        }
    }

    get hasAtLeastOneImportantMessage(): boolean {
        return this.messages
            .filter(candidate => candidate.important == null || candidate.important === true)
            .length > 0;
    }

    addError(msg: string | any) {
        this.messages.push({ content: msg, isProblem: true });
    }

    public onLogin() {
        console.info('Logging in...');
        this.clearMessages();
        this.authService.login().catch(err => {
            this.addError(err);
        });
    }

    public onCallAPI() {
        this.clearMessages();
        this.apiService.callApi().then(result => {
            this.messages.push({ content: `API Result: ${JSON.stringify(result)}` });
        }, err => this.addError(err));
    }

    public onRenewToken() {
        console.info('Renewing...');
        this.clearMessages();
        this.authService.renewToken()
            .then(user => {
                this.currentUser = user;
                this.ensureHtmlElementState(user);
                this.messages.push({ content: 'Silent Renew Success' });
            })
            .catch(err => this.addError(err));
    }

    public onLogout() {
        console.info('Logging out...');
        this.clearMessages();
        this.authService.logout().catch(err => this.addError(err));
    }

    public onShowConsole() {
        this.consoleVisible = true;
        this.simpleModalService.addModal(ConsoleComponent, {
            content: this.currentUserJson,
        }).subscribe(() => {
            this.consoleVisible = false;
        });
    }

    public onToggleDeveloperMode() {
        this.developerMode = !this.developerMode;
    }

    public refresh(): void {
        console.info('Refreshing...');
        this.triggerGetUser();
    }
}

interface Message {
    important?: boolean;
    content: string;
    isProblem?: boolean;
}
