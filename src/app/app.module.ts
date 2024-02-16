import { HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { AppRoutingModule } from './app-routing.module';
import {
    AfterLoginComponent,
    AfterLogoutComponent,
    AfterSilentLoginComponent,
    AfterSilentLogoutComponent,
    AppComponent,
    ConsoleComponent,
    FooterComponent,
    HeaderComponent,
    HomeComponent,
    MessagesComponent,
    PageNotFoundComponent,
    SpinnerComponent,
} from './core/components';
import { AppTranslateLoader } from './core/i18n';

class NgErrorHandler implements ErrorHandler {
    handleError(error) {
        let foo = 'bar';
        if (
            unloaded &&
            ((!error?.rejection && error?.message === 'Failed to fetch') ||
                error?.rejection?.message === 'Failed to fetch')
        ) {
            // Fetch error after unloading the window could happen is will be silently ignored.
        } else {
            console.error(error, {
                unloaded: unloaded,
                rejection: error?.rejection,
                message: error?.rejection?.message,
                foo: foo,
            });
        }
    }
}

@NgModule({
    declarations: [
        AppComponent,
        ConsoleComponent,
        HomeComponent,
        HeaderComponent,
        FooterComponent,
        MessagesComponent,
        PageNotFoundComponent,
        SpinnerComponent,
        AfterLoginComponent,
        AfterSilentLoginComponent,
        AfterLogoutComponent,
        AfterSilentLogoutComponent,
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        TranslateModule.forRoot({
            loader: { provide: TranslateLoader, useClass: AppTranslateLoader },
        }),
    ],
    providers: [{ provide: ErrorHandler, useClass: NgErrorHandler }],
    bootstrap: [AppComponent, FooterComponent],
})
export class AppModule {}

let unloaded = false;
window.addEventListener('unload', () => (unloaded = true));
