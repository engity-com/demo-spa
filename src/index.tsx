import './index.css';
import '@/lib/i18n';
import { App } from '@/App';
import React, { type RefObject } from 'react';
import ReactDOM from 'react-dom/client';

const problemSinkRef: RefObject<((e: unknown, msg?: string) => void) | null> = { current: null };

ReactDOM.createRoot(document.body, {
    onCaughtError: () => {},
}).render(
    <React.StrictMode>
        <App problemSinkRef={problemSinkRef} />
    </React.StrictMode>,
);

window.onunhandledrejection = (ev) => {
    problemSinkRef.current?.(ev.reason, 'DHO!!!???');
};
