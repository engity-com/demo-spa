import { environment as defaultEnvironment } from '@/environments';
import type { Environment, EnvironmentVariant, NamedEnvironmentVariant } from '@/environments';
import type { RouteConfiguration } from '@/lib/routes';
import { Loading } from '@/pages/Loading';
import { UserManager, WebStorageStateStore } from 'oidc-client-ts';
import type React from 'react';
import { useEffect } from 'react';
import { AuthProvider, hasAuthParams, useAuth } from 'react-oidc-context';
import { type Location, Navigate, Outlet, useLocation } from 'react-router';

interface AuthenticationOutletProps {
    readonly environment: Environment;
    readonly variant: NamedEnvironmentVariant;
}

function environmentVariantUriPrefix(environment: Environment, variant: EnvironmentVariant): string {
    if (!variant.subPath) {
        return environment.clientRoot;
    }
    return `${environment.clientRoot}${variant.subPath}/`;
}

function AuthenticationOutlet(props: AuthenticationOutletProps) {
    const auth = useAuth();
    const location = useLocation();

    useEffect(() => {
        if (!hasAuthParams() && !auth.isAuthenticated && !auth.activeNavigator && !auth.isLoading) {
            // Try at first the silent version ensures no flickering for the user
            // in case he still has a valid session at the IdP.
            auth.signinSilent().then((u) => {
                if (u) {
                    console.log('Silent login was successful.');
                    return;
                }

                // If there is no u:User object, this means the silent login was
                // not successful. Now we're trying the redirect login...
                console.log('Silent login was not successful, trying interactive...');
                auth.signinRedirect({
                    state: {
                        // We're preserving the original location to redirect the user back in case it was
                        // successful.
                        location: location,
                    },
                    extraQueryParams: {
                        // This is an optional extra parameter the Engity IdP supports.
                        // The user can click on cancel at the login dialog.
                        cancel_redirect_uri: `${environmentVariantUriPrefix(props.environment, props.variant)}after-cancel`,
                    },
                });
            });
        }
    }, [auth, props, location]);

    if (!auth.isAuthenticated) {
        return <Loading defaultTitle={true} visibilityDelay={2000} />;
    }

    return <Outlet />;
}

interface AuthenticationProps {
    readonly children?: React.ReactNode;
    readonly environment: Environment;
    readonly variant: NamedEnvironmentVariant;
}

function Authentication(props: AuthenticationProps) {
    const prefix = environmentVariantUriPrefix(props.environment, props.variant);
    const store = new WebStorageStateStore({
        prefix: `${props.variant.key}.`,
        store: window.localStorage,
    });

    const um = new UserManager({
        authority: props.variant.stsAuthority,
        client_id: props.variant.clientId,
        stateStore: store,
        userStore: store,
        // ui_locales: this._translateService.currentLang,

        scope: 'openid profile email contacts offline',
        redirect_uri: `${prefix}after-login`,
        silent_redirect_uri: `${prefix}after-silent-login`,

        // As it does not make sense to redirect to this application after redirect,
        // we directly redirect to the homepage of Engity. From there the user can
        // see some content and/or can log in again.
        post_logout_redirect_uri: 'https://engity.com',

        // Ensures to be automatic renew the tokens before it will expire.
        // Note: By default this is already set to `true`; we keep it here just for documentation.
        automaticSilentRenew: true,
    });

    return (
        <AuthProvider userManager={um}>
            <Outlet />
        </AuthProvider>
    );
}

interface CallbackProps {
    readonly environment: Environment;
    readonly variant: NamedEnvironmentVariant;
}

function AfterLogin(props: CallbackProps) {
    if (!hasAuthParams()) {
        return <Navigate to={`/${props.variant.subPath || ''}`} />;
    }

    const auth = useAuth();
    if (auth.isLoading) {
        return <span>Loading...</span>;
    }

    // @ts-ignore
    const location: Location = auth?.user?.state?.location;
    if (!location) {
        return <Navigate to={`/${props.variant.subPath || ''}`} />;
    }

    return <Navigate to={location} />;
}

function AfterCancel() {
    // As it does not make sense to redirect to our application,
    // because it does only work if logged-in, we redirect on cancel
    // to our homepage.
    document.location.href = 'https://engity.com';
    return [];
}

export function authenticationRouteConfigurations(children: RouteConfiguration[], environment?: Environment | undefined): RouteConfiguration[] {
    const env = environment || defaultEnvironment;
    return Object.entries(env.variants)
        .map(
            ([key, v]): NamedEnvironmentVariant => ({
                ...v,
                subPath: v.subPath || '',
                key: key,
            }),
        )
        .map(
            (v): RouteConfiguration => ({
                path: `${v.subPath || ''}`,
                element: <Authentication environment={env} variant={v} />,
                children: [
                    {
                        path: 'after-login',
                        element: <AfterLogin variant={v} environment={env} />,
                    },
                    {
                        path: 'after-cancel',
                        element: <AfterCancel />,
                    },
                    {
                        path: '*',
                        children: children,
                        element: <AuthenticationOutlet variant={v} environment={env} />,
                    },
                ],
            }),
        );
}
