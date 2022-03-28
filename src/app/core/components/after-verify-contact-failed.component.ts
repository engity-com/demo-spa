import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
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
export class AfterVerifyContactFailedComponent
    extends BasePageComponent
    implements OnInit
{
    messageKey: string;
    messageParams: any;

    constructor(
        title: Title,
        protected readonly translate: TranslateService,
        private readonly router: Router,
        private readonly route: ActivatedRoute
    ) {
        super(title, translate);
    }

    protected get titleKey(): string {
        return 'contactVerifiedFailed.title';
    }

    async ngOnInit() {
        this.subscribe(this.route.queryParams, (params: any) => {
            if (params.contact) {
                if (params['contact-type'] === 'emailAddress') {
                    this.messageKey = 'contactVerifiedFailed.onEmailAddress';
                } else {
                    this.messageKey = 'contactVerifiedFailed.onContact';
                }
                this.messageParams = { contact: params.contact };
            } else {
                this.messageKey = 'contactVerifiedFailed.onContactUnknown';
                this.messageParams = null;
            }
        });

        setTimeout(() => {
            this.router.navigate(['']);
        }, 10000);
    }
}
