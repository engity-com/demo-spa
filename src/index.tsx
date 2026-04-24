import '@/index.css';
import '@/lib/i18n';
import React, { type RefObject } from 'react';
import ReactDOM from 'react-dom/client';
import { App } from '@/App';

const problemSinkRef: RefObject<((e: unknown, msg?: string) => void) | null> = { current: null };

ReactDOM.createRoot(document.body, {
    onCaughtError: () => {},
}).render(
    <React.StrictMode>
        <App problemSinkRef={problemSinkRef} />
    </React.StrictMode>,
);
