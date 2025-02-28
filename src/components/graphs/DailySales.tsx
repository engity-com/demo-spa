import { random } from '@/lib';
import { OverviewGraph, type TimedValue } from '../index';

const weekdayFormatOpts: Intl.DateTimeFormatOptions = {
    weekday: 'short',
};
const fullDateFormatIOpts: Intl.DateTimeFormatOptions = {
    dateStyle: 'full',
};

interface DailySalesProps {
    readonly amountOfDays: number;
}

export function DailySales(props: DailySalesProps) {
    const today = new Date();
    today.setHours(12, 0, 0, 0);

    const values: TimedValue[] = [];
    const rand = random.mulberry32(today.getTime() + 122);
    for (let i = props.amountOfDays; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        values.push({
            date: date,
            value: Math.round(random.inRange(rand, 0, 600)),
        });
    }

    const lastUpdated = new Date();
    lastUpdated.setTime(lastUpdated.getTime() - 14 * 60 * 1000);

    return (
        <OverviewGraph
            type='line'
            titleKey='stats.sales.daily'
            series={{ titleKey: 'stats.sales' }}
            dateFormat={(d, language, source) =>
                Intl.DateTimeFormat(language, source === 'chart' ? weekdayFormatOpts : fullDateFormatIOpts).format(d)
            }
            values={values}
            lastUpdated={lastUpdated}
        />
    );
}
