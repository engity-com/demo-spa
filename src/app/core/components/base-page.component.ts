import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { Variant } from '../model/model';

@Component({
    template: ``,
})
export abstract class BasePageComponent implements OnInit, OnDestroy {
    private subscriptions: Array<Subscription> = [];
    private _variant: Variant = Variant.default;

    protected constructor(
        private readonly title: Title,
        protected readonly translate: TranslateService,
        protected readonly route: ActivatedRoute
    ) {}

    protected abstract get titleKey(): string;

    ngOnInit(): void {
        const pageTitle = this.translate.get(this.titleKey);
        const mainTitle = this.translate.get('title');
        const title = forkJoin([pageTitle, mainTitle]);
        this.subscribe(title, (values) => {
            this.title.setTitle(`${values[0]} | ${values[1]}`);
        });

        const plainVariant = this.route.snapshot.paramMap.get('variant');
        this._variant = Variant.default;
        for (const v in Variant) {
            if (Variant[v] === plainVariant) {
                this._variant = Variant[v];
                break;
            }
        }
    }

    get variant(): Variant {
        return this._variant;
    }

    protected subscribe<T>(
        subscribable: Observable<T>,
        next: (value: T) => void
    ) {
        this.subscriptions.push(subscribable.subscribe(next));
    }

    public ngOnDestroy(): void {
        this.subscriptions.forEach((v) => {
            v.unsubscribe();
        });
    }
}
