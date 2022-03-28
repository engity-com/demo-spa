import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin, Observable, Subscription } from 'rxjs';

@Component({
    template: ``,
})
export abstract class BasePageComponent implements OnInit, OnDestroy {
    private subscriptions: Array<Subscription> = [];

    protected constructor(
        private readonly title: Title,
        protected readonly translate: TranslateService
    ) {}

    protected abstract get titleKey(): string;

    ngOnInit(): void {
        const pageTitle = this.translate.get(this.titleKey);
        const mainTitle = this.translate.get('title');
        const title = forkJoin([pageTitle, mainTitle]);
        this.subscribe(title, (values) => {
            this.title.setTitle(`${values[0]} | ${values[1]}`);
        });
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
