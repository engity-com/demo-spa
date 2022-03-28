import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'app-header',
    template: `
        <header>
            <img src="/logo.svg" alt="Logo" height="96" />
            <h1>{{ 'title' | translate }}</h1>
            <p *ngIf="description">{{ 'description' | translate }}</p>
        </header>
    `,
})
export class HeaderComponent {
    constructor(public readonly translate: TranslateService) {}

    @Input()
    public description: boolean = true;
}
