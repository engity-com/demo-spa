import { random } from '@/lib';
import { OverviewGraph, type TimedValue } from '../index';

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
    const rand = random.mulberry32(thisMonth.getTime() + 121);
    for (let i = props.amountOfMonths; i >= 0; i--) {
        const date = new Date(thisMonth);
        date.setMonth(thisMonth.getMonth() - i);
        values.push({
            date: date,
            value: Math.round(random.inRange(rand, 0, 750)),
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
