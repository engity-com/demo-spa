import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-root',
    template: ` <router-outlet></router-outlet>`,
    imports: [RouterOutlet],
})
export class AppComponent {
    constructor(translate: TranslateService) {
        translate.addLangs(['en', 'de']);
        translate.setDefaultLang('en');

        const browserLang = translate.getBrowserLang();
        translate.use(browserLang.match(/en|de/) ? browserLang : 'en');
    }
}
