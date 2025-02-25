import { Columns } from '@/components/Columns';
import { CompletedTasks } from '@/components/graphs/CompletedTasks';
import { DailySales } from '@/components/graphs/DailySales';
import { WebsiteViews } from '@/components/graphs/WebsiteViews';
import { NewCustomers } from '@/components/reports/NewCustomers';
import { TodaysAdViews } from '@/components/stats/TodaysAdViews';
import { TodaysMoney } from '@/components/stats/TodaysMoney';
import { TodaysSales } from '@/components/stats/TodaysSales';
import { TodaysUsers } from '@/components/stats/TodaysUsers';

export function Dashboard() {
    return (
        <>
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
