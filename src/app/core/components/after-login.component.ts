import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { VariantService } from '../services/variant.service';
import { BasePageComponent } from './base-page.component';
import { MessagesComponent } from './messages.component';

@Component({
    selector: 'app-after-login',
    template: ` <app-messages [description]="false" [loading]="true">{{ this.messageKey | translate }}</app-messages> `,
    imports: [MessagesComponent, TranslatePipe],
})
export class AfterLoginComponent extends BasePageComponent implements OnInit {
    messageKey: string = 'finalizeLogin.message';
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
        return 'finalizeLogin.title';
    }

    async ngOnInit() {
        await super.ngOnInit();
        if (!this.silent) {
            await this._authService.initialize();
        }

        const variant = await firstValueFrom(this.variant);
        try {
            await this._authService.loginCallback(this.silent);
            await this._router.navigate(['/' + variant.subPath]);
        } catch (e) {
            console.error('Cannot finalize login.', e);
            this.messageKey = 'finalizeLogin.failed';
            setTimeout(() => {
                this._router.navigate(['/' + variant.subPath]);
            }, 5000);
        }
    }
}
