import { environment as defaultEnvironment } from '@/environments/environment';
import type { Environment, EnvironmentVariant, NamedEnvironmentVariant } from '@/environments/type';
import { UserManager, WebStorageStateStore } from 'oidc-client-ts';
import React, { useEffect, useState } from 'react';
import { AuthProvider, hasAuthParams, useAuth } from 'react-oidc-context';
import { type Location, Navigate, Outlet, useLocation } from 'react-router';
import type { RouteConfiguration } from './routes';

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
    const [hasTriedSignin, setHasTriedSignin] = useState(false);

    useEffect(() => {
        if (!hasAuthParams() && !auth.isAuthenticated && !auth.activeNavigator && !auth.isLoading && !hasTriedSignin) {
            auth.signinSilent().then((u) => {
                if (u) {
                    console.log('Silent login was successful.');
                    return;
                }

                console.log('Silent login was not successful, trying interactive...');
                auth.signinRedirect({
                    prompt: 'login',
                    state: { location: location },
                    extraQueryParams: {
                        cancel_redirect_uri: environmentVariantUriPrefix(props.environment, props.variant),
                    },
                });
            });
            setHasTriedSignin(true);
        }
    }, [auth, hasTriedSignin, props, location]);

    React.useEffect(() => {
        return auth.events.addAccessTokenExpiring(() => {
            auth.signinSilent();
        });
    }, [auth.events, auth.signinSilent]);

    switch (auth.activeNavigator) {
        case 'signinSilent':
            return <div>Signing you in...</div>;
        case 'signoutRedirect':
            return <div>Signing you out...</div>;
    }

    if (!auth.isAuthenticated) {
        return <div>Not authorized</div>;
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
        prefix: props.variant.key !== 'default' ? `${props.variant}.` : '',
        store: window.localStorage,
    });

    const um = new UserManager({
        authority: props.variant.stsAuthority,
        client_id: props.variant.clientId,
        redirect_uri: `${prefix}after-login`,
        silent_redirect_uri: `${prefix}after-silent-login`,
        response_type: 'code',
        silentRequestTimeoutInSeconds: 5000,
        scope: 'openid profile email contacts offline',
        userStore: store,
        // ui_locales: this._translateService.currentLang,
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

function AfterLogout(props: CallbackProps) {
    const auth = useAuth();
    if (auth.isLoading) {
        return <span>Loading...</span>;
    }

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
                        path: 'after-logout',
                        element: <AfterLogout variant={v} environment={env} />,
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
