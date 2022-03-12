import {Component, OnInit, ViewChild} from "@angular/core";
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
            <div class="control">
                <label for="status">Status</label>
                <ul class="statuses input-like">
                    <li *ngIf="messages.length == 0">...</li>
                    <li *ngFor='let message of messages' class="{{message.isProblem ? 'has-problems' : ''}}">{{message.content}}</li>
                </ul>
            </div>

            <div class="button-bar">
                <button (click)='onLogin()' [disabled]="currentUser" [class]="!currentUser ? 'primary' : ''">Login</button>
                <button (click)='onRenewToken()' [disabled]="!currentUser">Renew Token</button>
                <button (click)='onLogout()' [disabled]="!currentUser">Logout</button>
            </div>

            <div class="horizontal-divider">
                <span>Information</span>
            </div>

            <p>
                For login you can use a demo user with the following credentials:<br>
                <strong>Username</strong>: <code>user1@example.com</code><br>
                <strong>Password</strong>: <code>greatPlaceToBe!</code>
            </p>

            <p>
                Please find the full source code and documentation of this demo
                <a href="https://github.com/engity-com/demo-spa" rel="noopener" target="_blank">here</a>.
            </p>

            <div class="button-bar">
                <button (click)='onShowConsole()' [disabled]="!currentUser && !consoleVisible">Show token JSON (for developers)</button>
            </div>
        </div>
    `,
    styles: [],
})
export class HomeComponent implements OnInit {
    constructor(
        public authService: AuthService,
        public apiService: ApiService,
        private simpleModalService: SimpleModalService) {
    }

    messages: Message[] = [];
    currentUser: User;
    consoleVisible: boolean = false;

    get currentUserJson(): string {
        return JSON.stringify(this.currentUser, null, 2);
    }

    private triggerGetUser(): void {
        this.authService.getUser().then(user => {
            this.currentUser = user;

            if (user) {
                this.addMessage(`Logged In as: ${user.profile['nickname']} (${user.profile['email']})`);
            } else {
                this.addMessage('Not Logged In');
            }
        }).catch(err => this.addError(err));
    }

    ngOnInit(): void {
        this.triggerGetUser();
    }

    clearMessages() {
        while (this.messages.length) {
            this.messages.pop();
        }
    }

    addMessage(msg: string) {
        this.messages.push({ content: msg });
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
            this.addMessage('API Result: ' + JSON.stringify(result));
        }, err => this.addError(err));
    }

    public onRenewToken() {
        console.info('Renewing...');
        this.clearMessages();
        this.authService.renewToken()
            .then(user => {
                this.currentUser = user;
                this.addMessage('Silent Renew Success');
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

    public refresh(): void {
        console.info('Refreshing...');
        this.triggerGetUser();
    }
}

interface Message {
    content: string;
    isProblem?: boolean;
}
