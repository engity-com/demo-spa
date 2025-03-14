import { OverviewStat } from '@/components';
import type { HeadingKind } from '@/lib';

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
