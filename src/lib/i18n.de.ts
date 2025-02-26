import { de } from 'date-fns/locale';
import type { ResourceLanguage } from 'i18next';

export default {
    code: 'de',
    dateLocale: de,
    title: 'Deutsch',
    translation: {
        app: {
            product: {
                url: 'https://engity.com/de/iam-produkt/',
            },
            company: {
                url: 'https://engity.com/de/',
            },
        },
        billing: 'Rechnungsstellung',
        customers: {
            new: 'Neukunden',
        },
        company: 'Unternehmen',
        contact: 'Kontakt',
        date: 'Datum',
        demo: {
            note: 'Diese Anwendung dient zur Demonstration der Funktionsweise des Engity IdP. Alle Werte auf dieser Seite sind Beispiele. Weitere Details zu allen Funktionen finden Sie <here>hier</here>.',
        },
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
        notifications: 'Benachrichtigungen',
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
