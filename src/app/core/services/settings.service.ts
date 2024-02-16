import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class SettingsService {
    get settings(): any {
        const plain = localStorage.getItem('settings');
        if (!plain) {
            console.debug(`No settings stored. Fallback to default.`);
            return {};
        }
        try {
            return JSON.parse(plain) || {};
        } catch (e) {
            console.debug(`Cannot parse settings. Fallback to default.`, e);
            return {};
        }
    }

    set settings(v: any) {
        localStorage.setItem('settings', JSON.stringify(v));
    }

    setSetting(key: string, v: any) {
        const buf = this.settings;
        buf[key] = v;
        this.settings = buf;
    }
}

export enum View {
    simple = 'simple',
    developer = 'developer',
}
