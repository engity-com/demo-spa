import type { ResourceLanguage } from 'i18next';

export default {
    code: 'de',
    title: 'Deutsch',
    translation: {
        language: 'Sprache',
        logout: 'Ausloggen',
        loading: {
            shortMessage: 'Bitte warten...',
        },
        notFound: 'Nicht gefunden',
        theme: {
            mode: {
                light: {
                    switchTo: 'Zum hellen Modus wechseln',
                },
                dark: {
                    switchTo: 'Zum dunklen Modus wechseln',
                },
            },
        },
        legalNotice: {
            '.': 'Impressum',
            url: 'https://engity.com/de/impressum/',
        },
    },
} satisfies ResourceLanguage;
