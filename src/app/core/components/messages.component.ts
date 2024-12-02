import { AsyncPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { Variant, VariantService } from '../services/variant.service';
import { HeaderComponent } from './header.component';

@Component({
    selector: 'app-messages',
    template: `
        <app-header [description]="description" [loading]="loading"></app-header>
        <div class="messages">
            <p>
                <ng-content></ng-content>
            </p>
            <p>
                <a [routerLink]="['/' + (variant | async).subPath]">{{ 'backHome' | translate }}</a>
            </p>
        </div>
    `,
    styles: [],
    imports: [HeaderComponent, RouterLink, AsyncPipe, TranslatePipe],
})
export class MessagesComponent {
    @Input()
    public description: boolean = true;

    @Input()
    public loading: boolean = false;

    constructor(private readonly _variantService: VariantService) {}

    get variant(): Observable<Variant> {
        return this._variantService.active;
    }
}
