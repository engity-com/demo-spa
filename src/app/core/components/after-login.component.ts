import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../services/auth.service';
import { BasePageComponent } from './base-page.component';

@Component({
    selector: 'app-after-login',
    template: `
        <app-messages [description]="false">{{
            this.messageKey | translate
        }}</app-messages>
    `,
})
export class AfterLoginComponent extends BasePageComponent implements OnInit {
    messageKey: string = 'finalizeLogin.message';

    constructor(
        title: Title,
        protected readonly translate: TranslateService,
        private readonly router: Router,
        private readonly authService: AuthService
    ) {
        super(title, translate);
    }

    protected get titleKey(): string {
        return 'finalizeLogin.title';
    }

    async ngOnInit() {
        try {
            await this.authService.signinCallback();
            await this.router.navigate(['']);
        } catch (e) {
            console.log('Cannot finalize login.', e);
            this.messageKey = 'finalizeLogin.failed';
            setTimeout(() => {
                this.router.navigate(['']);
            }, 5000);
        }
    }
}
