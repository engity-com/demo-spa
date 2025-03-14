import { Theme as RTheme } from '@radix-ui/themes';
import { Moon, Sun } from 'lucide-react';
import type React from 'react';
import type { JSX } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const mediaSelector = '(prefers-color-scheme: dark)';
const storageKey = 'theme-mode';

export type ThemeMode = 'dark' | 'light';

function mediaSelectorMatchesToThemeMode(matches: boolean): ThemeMode {
    return matches ? 'dark' : 'light';
}

function invertMode(given: ThemeMode): ThemeMode {
    switch (given) {
        case 'light':
            return 'dark';
        case 'dark':
            return 'light';
        default:
            throw new Error(`illegal ThemeMode: ${given}`);
    }
}

interface ThemeProps {
    readonly id?: string;
    readonly className?: string;
    readonly children: React.ReactNode;
}

export interface ThemeState {
    mode: ThemeMode | undefined;
    readonly modeResolved: ThemeMode;
    readonly modeDefault: ThemeMode;
    readonly toggleMode: () => void;
}

function resolveMode(theme: ThemeMode | undefined): ThemeMode {
    if (theme) {
        return theme;
    }
    return mediaSelectorMatchesToThemeMode(window.matchMedia?.(mediaSelector).matches);
}

const ThemeProviderContext = createContext<ThemeState>({
    mode: undefined,
    modeResolved: resolveMode(undefined),
    modeDefault: resolveMode(undefined),
    toggleMode: () => null,
});

export function Theme({ children, ...props }: ThemeProps) {
    const [provided, setProvided] = useState<ThemeMode | undefined>(() => (localStorage.getItem(storageKey) as ThemeMode | undefined) || undefined);
    const [resolved, setResolved] = useState<ThemeMode>(() => resolveMode(provided));
    const [def, setDefault] = useState<ThemeMode>(() => resolveMode(undefined));

    useEffect(() => {
        const resolved = resolveMode(provided);
        setResolved(resolved);

        const root = window.document.documentElement;
        root.classList.add(resolved);
        root.classList.remove(invertMode(resolved));

        const watchPrefers = window.matchMedia?.(mediaSelector);
        if (!provided && watchPrefers && 'addEventListener' in watchPrefers) {
            const onChange = (e: MediaQueryListEvent) => {
                localStorage.removeItem(storageKey);
                const resolved = mediaSelectorMatchesToThemeMode(e.matches);
                setDefault(resolved);
                setResolved(resolved);
            };
            watchPrefers.addEventListener('change', onChange);
            return () => watchPrefers.removeEventListener('change', onChange);
        }
    }, [provided]);

    class StateImpl implements ThemeState {
        get mode() {
            return provided;
        }

        set mode(mode: ThemeMode | undefined) {
            if (!mode || mode === this.modeDefault) {
                localStorage.removeItem(storageKey);
            } else {
                localStorage.setItem(storageKey, mode);
            }
            setProvided(mode);
        }

        get modeResolved() {
            return resolved;
        }

        get modeDefault() {
            return def;
        }

        toggleMode() {
            this.mode = invertMode(this.modeResolved);
        }
    }

    return (
        <ThemeProviderContext.Provider {...props} value={new StateImpl()}>
            <RTheme
                accentColor='indigo'
                grayColor='gray'
                radius='small'
                appearance={resolved}
                hasBackground={false}
                panelBackground='translucent'
                {...props}
            >
                {children}
            </RTheme>
        </ThemeProviderContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeProviderContext);

    if (context === undefined) {
        throw new Error('useTheme must be used within a Theme');
    }

    return context;
};

const modeToNext = (theme: ThemeState): { icon: JSX.Element; mode: ThemeMode | undefined; titleKey: string } => {
    const filterDefaultMode = (mode: ThemeMode) => (theme.modeDefault !== mode ? mode : undefined);
    switch (theme.modeResolved) {
        case 'dark':
            return { icon: <Sun />, mode: filterDefaultMode('light'), titleKey: 'light' };
        default:
            return { icon: <Moon />, mode: filterDefaultMode('dark'), titleKey: 'dark' };
    }
};

export function ThemeToggle() {
    const { t } = useTranslation();
    const theme = useTheme();
    const next = modeToNext(theme);
    const setNext = () => {
        theme.mode = next.mode;
    };

    return (
        <button onClick={setNext} title={t(`theme.mode.${next.titleKey}.switchTo`)}>
            {next.icon}
        </button>
    );
}
