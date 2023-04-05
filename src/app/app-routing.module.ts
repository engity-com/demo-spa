import { inject, NgModule } from '@angular/core';
import { CanMatchFn, Route, RouterModule, Routes, UrlSegment } from '@angular/router';
import { AfterLoginComponent, AfterLogoutComponent, HomeComponent, PageNotFoundComponent } from './core/components';
import { VariantService } from './core/services/variant.service';

const base: Routes = [
    { path: 'after-login', component: AfterLoginComponent },
    { path: 'after-logout', component: AfterLogoutComponent },
    { path: 'after-signup', component: AfterLoginComponent },
    { path: '', component: HomeComponent },
    { path: '**', pathMatch: 'full', component: PageNotFoundComponent },
];

const variantMatcher: CanMatchFn = (route: Route, segments: UrlSegment[]) => {
    if (segments.length < 1) {
        return false;
    }
    const variantService = inject(VariantService);
    const variant = variantService.findBySubPath(segments[0].path);
    return !!variant;
};

export const routes: Routes = [
    { path: ':variant', children: base, canMatch: [variantMatcher] },
    { path: '', children: base },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    declarations: [],
})
export class AppRoutingModule {}
