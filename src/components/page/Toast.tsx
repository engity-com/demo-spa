import * as RadixToast from '@radix-ui/react-toast';
import type { TFunction } from 'i18next';
import { createContext, type ReactNode, useContext, useEffect, useMemo, useReducer } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';

const ValuesContext = createContext<Message[]>([]);
const DispatchContext = createContext<(v: Action) => void>(() => {});

export function stateWithToastMessage(state: any | undefined, message: ToastMessage): any {
    return {
        ...(state && typeof state === 'object' ? state : {}),
        toastMessage: message,
    };
}

function toastMessageFromState(state: any | undefined) {
    if (!state || typeof state !== 'object' || !('toastMessage' in state)) {
        return undefined;
    }

    const candidate = state.toastMessage;
    if (!candidate || typeof candidate !== 'object') {
        return undefined;
    }
    if ('titleKey' in candidate && typeof candidate.titleKey === 'string') {
        return candidate;
    }
    if ('title' in candidate && typeof candidate.title === 'string') {
        return candidate;
    }
    return undefined;
}

function stateWithoutToastMessage(state: any | undefined) {
    if (!state || typeof state !== 'object' || !('toastMessage' in state)) {
        return state;
    }

    const { toastMessage: _, ...rest } = state as ToastMessage & Record<string, unknown>;
    return Object.keys(rest).length > 0 ? rest : null;
}

export type ToastMessage = {
    readonly kind?: 'info' | 'success' | 'warning' | 'error';
    readonly timeout?: number | undefined;
} & (
    | {
          readonly title: string;
      }
    | {
          readonly titleKey: string;
          readonly titleOptions?: Record<string, unknown> | undefined;
      }
) &
    (
        | {
              readonly description?: string | undefined;
          }
        | {
              readonly descriptionKey: string | undefined;
              readonly descriptionOptions?: Record<string, unknown> | undefined;
          }
    );

let lastMessageSerial = 1;
type Message = ToastMessage & {
    readonly serial: number;
};

type Action =
    | {
          type: 'add';
          message: ToastMessage;
          serial: number;
      }
    | {
          type: 'remove';
          serial: number;
      };

function reducer(state: Message[], action: Action): Message[] {
    switch (action.type) {
        case 'add': {
            if (state.some((candidate) => candidate.serial === action.serial)) {
                return state;
            }
            return [
                ...state,
                {
                    ...action.message,
                    serial: action.serial,
                },
            ];
        }
        case 'remove': {
            return state.filter((candidate) => candidate.serial !== action.serial);
        }
        default:
            return state;
    }
}

export function ToastProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(reducer, []);

    const location = useLocation();
    const navigate = useNavigate();
    const fromState = toastMessageFromState(location.state);
    const serialForState = useMemo(() => lastMessageSerial++, []);

    useEffect(() => {
        if (!fromState) {
            return;
        }

        dispatch({ type: 'add', message: fromState, serial: serialForState });
        void navigate('.', {
            replace: true,
            state: stateWithoutToastMessage(location.state),
        });
    }, [fromState, navigate, location.state, serialForState]);

    return (
        <ValuesContext.Provider value={state}>
            <DispatchContext.Provider value={dispatch}>{children}</DispatchContext.Provider>
        </ValuesContext.Provider>
    );
}

function mapTitle(value: ToastMessage, t: TFunction): string | undefined {
    if (!value) {
        return undefined;
    }
    if ('title' in value && typeof value.title === 'string') {
        return value.title;
    }
    if ('titleKey' in value && typeof value.titleKey === 'string') {
        return t(value.titleKey, value.titleOptions);
    }
    return undefined;
}

function mapDescription(value: ToastMessage, t: TFunction): string | undefined {
    if (!value) {
        return undefined;
    }
    if ('description' in value && typeof value.description === 'string') {
        return value.description;
    }
    if ('descriptionKey' in value && typeof value.descriptionKey === 'string') {
        return t(value.descriptionKey, value.descriptionOptions);
    }
    return undefined;
}

export function Toast() {
    const { t } = useTranslation();
    const values = useContext(ValuesContext);
    const dispatch = useContext(DispatchContext);

    const resolved = useMemo(
        () =>
            values.map((value) => {
                const title = mapTitle(value, t);
                const description = mapDescription(value, t);
                return {
                    title,
                    description,
                    serial: value.serial,
                    kind: value.kind || 'info',
                    timeout: value.timeout ?? 8000,
                };
            }),
        [values, t],
    );

    if (!resolved.length) {
        return null;
    }

    return (
        <RadixToast.Provider swipeDirection='right'>
            {resolved.map((value) => (
                <RadixToast.Root
                    key={`message-${value.serial}`}
                    className={`toast toast--${value.kind} rt-reset rt-BaseCard rt-Card rt-r-size-1 rt-variant-surface`}
                    open
                    onOpenChange={() => dispatch({ type: 'remove', serial: value.serial })}
                    duration={value.timeout}
                >
                    <RadixToast.Title className='toast-title rt-Heading rt-r-size-2'>{value.title}</RadixToast.Title>
                    {value.description && (
                        <RadixToast.Description className='toast-description rt-Text rt-r-size-2 rt-CalloutText'>
                            {value.description}
                        </RadixToast.Description>
                    )}
                </RadixToast.Root>
            ))}

            <RadixToast.Viewport className='toast-viewport' />
        </RadixToast.Provider>
    );
}

export function useToast() {
    const dispatch = useContext(DispatchContext);
    return useMemo(
        () => ({
            add: (message: ToastMessage) => dispatch({ type: 'add', message, serial: lastMessageSerial++ }),
        }),
        [dispatch],
    );
}
