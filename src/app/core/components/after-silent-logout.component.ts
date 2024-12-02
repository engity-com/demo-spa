import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../services/auth.service';
import { VariantService } from '../services/variant.service';
import { AfterLogoutComponent } from './after-logout.component';
import { MessagesComponent } from './messages.component';

@Component({
    selector: 'app-after-silent-logout',
    template: ` <app-messages [description]="false" [loading]="true">{{ this.messageKey | translate }}</app-messages> `,
    imports: [MessagesComponent, TranslatePipe],
})
export class AfterSilentLogoutComponent extends AfterLogoutComponent {
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
