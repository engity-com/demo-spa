import { de } from 'date-fns/locale';
import type { ResourceLanguage } from 'i18next';

export default {
    code: 'de',
    dateLocale: de,
    title: 'Deutsch',
    translation: {
        actions: 'Aktionen',
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
        developer: {
            '.': 'Entwickler',
            introduction: 'Diese Seite gibt einen Überblick über einige technische Details des aktuellen Benutzers.',
        },
        demo: {
            note: 'Diese Anwendung dient zur Demonstration der Funktionsweise des Engity IdP. Alle Werte auf dieser Seite sind Beispiele. <here>Weitere Details zu allen Funktionen finden Sie hier</here>. Spezielle Informationen für Entwickler sind in <developer>einem separaten Abschnitt verfügbar</developer>.',
            sourceHint: 'Alle Informationen zu dieser Demo inkl. Dokumentation und Quelltext sind <here>hier</here> verfügbar.',
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
        login: {
            as: 'Angemeldet als {{name}}',
        },
        logout: 'Abmelden',
        notFound: 'Nicht gefunden',
        notifications: 'Benachrichtigungen',
        profile: 'Profil',
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
        token: {
            '.': 'Token',
            renew: 'Token erneuern',
        },
        views: 'Ansichten',
    },
} satisfies ResourceLanguage;
