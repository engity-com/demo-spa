import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';

@Component({
    selector: 'app-console',
    template: `
        <div>
            <pre class="content">{{ content }}</pre>
            <div class="button-bar">
                <button (click)="close()">{{ 'close' | translate }}</button>
            </div>
        </div>
    `,
    styles: [
        `
            :host > div {
                display: flex;
                flex-flow: column;
            }

            :host {
                top: 0;
                left: 0;
                bottom: 0;
                right: 0;
                background: white;
                position: fixed;
                overflow: auto;
                margin: 0;
                padding: 2em;
                display: none;
                visibility: hidden;
            }

            :host.visible {
                display: block;
                visibility: visible;
            }

            pre {
                white-space: pre-wrap;
                word-wrap: break-word;
            }
        `,
    ],
})
export class ConsoleComponent implements ConsoleModel {
    @Input()
    @HostBinding('class.visible')
    visible: boolean;
    @Input()
    content: string;
    @Output()
    onClose: EventEmitter<void> = new EventEmitter<void>();

    constructor() {}

    close() {
        this.onClose.emit();
    }
}

export interface ConsoleModel {
    content: string;
}
