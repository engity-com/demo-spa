import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../services/auth.service';
import { BasePageComponent } from './base-page.component';

@Component({
    template: `
        <app-messages [description]="false">
            <span
                [translate]="this.messageKey"
                [translateParams]="this.messageParams"
            ></span>
        </app-messages>
    `,
})
export class AfterVerifyContactComponent
    extends BasePageComponent
    implements OnInit
{
    messageKey: string;
    messageParams: any;

    constructor(
        private readonly authService: AuthService,
        title: Title,
        protected readonly translate: TranslateService,
        private readonly router: Router,
        private readonly route: ActivatedRoute
    ) {
        super(title, translate);
    }

    protected get titleKey(): string {
        return 'contactVerified.title';
    }

    async ngOnInit() {
        this.subscribe(this.route.queryParams, (params: any) => {
            if (params.contact) {
                if (params['contact-type'] === 'emailAddress') {
                    this.messageKey = 'contactVerified.onEmailAddress';
                } else {
                    this.messageKey = 'contactVerified.onContact';
                }
                this.messageParams = { contact: params.contact };
            } else {
                this.messageKey = 'contactVerified.onContactUnknown';
                this.messageParams = null;
            }
        });

        const user = await this.authService.getUser();
        if (user) {
            console.info(
                'Renew token because now it should contain the updated state of the contact...'
            );
            await this.authService.renewToken();
        }

        setTimeout(() => {
            this.router.navigate(['']);
        }, 10000);
    }
}
