import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../services/auth.service';
import { BasePageComponent } from './base-page.component';

@Component({
    template: `
        <app-header [description]="true"></app-header>
        <div class="forms">
            <p>
                <span translate="passwordReset.message"></span>
            </p>
            <div class="button-bar">
                <button
                    (click)="onLogin()"
                    class="primary"
                    translate="login"
                ></button>
            </div>
        </div>
    `,
})
export class AfterPasswordResetComponent
    extends BasePageComponent
    implements OnInit
{
    constructor(
        private readonly authService: AuthService,
        title: Title,
        protected readonly translate: TranslateService
    ) {
        super(title, translate);
    }

    protected get titleKey(): string {
        return 'passwordReset.title';
    }

    public onLogin() {
        this.authService.login();
    }
}
