import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { VariantService } from '../services/variant.service';
import { BasePageComponent } from './base-page.component';
import { MessagesComponent } from './messages.component';

@Component({
    template: ` <app-messages [description]="false">{{ 'pageNotFound.message' | translate }}</app-messages> `,
    imports: [MessagesComponent, TranslatePipe],
})
export class PageNotFoundComponent extends BasePageComponent {
    protected titleKey = 'pageNotFound.title';

    constructor(title: Title, translate: TranslateService, variantService: VariantService) {
        super(title, translate, variantService);
    }
}
