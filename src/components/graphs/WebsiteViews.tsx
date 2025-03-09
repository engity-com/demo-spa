import { random } from '@/lib';
import { OverviewGraph, type TimedValue } from '../index';

interface WebsiteViewsProps {
    readonly amountOfDays: number;
}

export function WebsiteViews(props: WebsiteViewsProps) {
    const today = new Date();
    today.setHours(12, 0, 0, 0);

    const values: TimedValue[] = [];
    const rand = random.mulberry32(today.getTime() + 120);
    for (let i = props.amountOfDays; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        values.push({
            date: date,
            value: Math.round(random.inRange(rand, 0, 100)),
        });
    }

    const lastUpdated = new Date();
    lastUpdated.setTime(lastUpdated.getTime() - 2 * 24 * 60 * 60 * 1000);

    return (
        <OverviewGraph
            type='bar'
            titleKey='stats.website.views'
            series={{ titleKey: 'views' }}
            dateFormat={(d, language, source) =>
                Intl.DateTimeFormat(language, source === 'chart' ? { weekday: 'short' } : { dateStyle: 'full' }).format(d)
            }
            values={values}
            lastUpdated={lastUpdated}
        />
    );
}
