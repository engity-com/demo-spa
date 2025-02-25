import { OverviewStat } from '@/components/OverviewStat';
import type { HeadingKind } from '@/lib/headings';

interface TodaysMoneyProps {
    readonly titleAs?: HeadingKind | undefined;
}

export function TodaysMoney(props: TodaysMoneyProps) {
    return (
        <OverviewStat
            titleAs={props.titleAs}
            titleKey='stats.todaysMoney'
            value={543_178}
            unit='USD'
            previous={{ value: 409_982, pointInTime: '-1w' }}
        />
    );
}
