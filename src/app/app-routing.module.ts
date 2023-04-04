import { NgModule } from '@angular/core';
import {
    CanMatchFn,
    Route,
    RouterModule,
    Routes,
    UrlSegment,
} from '@angular/router';
import {
    AfterLoginComponent,
    AfterLogoutComponent,
    HomeComponent,
    PageNotFoundComponent,
} from './core/components';
import { Variant } from './core/model/model';

const base: Routes = [
    { path: 'after-login', component: AfterLoginComponent },
    { path: 'after-logout', component: AfterLogoutComponent },
    { path: 'after-signup', component: AfterLoginComponent },
    { path: '', component: HomeComponent },
];

const variantMatcher: CanMatchFn = (route: Route, segments: UrlSegment[]) => {
    if (segments.length < 1) {
        return false;
    }
    for (const v in Variant) {
        if (Variant[v] === segments[0].path) {
            return true;
        }
    }
    return false;
};

export const routes: Routes = [
    { path: ':variant', children: base, canMatch: [variantMatcher] },
    { path: '', children: base },
    { path: '**', pathMatch: 'full', component: PageNotFoundComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    declarations: [],
})
export class AppRoutingModule {}
