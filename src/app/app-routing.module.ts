import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {HomeComponent} from './core/components/home.component';
import {SigninCallbackComponent} from './core/components/signin-callback.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'signin-callback', component: SigninCallbackComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    declarations: [],
})
export class AppRoutingModule {
}
