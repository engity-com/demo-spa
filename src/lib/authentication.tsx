import type { Environment, EnvironmentVariant, NamedEnvironmentVariant } from '@/environments';
import { environment as defaultEnvironment } from '@/environments';
import type { RouteConfiguration } from '@/lib';
import { Loading } from '@/pages';
import { UserManager, WebStorageStateStore } from 'oidc-client-ts';
import type React from 'react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthProvider, hasAuthParams, useAuth } from 'react-oidc-context';
import { type Location, Navigate, Outlet, useLocation } from 'react-router';
import { useTheme } from '../components/page';

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
    const theme = useTheme();

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
                        // These are optional extra parameter the Engity IdP supports.

                        // The user can click on cancel at the login dialog.
                        cancel_redirect_uri: `${environmentVariantUriPrefix(props.environment, props.variant)}after-cancel`,
                        // Take the color scheme (light|dark) with to the login page.
                        color_scheme: theme.mode || 'normal',
                    },
                });
            });
        }
    }, [auth, props, location, theme.mode]);

    if (!auth.isAuthenticated) {
        return <Loading defaultTitle={true} visibilityDelay={true} />;
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
    const { i18n } = useTranslation();

    const um = new UserManager({
        authority: props.variant.stsAuthority,
        client_id: props.variant.clientId,
        stateStore: store,
        userStore: store,

        // Ensures the authentication page also uses our picks.
        ui_locales: i18n?.language,

        scope: 'openid profile email contacts offline',
        redirect_uri: `${prefix}after-login`,
        silent_redirect_uri: `${prefix}after-silent-login`,
        post_logout_redirect_uri: `${prefix}after-logout`,

        // Ensures to be automatic renew the tokens before it will expire.
        // Note: By default this is already set to `true`; we keep it here just for documentation.
        automaticSilentRenew: true,

        // @ts-ignore
        internalVariant: props.variant,
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
        return <Loading defaultTitle={true} visibilityDelay={true} />;
    }

    // @ts-ignore
    const location: Location = auth?.user?.state?.location;
    if (!location) {
        return <Navigate to={`/${props.variant.subPath || ''}`} />;
    }

    return <Navigate to={location} />;
}

function AfterCancelAndLogout(props: CallbackProps) {
    if (props.environment.afterLogoutUrl) {
        // As it does not make sense to redirect to our application,
        // because it does only work if logged-in, we redirect on cancel
        // to our homepage.
        document.location.href = props.environment.afterLogoutUrl;
    }

    // If this property is not as (as on local or green) trigger again the login,
    // by navigating to the root page...
    // This is better for local testing scenarios.
    return <Navigate to={`/${props.variant.subPath || ''}`} />;
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
                        element: <AfterCancelAndLogout variant={v} environment={env} />,
                    },
                    {
                        path: 'after-logout',
                        element: <AfterCancelAndLogout variant={v} environment={env} />,
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
