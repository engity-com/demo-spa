import { OverviewGraph, type TimedValue } from '@/components/OverviewGraph';
import { random } from '@/lib/random';

const monthFormatOpts: Intl.DateTimeFormatOptions = {
    month: 'short',
};
const fullDateFormatIOpts: Intl.DateTimeFormatOptions = {
    dateStyle: 'full',
};

interface CompletedTasksProps {
    readonly amountOfMonths: number;
}

export function CompletedTasks(props: CompletedTasksProps) {
    const thisMonth = new Date();
    thisMonth.setHours(0, 0, 0, 0);
    thisMonth.setDate(1);

    const values: TimedValue[] = [];
    for (let i = props.amountOfMonths; i >= 0; i--) {
        const date = new Date(thisMonth);
        date.setMonth(thisMonth.getMonth() * i * -1);
        values.push({
            date: date,
            value: Math.round(random.inRange(random.mulberry32(date.getTime()), 0, 750)),
        });
    }

    const lastUpdated = new Date();

    return (
        <OverviewGraph
            type='line'
            titleKey='stats.completedTasks'
            series={{ titleKey: 'tasks' }}
            dateFormat={(d, language, source) => Intl.DateTimeFormat(language, source === 'chart' ? monthFormatOpts : fullDateFormatIOpts).format(d)}
            values={values}
            lastUpdated={lastUpdated}
        />
    );
}
