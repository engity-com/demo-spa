import type { OidcMetadata, SigninRedirectArgs, User } from 'oidc-client-ts';
import { Log, UserManager, WebStorageStateStore } from 'oidc-client-ts';
import type React from 'react';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type AuthContextProps, AuthProvider, hasAuthParams, useAuth } from 'react-oidc-context';
import { Navigate, Outlet, type Location as RouterLocation, useLocation } from 'react-router';
import { stateWithToastMessage, type ThemeMode, type ToastMessage, useTheme, useToast } from '@/components/page';
import type { Environment, EnvironmentVariant, NamedEnvironmentVariant } from '@/environments';
import { environment as defaultEnvironment } from '@/environments';
import type { RouteConfiguration } from '@/lib';
import { Loading, useProblemSink } from '@/pages';

interface ContextState {
    variant: NamedEnvironmentVariant;
    environment: Environment;
    userManager: UserManager;
}

const Context = createContext<ContextState | undefined>(undefined);

function environmentVariantUriPrefix(environment: Pick<Environment, 'clientRoot'>, variant: Pick<EnvironmentVariant, 'subPath'>): string {
    if (!variant.subPath) {
        return environment.clientRoot;
    }
    return `${environment.clientRoot}${variant.subPath}/`;
}

function AuthenticationOutlet() {
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
            } else {
                problemSink(auth.error, `Authorization context failed within ${auth.error.source}: ${auth.error.message}`);
                return;
            }
        }

        if (!hasAuthParams(location as any as Location) && !auth.isAuthenticated && !auth.activeNavigator && !auth.isLoading) {
            (async () => {
                if (silentLoginPossible) {
                    const u = await auth.signinSilent();
                    if (u) {
                        console.log('Silent login was successful.');
                        return;
                    }
                }

                // If there is no u:User object, this means the silent login was
                // not successful. Now we're trying the redirect login...
                console.log('Silent login was not successful, trying interactive...');

                await signinRedirect(auth, theme?.mode, {
                    state: {
                        location: {
                            ...location,
                            state: undefined,
                        },
                    },
                });
            })();
        }
    }, [auth, problemSink, theme?.mode, location]);

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
    const location = useLocation();
    const store = new WebStorageStateStore({
        prefix: `${variant.key}.`,
        store: window.localStorage,
    });
    const theme = useTheme();
    const { i18n } = useTranslation();
    const authProviderKey = `${variant.key}:${hasAuthParams(location as any as Location) ? 'auth-callback' : 'app'}`;
    const userManager = useMemo(
        () =>
            new UserManager({
                authority: variant.stsAuthority,
                client_id: variant.clientId,
                stateStore: store,
                userStore: store,
                filterProtocolClaims: ['nbf', 'jti', 'nonce', 'acr', 'amr', 'azp', 'at_hash'],

                // Ensures the authentication page also uses our picks.
                ui_locales: i18n?.language,
                scope: 'openid profile email contacts offline',
                redirect_uri: `${prefix}callback`,
                extraQueryParams: stripEmptyParameters({
                    color_scheme: theme.mode,
                }),

                // If this is empty, the IdP will end its flow on the login page.
                post_logout_redirect_uri: variant.afterLogoutUrl,

                // Ensures to be automatic renew the tokens before it will expire.
                // Note: By default, this is already set to `true`; we keep it here just for documentation.
                automaticSilentRenew: true,
            }),
        [i18n?.language, prefix, store, theme.mode, variant.clientId, variant.stsAuthority, variant.afterLogoutUrl],
    );

    return (
        <Context.Provider value={{ variant, environment, userManager }}>
            <AuthProvider key={authProviderKey} userManager={userManager}>
                <Outlet />
            </AuthProvider>
        </Context.Provider>
    );
}

export function useEnvironmentVariant() {
    return useContext(Context)?.variant;
}

export function useMetadata(): Partial<OidcMetadata> | undefined {
    const context = useContext(Context);
    const [state, setState] = useState<Partial<OidcMetadata> | undefined>();
    useEffect(
        () => void (async () => setState(await context?.userManager.metadataService.getMetadata()))(),
        [context?.userManager.metadataService.getMetadata],
    );
    return state;
}

async function signinRedirect(
    auth: Pick<AuthContextProps, 'signinRedirect'>,
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
    const theme = useTheme();
    const location = useLocation();
    const { add: addToast } = useToast();

    return useMemo(
        () =>
            auth.user
                ? async (maxAgeInSeconds: number, preserveLocation = true) => {
                      if (hasFreshAuth(auth.user, maxAgeInSeconds)) {
                          addToast({
                              kind: 'success',
                              titleKey: 'login.freshen.upToDate',
                          });
                          return true;
                      }

                      await signinRedirect(auth, theme?.mode, {
                          state: {
                              location: preserveLocation ? location : undefined,
                          },
                          max_age: maxAgeInSeconds,
                      });

                      return true;
                  }
                : undefined,
        [auth, location, theme.mode],
    );
}

export function useSigninSilent() {
    const auth = useAuth();
    const { add: addToast } = useToast();

    return useMemo(
        () =>
            auth?.user
                ? async () => {
                      if (await auth.signinSilent()) {
                          addToast({
                              kind: 'success',
                              titleKey: 'token.renew.success',
                          });
                          return true;
                      }
                      addToast({
                          kind: 'error',
                          titleKey: 'token.renew.failed',
                          descriptionKey: auth.error?.message ? 'token.renew.failedMessage' : undefined,
                          descriptionOptions: { error: auth.error?.message },
                      });
                      return false;
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
    const location = useLocation();
    const auth = useAuth();

    // If there are not authParams and/or there is an error redirect to root
    // all this stuff will be handled there.
    if (!hasAuthParams(location as any as Location) || auth.error) {
        if (
            auth.error?.innerError &&
            typeof auth.error.innerError === 'object' &&
            'state' in auth.error.innerError &&
            typeof auth.error.innerError.state === 'object' &&
            'error' in auth.error.innerError &&
            typeof auth.error.innerError.error === 'string'
        ) {
            const toastMessage = callbackErrorToToastMessage(auth.error);
            const state = auth.error.innerError.state as { location?: RouterLocation<any> };
            if (state.location && toastMessage) {
                return <Navigate to={state.location} state={stateWithToastMessage(state.location.state, toastMessage)} replace />;
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
        const location = auth.user.state.location as RouterLocation<any>;
        return <Navigate to={location} state={location.state} replace />;
    }

    return <Navigate to={location} />;
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
                        path: 'callback',
                        element: <AfterLogin variant={v} environment={env} />,
                    },
                    {
                        path: '*',
                        children: children,
                        element: <AuthenticationOutlet />,
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

function callbackErrorToToastMessage(error: AuthContextProps['error']): ToastMessage | undefined {
    if (
        !error?.innerError ||
        typeof error.innerError !== 'object' ||
        !('error' in error.innerError) ||
        !error.innerError.error ||
        typeof error.innerError.error !== 'string'
    ) {
        return undefined;
    }

    const errorKey = error.innerError.error;
    const errorDescription =
        'error_description' in error.innerError && typeof error.innerError.error_description === 'string'
            ? error.innerError.error_description
            : undefined;

    switch (error.innerError.error) {
        case 'access_denied':
            return {
                kind: 'warning',
                titleKey: 'login.result.cancelled',
            };
        default:
            return {
                kind: 'error',
                titleKey: 'login.result.failed',
                titleOptions: { error: errorKey },
                descriptionKey: errorDescription ? 'login.result.failedMessage' : undefined,
                descriptionOptions: { details: errorDescription },
            };
    }
}

// Let's enable the logging framework of oidc-client-ts.
Log.setLevel(Log.INFO);
Log.setLogger(window.console);
