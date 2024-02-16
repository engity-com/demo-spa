import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom, forkJoin, Observable, Subscription } from 'rxjs';
import { Variant, VariantService } from '../services/variant.service';

@Component({
    template: ``,
})
export abstract class BasePageComponent implements OnInit, OnDestroy {
    private _subscriptions: Array<Subscription> = [];

    protected constructor(
        public readonly title: Title,
        public readonly translate: TranslateService,
        public readonly variantService: VariantService,
    ) {}

    protected abstract get titleKey(): string;

    get variant(): Observable<Variant> {
        return this.variantService.active;
    }

    async ngOnInit() {
        const variant = await firstValueFrom(this.variant);
        const pageTitle = this.translate.get(this.titleKey);
        const mainTitle = this.translate.get(`title.${variant.key}`);
        const title = forkJoin([pageTitle, mainTitle]);
        this._subscribe(title, (values) => {
            this.title.setTitle(`${values[0]} | ${values[1]}`);
        });
    }

    protected _subscribe<T>(subscribable: Observable<T>, next: (value: T) => void) {
        this._subscriptions.push(subscribable.subscribe(next));
    }

    ngOnDestroy(): void {
        this._subscriptions.forEach((v) => {
            v.unsubscribe();
        });
    }
}
