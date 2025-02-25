import { de } from 'date-fns/locale';
import type { ResourceLanguage } from 'i18next';

export default {
    code: 'de',
    dateLocale: de,
    title: 'Deutsch',
    translation: {
        customers: {
            new: 'Neukunden',
        },
        company: 'Unternehmen',
        contact: 'Kontakt',
        date: 'Datum',
        email: 'E-Mail',
        language: 'Sprache',
        legalNotice: {
            '.': 'Impressum',
            url: 'https://engity.com/de/impressum/',
        },
        loading: {
            shortMessage: 'Bitte warten...',
        },
        logout: 'Ausloggen',
        notFound: 'Nicht gefunden',
        stats: {
            adViews: 'Ad Anzeigen',
            completedTasks: { '.': 'Abgeschlossene Aufgaben', subTitle: 'Seit letzter Kampagne' },
            todaysMoney: 'Heutige Einnahmen',
            todaysUsers: 'Heutige Nutzer',
            sales: { '.': 'Absatz', daily: { '.': 'Täglicher Absatz', subTitle: 'Steigerung des Absatzes' } },
            thanPrevious: {
                '-1d': 'als gestern',
                '-1w': 'als letzte Woche',
                '-1m': 'als letzter Monat',
            },
            website: {
                views: { '.': 'Ansichten Webseite', subTitle: 'Seit letzter Kampagne' },
            },
        },
        tasks: 'Aufgaben',
        theme: {
            mode: {
                dark: {
                    switchTo: 'Zum dunklen Modus wechseln',
                },
                light: {
                    switchTo: 'Zum hellen Modus wechseln',
                },
            },
        },
        views: 'Ansichten',
    },
} satisfies ResourceLanguage;
