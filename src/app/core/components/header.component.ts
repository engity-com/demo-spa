import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Variant } from '../services/variant.service';

@Component({
    selector: 'app-header',
    template: `
        <header>
            <img src="/logo.svg" alt="Logo" height="96" />
            <h1>{{ variant.translate('title') | async }}</h1>
            <p *ngIf="description">
                {{ variant.translate('description') | async }}
            </p>
        </header>
    `,
})
export class HeaderComponent {
    constructor(public readonly translate: TranslateService) {}

    @Input()
    description: boolean = true;

    @Input()
    variant: Variant;
}
