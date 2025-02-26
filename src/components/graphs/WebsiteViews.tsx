import { OverviewGraph, type TimedValue } from '@/components';
import { random } from '@/lib';

interface WebsiteViewsProps {
    readonly amountOfDays: number;
}

export function WebsiteViews(props: WebsiteViewsProps) {
    const today = new Date();
    today.setHours(12, 0, 0, 0);

    const values: TimedValue[] = [];
    for (let i = props.amountOfDays; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() * i * -1);
        values.push({
            date: date,
            value: Math.round(random.inRange(random.mulberry32(date.getTime()), 0, 100)),
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
