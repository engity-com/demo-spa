import { OverviewStat } from '@/components';
import type { HeadingKind } from '@/lib';

interface TodaysAdViewsProps {
    readonly titleAs?: HeadingKind | undefined;
}

export function TodaysAdViews(props: TodaysAdViewsProps) {
    return <OverviewStat titleAs={props.titleAs} titleKey='stats.adViews' value={7_109} previous={{ value: 10_321, pointInTime: '-1d' }} />;
}
