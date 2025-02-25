import { Columns } from '@/components/Columns';
import { Link } from '@/components/Link';
import { CompletedTasks } from '@/components/graphs/CompletedTasks';
import { DailySales } from '@/components/graphs/DailySales';
import { WebsiteViews } from '@/components/graphs/WebsiteViews';
import { NewCustomers } from '@/components/reports/NewCustomers';
import { TodaysAdViews } from '@/components/stats/TodaysAdViews';
import { TodaysMoney } from '@/components/stats/TodaysMoney';
import { TodaysSales } from '@/components/stats/TodaysSales';
import { TodaysUsers } from '@/components/stats/TodaysUsers';
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
