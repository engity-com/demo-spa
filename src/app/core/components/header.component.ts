import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Variant, VariantService } from '../services/variant.service';

@Component({
    selector: 'app-header',
    template: `
        <header>
            <app-spinner *ngIf="loading" />
            <img *ngIf="!loading" src="/logo.svg" alt="Logo" height="96" />
            <h1>{{ (this.variant | async)?.translate('title') | async }}</h1>
            <p *ngIf="description">
                {{ (this.variant | async)?.translate('description') | async }}
            </p>
        </header>
    `,
})
export class HeaderComponent {
    constructor(private readonly _variantService: VariantService) {}

    @Input()
    description: boolean = true;

    @Input()
    loading: boolean = false;

    get variant(): Observable<Variant> {
        return this._variantService.active;
    }
}
