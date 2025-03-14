import type { Locale } from 'date-fns';
import i18next, { type LanguageDetectorModule, type ResourceLanguage, type Services } from 'i18next';
import { initReactI18next } from 'react-i18next';
import de from './i18n.de';
import en from './i18n.en';

export const languages = [en, de];

const languageToLocale: Record<string, Locale> = languages.reduce<Record<string, Locale>>((acc, l) => {
    acc[l.code] = l.dateLocale;
    return acc;
}, {});

export function getLocale(language: string): Locale | undefined {
    return languageToLocale[language];
}

class Detector implements LanguageDetectorModule {
    readonly type = 'languageDetector';

    private readonly storageKey = 'language';
    private readonly storage: Storage = localStorage;
    private browsersDefaults: string[] = [];
    private services: Services | undefined = undefined;

    init(services: Services): void {
        this.services = services;
        this.browsersDefaults = [];

        if (typeof navigator !== 'undefined') {
            const { languages, language } = navigator;
            if (languages) {
                for (const language of languages) {
                    if (this.browsersDefaults.indexOf(language) < 0) {
                        this.browsersDefaults.push(language);
                    }
                }
            }
            if (language) {
                if (this.browsersDefaults.indexOf(language) < 0) {
                    this.browsersDefaults.push(language);
                }
            }
        }
    }

    cacheUserLanguage(lng: string): void {
        if (this.isDefault(lng)) {
            this.storage.removeItem(this.storageKey);
        } else {
            this.storage.setItem(this.storageKey, lng);
        }
        document.documentElement?.setAttribute?.('lang', lng);
    }

    detect(): string | readonly string[] | undefined {
        const stored = this.storage.getItem(this.storageKey);
        if (stored && this.isSupportedCode(stored)) {
            return stored;
        }

        const resolved: string[] = [];
        for (const candidate of this.browsersDefaults) {
            const hierarchy = this.toResolveHierarchy(candidate, []);
            if (!hierarchy || hierarchy.length <= 0) {
                continue;
            }
            resolved.push(hierarchy[0]);
        }

        switch (resolved.length) {
            case 0:
                return undefined;
            case 1:
                return resolved[0];
            default:
                return [...resolved];
        }
    }

    isDefault(candidate: string): boolean {
        for (const language of this.browsersDefaults) {
            if (language === candidate) {
                return true;
            }
            const hierarchy = this.toResolveHierarchy(language, []);
            if (hierarchy.length <= 0) {
                continue;
            }
            if (hierarchy[0] === candidate) {
                return true;
            }
        }

        return false;
    }

    private toResolveHierarchy(language: string, fallbacks?: string[] | undefined): string[] {
        return this.services?.languageUtils?.toResolveHierarchy.apply(this.services?.languageUtils, [language, fallbacks]);
    }

    private isSupportedCode(code: string): boolean {
        return this.services?.languageUtils?.isSupportedCode.apply(this.services?.languageUtils, [code]);
    }
}

const detector = new Detector();

export function isBrowsersDefaultLanguage(lng: string): boolean {
    return detector.isDefault(lng);
}

i18next
    .use(initReactI18next)
    .use(detector)
    .init({
        resources: languages.reduce<Record<string, ResourceLanguage>>((acc, l) => {
            acc[l.code] = l;
            return acc;
        }, {}),
        supportedLngs: languages.map((l) => l.code),
        fallbackLng: languages[0].code,
        interpolation: {
            escapeValue: false,
        },
        detection: {
            order: ['querystring', 'localStorage', 'navigator', 'htmlTag'],
            lookupQuerystring: 'lang',
            lookupLocalStorage: 'lang',
            caches: [],
        },
        parseMissingKeyHandler: (_, defaultValue) => defaultValue,
        returnedObjectHandler: (_: string, value: unknown) => {
            if (typeof value === 'object') {
                const dot = value && '.' in value && value['.'];
                if (dot) {
                    return dot;
                }
            }
            return value;
        },
    });

export default i18next;
