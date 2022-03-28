import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BasePageComponent } from './base-page.component';

@Component({
    template: `
        <app-messages [description]="false">{{
            'logout.successful.message' | translate
        }}</app-messages>
    `
})
export class AfterLogoutComponent extends BasePageComponent implements OnInit {
    constructor(
        title: Title,
        protected readonly translate: TranslateService,
        private readonly router: Router
    ) {
        super(title, translate);
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
