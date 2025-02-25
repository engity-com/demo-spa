import { OverviewStat } from '@/components/OverviewStat';
import type { HeadingKind } from '@/lib/headings';

interface TodaysSalesProps {
    readonly titleAs?: HeadingKind | undefined;
}

export function TodaysSales(props: TodaysSalesProps) {
    return (
        <OverviewStat titleAs={props.titleAs} titleKey='stats.sales' value={103_430} unit='USD' previous={{ value: 99_178, pointInTime: '-1d' }} />
    );
}
