import { Columns, Link } from '@/components';
import { CompletedTasks, DailySales, WebsiteViews } from '@/components/graphs';
import { NewCustomers } from '@/components/reports';
import { TodaysAdViews, TodaysMoney, TodaysSales, TodaysUsers } from '@/components/stats';
import { Callout } from '@radix-ui/themes';
import { Info } from 'lucide-react';
import { Trans, useTranslation } from 'react-i18next';

export function Dashboard() {
    const { t, i18n } = useTranslation();
    return (
        <>
            <Callout.Root color='indigo' size='1'>
                <Callout.Icon>
                    <Info />
                </Callout.Icon>
                <Callout.Text size='2'>
                    <Trans i18nKey='demo.note' t={t} i18n={i18n} components={{ here: <Link toKey='app.product.url' /> }} />
                </Callout.Text>
            </Callout.Root>
            <Columns columns='4'>
                <TodaysMoney />
                <TodaysUsers />
                <TodaysAdViews />
                <TodaysSales />
            </Columns>
            <Columns columns='3'>
                <WebsiteViews amountOfDays={7} />
                <DailySales amountOfDays={7} />
                <CompletedTasks amountOfMonths={9} />
            </Columns>
            <NewCustomers />
        </>
    );
}
