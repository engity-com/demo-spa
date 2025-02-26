import { enUS } from 'date-fns/locale';
import type { ResourceLanguage } from 'i18next';

export default {
    code: 'en',
    title: 'English',
    dateLocale: enUS,
    translation: {
        anonymous: {
            '.': 'Anonymous',
            initials: 'AN',
        },
        app: {
            short: 'IdP Demo',
            regular: 'Engity IdP Demo',
            product: {
                url: 'https://engity.com/iam-product/',
            },
            company: {
                url: 'https://engity.com',
            },
        },
        billing: 'Billing',
        chat: 'Chat',
        company: 'Company',
        contact: 'Contact',
        customers: {
            new: 'New Customers',
        },
        dashboard: 'Dashboard',
        date: 'Date',
        demo: {
            note: 'This application is used to demonstrate how the Engity IdP works. All values on this page are examples. Further details on all functions can be found <here>here</here>.',
        },
        email: 'Email',
        home: 'Home',
        language: 'Language',
        legalNotice: {
            '.': 'Legal Notice',
            url: 'https://engity.com/legal-notice/',
        },
        loading: {
            shortMessage: 'Please wait...',
        },
        logout: 'Logout',
        notFound: 'Not found',
        notifications: 'Notifications',
        privacyPolicy: {
            '.': 'Privacy policy',
            url: 'https://engity.com/data-privacy/',
        },
        problem: {
            unexpected: {
                '.': 'Error',
                message: 'An unexpected problem occurred. Kindly reach out to our support team with a comprehensive explanation of the process.',
            },
        },
        stats: {
            adViews: 'Ad Views',
            completedTasks: { '.': 'Completed Tasks', subTitle: 'Since last campaign' },
            sales: { '.': 'Sales', daily: { '.': 'Daily sales', subTitle: 'Increase on sales' } },
            thanPrevious: {
                '-1d': 'than yesterday',
                '-1w': 'than last week',
                '-1m': 'than last month',
            },
            todaysMoney: "Today's Money",
            todaysUsers: "Today's Users",
            website: {
                views: { '.': 'Website views', subTitle: 'Since last campaign' },
            },
        },
        tasks: 'Tasks',
        termsOfService: {
            '.': 'Terms of Service',
            url: 'https://engity.com/terms/',
        },
        theme: {
            mode: {
                dark: {
                    switchTo: 'Switch to dark mode',
                },
                light: {
                    switchTo: 'Switch to light mode',
                },
            },
        },
        views: 'Views',
    },
} satisfies ResourceLanguage;
