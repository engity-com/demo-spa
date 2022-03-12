import {Component} from '@angular/core';
import {SimpleModalComponent} from 'ngx-simple-modal';

export interface ConsoleModel {
    content: string;
}

@Component({
    selector: "app-console",
    template: `
        <div>
            <pre class="content">{{content}}</pre>
            <div class="button-bar">
                <button (click)='close()'>Close</button>
            </div>
        </div>
    `,
    styles: [`
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
        }
        pre {
            white-space: pre-wrap;
            word-wrap: break-word;
        }
    `],
})
export class ConsoleComponent extends SimpleModalComponent<ConsoleModel, boolean> implements ConsoleModel {

    content: string;

    confirm() {
        this.result = true;
        // noinspection JSIgnoredPromiseFromCall
        this.close();
    }
}
