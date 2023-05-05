import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Variant } from '../services/variant.service';

@Component({
    selector: 'app-messages',
    template: `
        <app-header [description]="description" [variant]="variant"></app-header>
        <div class="messages">
            <p>
                <ng-content></ng-content>
            </p>
            <p>
                <a [routerLink]="['/' + variant.subPath]">{{ 'backHome' | translate }}</a>
            </p>
        </div>
    `,
    styles: [],
})
export class MessagesComponent {
    @Input()
    public description: boolean = true;
    @Input()
    public variant: Variant;

    constructor(public readonly translate: TranslateService) {}
}
