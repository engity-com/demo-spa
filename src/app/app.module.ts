import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { SimpleModalModule } from 'ngx-simple-modal';
import { AppRoutingModule } from './app-routing.module';
import {
    AfterLoginComponent,
    AfterLogoutComponent,
    AppComponent,
    ConsoleComponent,
    FooterComponent,
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
        FooterComponent,
        MessagesComponent,
        PageNotFoundComponent,
        AfterLoginComponent,
        AfterLogoutComponent,
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
    bootstrap: [AppComponent, FooterComponent],
})
export class AppModule {}
