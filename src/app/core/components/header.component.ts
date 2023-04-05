import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { translateVariantAware, Variant } from '../model/model';

@Component({
    selector: 'app-header',
    template: `
        <header>
            <img src="/logo.svg" alt="Logo" height="96" />
            <h1>{{ translateVariantAware('title') | async }}</h1>
            <p *ngIf="description">
                {{ translateVariantAware('description') | async }}
            </p>
        </header>
    `,
})
export class HeaderComponent {
    constructor(public readonly translate: TranslateService) {}

    @Input()
    description: boolean = true;

    @Input()
    variant: Variant = Variant.default;

    protected translateVariantAware(key: string): Observable<any> {
        return translateVariantAware(this.translate, key, this.variant);
    }
}
