import { OverviewStat } from '@/components/OverviewStat';
import type { HeadingKind } from '@/lib/headings';

interface TodaysUsersProps {
    readonly titleAs?: HeadingKind | undefined;
}

export function TodaysUsers(props: TodaysUsersProps) {
    return (
        <OverviewStat titleAs={props.titleAs} titleKey='stats.todaysUsers' value={2_233_981} previous={{ value: 2_090_321, pointInTime: '-1m' }} />
    );
}
