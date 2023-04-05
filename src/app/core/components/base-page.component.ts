import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { Variant, VariantService } from '../services/variant.service';

@Component({
    template: ``,
})
export abstract class BasePageComponent implements OnInit, OnDestroy {
    private subscriptions: Array<Subscription> = [];
    private _variant: Variant | undefined = undefined;

    protected constructor(
        private readonly title: Title,
        protected readonly translate: TranslateService,
        protected readonly route: ActivatedRoute,
        private readonly variantService: VariantService
    ) {}

    protected abstract get titleKey(): string;

    ngOnInit(): void {
        this._variant = this.variantService.findBySubPath(this.variantSubPath);
        const pageTitle = this.translate.get(this.titleKey);
        const mainTitle = this.translate.get(`title.${this._variant.key}`);
        const title = forkJoin([pageTitle, mainTitle]);
        this.subscribe(title, (values) => {
            this.title.setTitle(`${values[0]} | ${values[1]}`);
        });
    }

    private get variantSubPath() {
        return this.route.snapshot.paramMap.get('variant');
    }

    get variant(): Variant {
        return this._variant;
    }

    protected subscribe<T>(subscribable: Observable<T>, next: (value: T) => void) {
        this.subscriptions.push(subscribable.subscribe(next));
    }

    public ngOnDestroy(): void {
        this.subscriptions.forEach((v) => {
            v.unsubscribe();
        });
    }
}
