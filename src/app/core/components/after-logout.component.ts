import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { VariantService } from '../services/variant.service';
import { BasePageComponent } from './base-page.component';

@Component({
    template: `
        <app-messages [description]="false" [variant]="variant">{{
            'logout.successful.message' | translate
        }}</app-messages>
    `,
})
export class AfterLogoutComponent extends BasePageComponent implements OnInit {
    constructor(
        title: Title,
        translate: TranslateService,
        private readonly router: Router,
        route: ActivatedRoute,
        variantService: VariantService
    ) {
        super(title, translate, route, variantService);
    }

    protected get titleKey(): string {
        return 'logout.title';
    }

    async ngOnInit() {
        super.ngOnInit();
        setTimeout(() => {
            this.router.navigate(['/' + this.variant.subPath]);
        }, 5000);
    }
}
