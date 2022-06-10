import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
    AfterLoginComponent,
    AfterLogoutComponent,
    HomeComponent,
    PageNotFoundComponent,
} from './core/components';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'after-login', component: AfterLoginComponent },
    { path: 'after-logout', component: AfterLogoutComponent },
    { path: 'after-signup', component: AfterLoginComponent },
    { path: '**', pathMatch: 'full', component: PageNotFoundComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    declarations: [],
})
export class AppRoutingModule {}
