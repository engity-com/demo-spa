import type { ResourceLanguage } from 'i18next';

export default {
    code: 'en',
    title: 'English',
    translation: {
        app: {
            short: 'IdP Demo',
            regular: 'Engity IdP Demo',
        },
        anonymous: {
            '.': 'Anonymous',
            initials: 'AN',
        },
        home: 'Home',
        language: 'Language',
        logout: 'Logout',
        loading: {
            shortMessage: 'Please wait...',
        },
        notFound: 'Not found',
        theme: {
            mode: {
                light: {
                    switchTo: 'Switch to light mode',
                },
                dark: {
                    switchTo: 'Switch to dark mode',
                },
            },
        },
        legalNotice: {
            '.': 'Legal Notice',
            url: 'https://engity.com/legal-notice/',
        },
        privacyPolicy: {
            '.': 'Privacy policy',
            url: 'https://engity.com/data-privacy/',
        },
        termsOfService: {
            '.': 'Terms of Service',
            url: 'https://engity.com/terms/',
        },
    },
} satisfies ResourceLanguage;
