import type { SigninRedirectArgs, User } from 'oidc-client-ts';
import { Log, WebStorageStateStore } from 'oidc-client-ts';
import type React from 'react';
import { createContext, useContext, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { type AuthContextProps, AuthProvider, hasAuthParams, useAuth } from 'react-oidc-context';
import { type Location, Navigate, Outlet, useLocation } from 'react-router';
import { useTheme } from '@/components/page';
import type { Environment, EnvironmentVariant, NamedEnvironmentVariant } from '@/environments';
import { environment as defaultEnvironment } from '@/environments';
import type { RouteConfiguration } from '@/lib';
import { Loading, useProblemSink } from '@/pages';
import type { ThemeMode } from '../components/page';

interface ContextState {
    variant: NamedEnvironmentVariant;
    environment: Environment;
}

const Context = createContext<ContextState | undefined>(undefined);

interface AuthenticationOutletProps {
    readonly environment: Environment;
    readonly variant: NamedEnvironmentVariant;
}

function environmentVariantUriPrefix(environment: Pick<Environment, 'clientRoot'>, variant: Pick<EnvironmentVariant, 'subPath'>): string {
    if (!variant.subPath) {
        return environment.clientRoot;
    }
    return `${environment.clientRoot}${variant.subPath}/`;
}

function AuthenticationOutlet(props: AuthenticationOutletProps) {
    const auth = useAuth();
    const theme = useTheme();
    const problemSink = useProblemSink();
    const location = useLocation();

    useEffect(() => {
        let silentLoginPossible = true;
        if (auth.error) {
            if (auth.error.source === 'renewSilent' || auth.error.source === 'signinSilent' || auth.error.source === 'signinCallback') {
                // While silent renew or signinSilent there can be errors, if so, we silently ignore them here,
                // because following we're trying the regular login...
                silentLoginPossible = false;
                console.log('Silent login is NOT possible');
            } else {
                problemSink(auth.error, `Authorization context failed within ${auth.error.source}: ${auth.error.message}`);
                return;
            }
        }

        if (!hasAuthParams() && !auth.isAuthenticated && !auth.activeNavigator && !auth.isLoading) {
            (async () => {
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

                await signinRedirect(auth, props.environment, props.variant, theme?.mode, {
                    state: {
                        location: {
                            ...location,
                            state: undefined,
                        },
                    },
                });
            })();
        }
    }, [props, auth, problemSink, theme?.mode, location]);

    if (!auth.isAuthenticated) {
        return <Loading defaultTitle={true} visibilityDelay={true} />;
    }

    return <Outlet />;
}

function Authentication({
    environment,
    variant,
}: {
    readonly children?: React.ReactNode;
    readonly environment: Environment;
    readonly variant: NamedEnvironmentVariant;
}) {
    const prefix = environmentVariantUriPrefix(environment, variant);
    const store = new WebStorageStateStore({
        prefix: `${variant.key}.`,
        store: window.localStorage,
    });
    const theme = useTheme();
    const { i18n } = useTranslation();

    return (
        <Context.Provider value={{ variant, environment }}>
            <AuthProvider
                authority={variant.stsAuthority}
                client_id={variant.clientId}
                stateStore={store}
                userStore={store}
                filterProtocolClaims={['nbf', 'jti', 'nonce', 'acr', 'amr', 'azp', 'at_hash']}
                // Ensures the authentication page also uses our picks.
                ui_locales={i18n?.language}
                scope='openid profile email contacts offline'
                redirect_uri={`${prefix}after-login`}
                extraQueryParams={stripEmptyParameters({
                    color_scheme: theme.mode,
                })}
                silent_redirect_uri={`${prefix}after-silent-login`}
                post_logout_redirect_uri={`${prefix}after-logout`}
                // Ensures to be automatic renew the tokens before it will expire.
                // Note: By default this is already set to `true`; we keep it here just for documentation.
                automaticSilentRenew
            >
                <Outlet />
            </AuthProvider>
        </Context.Provider>
    );
}

export function useEnvironmentVariant() {
    return useContext(Context)?.variant;
}

async function signinRedirect(
    auth: Pick<AuthContextProps, 'signinRedirect'>,
    environment: Pick<Environment, 'clientRoot'>,
    variant: Pick<EnvironmentVariant, 'subPath' | 'afterLogoutUrl'>,
    themeMode: ThemeMode | undefined,
    args?: SigninRedirectArgs | undefined,
) {
    return await auth.signinRedirect({
        ...(args || {}),
        extraQueryParams: stripEmptyParameters({
            // These are optional extra parameter the Engity IdP supports.

            // Tip: The conditional expression is to ensure we only set these parameters
            // if they're present.
            ...(args?.extraQueryParams || {}),

            // Take the color scheme (light|dark) with to the login page.
            color_scheme: themeMode,
        }),
    });
}

function authTimeStampOf(user: Pick<User, 'profile'> | null | undefined) {
    let value = user?.profile?.auth_time;
    if (typeof value === 'string') {
        value = Number(value);
    }
    if (typeof value === 'number' && Number.isFinite(value) && value > 0) {
        return value;
    }
    return undefined;
}

function hasFreshAuth(user: Pick<User, 'profile'> | null | undefined, maxAgeInSeconds: number) {
    const authenticatedAt = authTimeStampOf(user);
    if (!authenticatedAt) {
        return false;
    }

    return Math.floor(Date.now() / 1000) - authenticatedAt <= maxAgeInSeconds;
}

export function useEnsureFreshAuthentication() {
    const auth = useAuth();
    const ctx = useContext(Context);
    const variant = ctx?.variant;
    const environment = ctx?.environment;
    const theme = useTheme();
    const location = useLocation();

    return useMemo(
        () =>
            auth.user && variant && environment
                ? async (maxAgeInSeconds: number, preserveLocation = true) => {
                      if (hasFreshAuth(auth.user, maxAgeInSeconds)) {
                          return true;
                      }

                      await signinRedirect(auth, environment, variant, theme?.mode, {
                          state: {
                              location: preserveLocation ? location : undefined,
                          },
                          max_age: maxAgeInSeconds,
                      });
                      return true;
                  }
                : undefined,
        [auth, variant, environment, location, theme?.mode],
    );
}

export function useSigninSilent() {
    const auth = useAuth();

    return useMemo(
        () =>
            auth?.user
                ? async () => {
                      const user = await auth.signinSilent();
                      return !!user;
                  }
                : undefined,
        [auth],
    );
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
        if (
            auth.error?.innerError &&
            typeof auth.error.innerError === 'object' &&
            'state' in auth.error.innerError &&
            typeof auth.error.innerError.state === 'object'
        ) {
            const state = auth.error.innerError.state as { location?: Location<any> };
            if (state.location) {
                console.log('Redirecting to location from error state:', state.location);
                return <Navigate to={state.location} state={state.location.state} replace />;
            }
        }
        return <Navigate to={`/${props.variant.subPath || ''}`} />;
    }

    if (auth.isLoading) {
        return <Loading defaultTitle={true} visibilityDelay={true} />;
    }

    if (
        auth.user?.state &&
        typeof auth.user.state === 'object' &&
        'location' in auth.user.state &&
        auth.user.state.location &&
        typeof auth.user.state.location === 'object'
    ) {
        const location = auth.user.state.location as Location<any>;
        return <Navigate to={location} state={location.state} replace />;
    }

    return <Navigate to={location} />;
}

function AfterLogout(props: CallbackProps) {
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
                        path: 'after-signup',
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

function stripEmptyParameters(v: Record<string, string | number | boolean | null | undefined>) {
    return Object.fromEntries(Object.entries(v).filter(([_, v]) => v !== undefined && v !== null && v !== '')) as Record<
        string,
        string | number | boolean
    >;
}

// Let's enable the logging framework of oidc-client-ts.
Log.setLevel(Log.INFO);
Log.setLogger(window.console);
