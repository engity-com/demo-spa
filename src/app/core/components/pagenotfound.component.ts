import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { VariantService } from '../services/variant.service';
import { BasePageComponent } from './base-page.component';

@Component({
    template: `
        <app-messages [description]="false" [variant]="variant">{{ 'pageNotFound.message' | translate }}</app-messages>
    `,
})
export class PageNotFoundComponent extends BasePageComponent {
    constructor(
        title: Title,
        protected readonly translate: TranslateService,
        route: ActivatedRoute,
        variantService: VariantService
    ) {
        super(title, translate, route, variantService);
    }

    protected get titleKey(): string {
        return 'pageNotFound.title';
    }
}
