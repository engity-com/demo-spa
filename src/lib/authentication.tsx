import { useTheme } from '@/components/page';
import type { Environment, EnvironmentVariant, NamedEnvironmentVariant } from '@/environments';
import { environment as defaultEnvironment } from '@/environments';
import type { RouteConfiguration } from '@/lib';
import { Loading, useProblemSink } from '@/pages';
import { AuthProvider, hasAuthParams, useAuth } from '@echocat/react-oidc-context';
import { Log, WebStorageStateStore } from 'oidc-client-ts';
import type React from 'react';
import { createContext, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { type Location, Navigate, Outlet } from 'react-router';

interface ContextState {
    variant: NamedEnvironmentVariant;
}
const Context = createContext<ContextState | undefined>(undefined);

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
    const theme = useTheme();
    const problemSink = useProblemSink();

    useEffect(() => {
        let silentLoginPossible = true;
        if (auth.error) {
            if (auth.error.source === 'renewSilent' || auth.error.source === 'signinSilent' || auth.error.source === 'signinCallback') {
                // While silent renew or signinSilent there can be errors, if so, we silently ignore them here,
                // because following we're trying the regular login...
                silentLoginPossible = false;
            } else {
                problemSink(auth.error, `Authorization context failed within ${auth.error.source}: ${auth.error.message}`);
                return;
            }
        }

        if (!hasAuthParams() && !auth.isAuthenticated && !auth.activeNavigator && !auth.isLoading) {
            (async () => {
                try {
                    if (silentLoginPossible) {
                        const prefix = environmentVariantUriPrefix(props.environment, props.variant);
                        // Try at first the silent version ensures no flickering for the user
                        // in case he still has a valid session at the IdP.
                        const u = await auth.signinSilent({
                            redirect_uri: `${prefix}after-silent-login`,
                        });
                        if (u) {
                            console.log('Silent login was successful.');
                            return;
                        }
                    }

                    // If there is no u:User object, this means the silent login was
                    // not successful. Now we're trying the redirect login...
                    console.log('Silent login was not successful, trying interactive...');

                    await auth.signinRedirect({
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
                } catch (e) {
                    console.error('DOH!', e);
                }
            })();
        }
    }, [props, theme.mode, auth, problemSink]);

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

    return (
        <Context.Provider value={{ variant: props.variant }}>
            <AuthProvider
                authority={props.variant.stsAuthority}
                client_id={props.variant.clientId}
                stateStore={store}
                userStore={store}
                // Ensures the authentication page also uses our picks.
                ui_locales={i18n?.language}
                scope='openid profile email contacts offline'
                redirect_uri={`${prefix}after-login`}
                silent_redirect_uri={`${prefix}after-silent-login`}
                post_logout_redirect_uri={`${prefix}after-logout`}
                // Ensures to be automatic renew the tokens before it will expire.
                // Note: By default this is already set to `true`; we keep it here just for documentation.
                automaticSilentRenew={true}
            >
                <Outlet />
            </AuthProvider>
        </Context.Provider>
    );
}

export function useEnvironmentVariant() {
    return useContext(Context)?.variant;
}

interface CallbackProps {
    readonly environment: Environment;
    readonly variant: NamedEnvironmentVariant;
}

function AfterLogin(props: CallbackProps) {
    const auth = useAuth();

    // If there are not authParams and/or there is an error redirect to root
    // all this stuff will be handled there.
    if (!hasAuthParams() || auth.error) {
        return <Navigate to={`/${props.variant.subPath || ''}`} />;
    }

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
    if (props.variant.afterLogoutUrl) {
        // As it does not make sense to redirect to our application,
        // because it does only work if logged-in, we redirect on cancel
        // to our homepage.
        document.location.href = props.variant.afterLogoutUrl;
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

// Let's enable the logging framework of oidc-client-ts.
Log.setLevel(Log.INFO);
Log.setLogger(window.console);
