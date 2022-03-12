import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {SimpleModalModule} from 'ngx-simple-modal';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './core/components/app.component';
import {ConsoleComponent} from './core/components/console.component';
import {HomeComponent} from './core/components/home.component';
import {SigninCallbackComponent} from './core/components/signin-callback.component';

@NgModule({
    declarations: [
        AppComponent,
        ConsoleComponent,
        HomeComponent,
        SigninCallbackComponent,
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        SimpleModalModule.forRoot({container:document.body}),
    ],
    entryComponents: [
        ConsoleComponent
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {
}
