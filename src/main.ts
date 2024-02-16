import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
    enableProdMode();
}

platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch((err) => console.error('DOH!', err));

window.addEventListener('unhandledrejection', (e) => {
    console.error('DOH1!', e.reason);
});
window.addEventListener('error', (e) => {
    console.error('DOH2!', e);
});
