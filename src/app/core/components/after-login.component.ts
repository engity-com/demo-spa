import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../services/auth.service';
import { BasePageComponent } from './base-page.component';

@Component({
    template: `
        <app-messages [description]="false" [variant]="variant">{{
            this.messageKey | translate
        }}</app-messages>
    `,
})
export class AfterLoginComponent extends BasePageComponent implements OnInit {
    messageKey: string = 'finalizeLogin.message';

    constructor(
        title: Title,
        translate: TranslateService,
        private readonly router: Router,
        private readonly authService: AuthService,
        route: ActivatedRoute
    ) {
        super(title, translate, route);
    }

    protected get titleKey(): string {
        return 'finalizeLogin.title';
    }

    async ngOnInit() {
        super.ngOnInit();
        try {
            await this.authService.signinCallback(this.variant);
            await this.router.navigate(['/' + this.variant]);
        } catch (e) {
            console.error('Cannot finalize login.', e);
            this.messageKey = 'finalizeLogin.failed';
            setTimeout(() => {
                this.router.navigate(['/' + this.variant]);
            }, 5000);
        }
    }
}
