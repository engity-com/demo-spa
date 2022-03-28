import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { SimpleModalModule } from 'ngx-simple-modal';
import { AppRoutingModule } from './app-routing.module';
import {
    AfterLoginComponent,
    AfterLogoutComponent,
    AfterVerifyContactComponent,
    AfterVerifyContactFailedComponent,
    AppComponent,
    ConsoleComponent,
    HeaderComponent,
    HomeComponent,
    MessagesComponent,
    PageNotFoundComponent,
} from './core/components';
import { AppTranslateLoader } from './core/i18n';

@NgModule({
    declarations: [
        AppComponent,
        ConsoleComponent,
        HomeComponent,
        HeaderComponent,
        MessagesComponent,
        PageNotFoundComponent,
        AfterLoginComponent,
        AfterLogoutComponent,
        AfterVerifyContactComponent,
        AfterVerifyContactFailedComponent,
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        SimpleModalModule.forRoot({ container: document.body }),
        TranslateModule.forRoot({
            loader: { provide: TranslateLoader, useClass: AppTranslateLoader },
        }),
    ],
    entryComponents: [ConsoleComponent],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
