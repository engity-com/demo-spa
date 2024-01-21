import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { VariantService } from '../services/variant.service';
import { BasePageComponent } from './base-page.component';

@Component({
    selector: 'app-after-logout',
    template: ` <app-messages [description]="false" [loading]="true">{{ this.messageKey | translate }}</app-messages> `,
})
export class AfterLogoutComponent extends BasePageComponent implements OnInit {
    readonly messageKey: string = 'logout.successful.message';
    silent: boolean = false;

    constructor(
        title: Title,
        translate: TranslateService,
        private readonly _router: Router,
        private readonly _authService: AuthService,
        variantService: VariantService,
    ) {
        super(title, translate, variantService);
    }

    protected get titleKey(): string {
        return 'logout.title';
    }

    async ngOnInit() {
        await super.ngOnInit();
        const variant = await firstValueFrom(this.variant);
        await this._authService.logoutCallback(this.silent);
        await this._router.navigate(['/' + variant.subPath]);
    }
}
