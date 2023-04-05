import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BasePageComponent } from './base-page.component';

@Component({
    template: `
        <app-messages [description]="false" [variant]="variant">{{
            'pageNotFound.message' | translate
        }}</app-messages>
    `,
})
export class PageNotFoundComponent extends BasePageComponent {
    constructor(
        title: Title,
        protected readonly translate: TranslateService,
        route: ActivatedRoute
    ) {
        super(title, translate, route);
    }

    protected get titleKey(): string {
        return 'pageNotFound.title';
    }
}
