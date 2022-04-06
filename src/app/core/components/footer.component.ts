import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-footer',
    template: `<a
        translate="footer.message"
        href="https://engity.com"
        target="_blank"
    ></a>`,
})
export class FooterComponent {
    constructor(public translate: TranslateService) {}
}
