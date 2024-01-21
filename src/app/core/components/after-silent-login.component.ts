import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../services/auth.service';
import { VariantService } from '../services/variant.service';
import { AfterLoginComponent } from './after-login.component';

@Component({
    selector: 'app-after-silent-login',
    template: ` <app-messages [description]="false" [loading]="true">{{ this.messageKey | translate }}</app-messages> `,
})
export class AfterSilentLoginComponent extends AfterLoginComponent {
    constructor(
        title: Title,
        translate: TranslateService,
        router: Router,
        authService: AuthService,
        variantService: VariantService,
    ) {
        super(title, translate, router, authService, variantService);
        this.silent = true;
    }
}
