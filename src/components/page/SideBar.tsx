import './SideBar.css';
// @ts-ignore
import Logo from '@/assets/logo-without-spacing.svg';
import { Link } from '@/components';
import { Footer } from '@/components/page';
import { Separator } from '@radix-ui/themes';
import { NavigationMenu } from 'radix-ui';
import type React from 'react';
import { createContext, useContext, useEffect, useRef, useState } from 'react';

interface SideBarProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> {}

export function SideBar(props: SideBarProps) {
    const sideBar = useSideBar();
    const onBlur = () => {
        if (sideBar.stateDefault === 'collapsed') {
            sideBar.setState('collapsed');
        }
    };

    const ref = useRef<HTMLButtonElement>(null);
    useEffect(() => {
        if (sideBar.stateDefault === 'collapsed' && sideBar.stateResolved === 'expanded') {
            ref.current?.focus({ preventScroll: true });
        }
    }, [sideBar]);

    return (
        // biome-ignore lint/a11y/noNoninteractiveTabindex: We make this element explicitly interactive to be able to receive the blur event.
        <aside ref={ref} className='SideBar' data-state={sideBar.stateResolved} {...props} tabIndex={0} onBlur={onBlur}>
            <div className='container'>
                <div className='content'>
                    <Link className='about' titleKey='app.regular' to='/'>
                        <Logo className='logo' />
                    </Link>

                    <Separator orientation='horizontal' size='4' />

                    <NavigationMenu.Root orientation='vertical' className='navigation'>
                        <NavigationMenu.List>
                            <NavigationMenu.Item>
                                <Link title='Dashboard' to='/' />
                            </NavigationMenu.Item>
                            <NavigationMenu.Item>
                                <Link title='Chat' to='/directory/foo' />
                            </NavigationMenu.Item>
                            <NavigationMenu.Item>
                                <Link title='Messages' to='/directory/bar' />
                            </NavigationMenu.Item>
                            <NavigationMenu.Item>
                                <Link title='Billing' to='/directory' />
                            </NavigationMenu.Item>
                            <NavigationMenu.Item>
                                <Link titleKey='notFound' to='/not-found' />
                            </NavigationMenu.Item>
                        </NavigationMenu.List>
                    </NavigationMenu.Root>
                </div>

                <Footer />
            </div>
        </aside>
    );
}

const mediaSelector = '(max-width: 1136px)';
const storageKey = 'side-bar-state';

type SideBarSate = 'expanded' | 'collapsed';

function mediaSelectorMatchesToSideBarState(matches: boolean): SideBarSate {
    return matches ? 'collapsed' : 'expanded';
}

function invertState(given: SideBarSate): SideBarSate {
    switch (given) {
        case 'collapsed':
            return 'expanded';
        case 'expanded':
            return 'collapsed';
        default:
            throw new Error(`illegal SideBarState: ${given}`);
    }
}

type SideBarProviderProps = {
    children: React.ReactNode;
};

export interface SideBarProviderState {
    readonly state: SideBarSate | undefined;
    readonly stateResolved: SideBarSate;
    readonly stateDefault: SideBarSate;
    readonly stateLast:
        | {
              readonly value: SideBarSate | undefined;
              readonly ts: number;
          }
        | undefined;
    readonly setState: (v: SideBarSate | undefined) => void;
    readonly toggleState: () => void;
}

function resolveSideBarState(sideBar: SideBarSate | undefined): SideBarSate {
    if (sideBar !== undefined) {
        return sideBar;
    }
    return mediaSelectorMatchesToSideBarState(window.matchMedia?.(mediaSelector).matches);
}

const SideBarProviderContext = createContext<SideBarProviderState>({
    state: undefined,
    stateResolved: resolveSideBarState(undefined),
    stateDefault: resolveSideBarState(undefined),
    stateLast: undefined,
    setState: () => null,
    toggleState: () => null,
});

export function SideBarProvider({ children, ...props }: SideBarProviderProps) {
    const [provided, setProvided] = useState<SideBarSate | undefined>(() => {
        if (window.matchMedia?.(mediaSelector).matches) {
            return undefined;
        }
        return (localStorage.getItem(storageKey) as SideBarSate | undefined) || undefined;
    });
    const [resolved, setResolved] = useState<SideBarSate>(() => resolveSideBarState(provided));
    const [def, setDefault] = useState<SideBarSate>(() => resolveSideBarState(undefined));
    const [stateLast, setStateLast] = useState<
        | {
              readonly value: SideBarSate | undefined;
              readonly ts: number;
          }
        | undefined
    >(undefined);
    const watchPrefers = window.matchMedia?.(mediaSelector);

    useEffect(() => {
        const resolved = resolveSideBarState(provided);
        setResolved(resolved);

        if (watchPrefers && 'addEventListener' in watchPrefers) {
            const onChange = (e: MediaQueryListEvent) => {
                localStorage.removeItem(storageKey);
                const resolved = mediaSelectorMatchesToSideBarState(e.matches);
                setStateLast({
                    value: provided,
                    ts: new Date().getTime(),
                });
                setProvided(undefined);
                setDefault(resolved);
                setResolved(resolved);
            };
            watchPrefers.addEventListener('change', onChange);
            return () => watchPrefers.removeEventListener('change', onChange);
        }
    }, [provided, watchPrefers]);

    class StateImpl implements SideBarProviderState {
        get state() {
            return provided;
        }

        get stateResolved() {
            return resolved;
        }

        get stateDefault() {
            return def;
        }

        get stateLast() {
            return stateLast;
        }

        setState(v: SideBarSate | undefined) {
            const tsNow = new Date().getTime();
            if (def === 'collapsed' && stateLast?.value === 'expanded' && stateLast?.ts + 250 > tsNow) {
                // Prevent doubles...
                return;
            }
            if (!v || v === this.stateDefault) {
                localStorage.removeItem(storageKey);
            } else {
                localStorage.setItem(storageKey, v);
            }
            setStateLast({
                value: provided,
                ts: tsNow,
            });
            setProvided(v);
        }

        toggleState() {
            this.setState(invertState(this.stateResolved));
        }
    }

    return (
        <SideBarProviderContext.Provider {...props} value={new StateImpl()}>
            {children}
        </SideBarProviderContext.Provider>
    );
}

export const useSideBar = () => {
    const context = useContext(SideBarProviderContext);

    if (context === undefined) {
        throw new Error('useSideBar must be used within a SideBarProvider');
    }

    return context;
};
