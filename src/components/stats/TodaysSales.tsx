import { OverviewStat } from '@/components';
import type { HeadingKind } from '@/lib';

interface TodaysSalesProps {
    readonly titleAs?: HeadingKind | undefined;
}

export function TodaysSales(props: TodaysSalesProps) {
    return (
        <OverviewStat titleAs={props.titleAs} titleKey='stats.sales' value={103_430} unit='USD' previous={{ value: 99_178, pointInTime: '-1d' }} />
    );
}
