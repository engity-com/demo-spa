import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'app-messages',
    template: `
        <app-header [description]="description"></app-header>
        <div class="messages">
            <p>
                <ng-content></ng-content>
            </p>
            <p>
                <a [routerLink]="['']">{{ 'backHome' | translate }}</a>
            </p>
        </div>
    `,
    styles: [],
})
export class MessagesComponent {
    @Input()
    public description: boolean = true;

    constructor(public readonly translate: TranslateService) {}
}
