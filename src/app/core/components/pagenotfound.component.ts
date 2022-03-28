import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { BasePageComponent } from './base-page.component';

@Component({
    template: `
        <app-messages [description]="false">{{
            'pageNotFound.message' | translate
        }}</app-messages>
    `,
})
export class PageNotFoundComponent extends BasePageComponent {
    constructor(title: Title, protected readonly translate: TranslateService) {
        super(title, translate);
    }

    protected get titleKey(): string {
        return 'pageNotFound.title';
    }
}
