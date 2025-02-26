import { useTheme } from '@/components/page';
import type { HeadingKind } from '@/lib';
import { getLocale } from '@/lib';
import { Card, Flex, Heading, Text } from '@radix-ui/themes';
import { formatDistanceToNow } from 'date-fns';
import { Clock } from 'lucide-react';
import Chart from 'react-apexcharts';
import { useTranslation } from 'react-i18next';

type D = Date | number | string;
type Source = 'chart' | 'tooltip';

export interface TimedValue {
    readonly date: D;
    readonly value: number;
}

interface OverviewGraphProps {
    readonly type: 'line' | 'area' | 'bar';
    readonly titleKey: string;
    readonly titleAs?: HeadingKind | undefined;
    readonly subTitleKey?: string | undefined;
    readonly series?:
        | {
              title?: string | undefined;
              titleKey?: string | undefined;
          }
        | undefined;
    readonly values: TimedValue[];
    readonly lastUpdated?: Date;
    readonly valueFormat?: (v: number, language: string, source: Source) => string;
    readonly dateFormat?: (d: Date, language: string, source: Source) => any;
}

export function OverviewGraph(props: OverviewGraphProps) {
    const { t, i18n } = useTranslation();
    const theme = useTheme();

    const seriesTitle = props.series?.title || (props.series?.titleKey && t(props.series?.titleKey)) || undefined;
    const dateFormat = props.dateFormat || ((d: Date, language: string) => Intl.DateTimeFormat(language).format(d));
    const valueFormat = props.valueFormat || ((v: number, language: string) => Intl.NumberFormat(language).format(v));
    const subTitle = (props.subTitleKey && t(props.subTitleKey)) || t(`${props.titleKey}.subTitle`) || undefined;
    return (
        <Card>
            <Flex direction='column' gap='2'>
                <Heading as={props.titleAs || 'h2'} size='3' weight='bold'>
                    {t(props.titleKey)}
                </Heading>
                {subTitle && <Text size='2'>{subTitle}</Text>}
                <Chart
                    height='200px'
                    options={{
                        theme: {
                            mode: theme.modeResolved,
                        },
                        tooltip: {
                            enabled: !!seriesTitle,
                        },
                        chart: {
                            zoom: {
                                enabled: false,
                            },
                            background: 'transparent',
                            toolbar: {
                                show: false,
                            },
                            animations: {
                                enabled: false,
                            },
                        },
                        dataLabels: {
                            enabled: false,
                        },
                        stroke: {
                            curve: 'straight',
                        },
                        xaxis: {
                            labels: {
                                formatter(value: any, _: any, opts: any): string | string[] {
                                    let source: Source;
                                    switch (props.type) {
                                        case 'bar':
                                            source = opts ? 'chart' : 'tooltip';
                                            break;
                                        default:
                                            source = 'chart';
                                            break;
                                    }
                                    return value ? dateFormat(new Date(value), i18n.language, source) : [];
                                },
                            },
                            categories: props.values.map((tv) =>
                                typeof tv.date === 'number' || typeof tv.date === 'string' ? new Date(tv.date) : tv.date,
                            ),
                        },
                        yaxis: {
                            labels: {
                                formatter(val: number, opts: any): string | string[] {
                                    return valueFormat(
                                        val,
                                        i18n.language,
                                        typeof opts === 'object' && 'seriesIndex' in opts && opts.seriesIndex ? 'tooltip' : 'chart',
                                    );
                                },
                            },
                        },
                    }}
                    series={[{ name: seriesTitle, data: props.values.map((tv) => tv.value) }]}
                    type={props.type}
                />
                {props.lastUpdated && (
                    <Flex
                        direction='row'
                        align='center'
                        gap='2'
                        title={Intl.DateTimeFormat(i18n.language, { dateStyle: 'medium', timeStyle: 'medium' }).format(props.lastUpdated)}
                    >
                        <Clock size='14' />
                        <Text style={{ cursor: 'default' }} size='2'>
                            {formatDistanceToNow(props.lastUpdated, { addSuffix: true, locale: getLocale(i18n.language) })}
                        </Text>
                    </Flex>
                )}
            </Flex>
        </Card>
    );
}
