import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BasePageComponent } from './base-page.component';

@Component({
    template: `
        <app-messages [description]="false">{{
            'logout.successful.message' | translate
        }}</app-messages>
    `,
})
export class AfterLogoutComponent extends BasePageComponent implements OnInit {
    constructor(
        title: Title,
        translate: TranslateService,
        private readonly router: Router,
        route: ActivatedRoute
    ) {
        super(title, translate, route);
    }

    protected get titleKey(): string {
        return 'logout.title';
    }

    async ngOnInit() {
        setTimeout(() => {
            this.router.navigate(['']);
        }, 5000);
    }
}
