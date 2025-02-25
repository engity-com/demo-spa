import './index.css';
import '@/lib/i18n';
import { App } from '@/App';
import React from 'react';
import ReactDOM from 'react-dom/client';

ReactDOM.createRoot(document.body, {
    onCaughtError: () => {},
}).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);
