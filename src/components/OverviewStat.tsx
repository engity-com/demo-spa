import type { HeadingKind } from '@/lib/headings';
import { Card, Flex, Heading, Separator, Text } from '@radix-ui/themes';
import { useTranslation } from 'react-i18next';

type Unit = 'USD' | undefined;

interface OverviewStatProps {
    readonly titleKey: string;
    readonly titleAs?: HeadingKind | undefined;
    readonly unit?: Unit;
    readonly value: number;
    readonly previous?:
        | {
              value: number;
              pointInTime: '-1d' | '-1w' | '-1m';
          }
        | undefined;
}

function formatNumber(v: number, language: string, unit: Unit): string {
    const isCurrency = unit === 'USD';
    return Intl.NumberFormat(language, {
        style: isCurrency ? 'currency' : undefined,
        currency: isCurrency ? unit : undefined,
        currencyDisplay: isCurrency ? 'symbol' : undefined,
        notation: 'compact',
        compactDisplay: 'short',
        maximumFractionDigits: 1,
    }).format(v);
}

function formatDifferencePercentage(now: number, last: number, language: string): string {
    const absolute = now - last;
    return `${absolute > 0 ? '+' : ''}${Intl.NumberFormat(language, {
        maximumFractionDigits: 1,
        style: 'percent',
    }).format(absolute / last)}`;
}

export function OverviewStat(props: OverviewStatProps) {
    const { t, i18n } = useTranslation();
    return (
        <Card>
            <Flex direction='column' gap='2'>
                <Heading as={props.titleAs || 'h2'} size='3' weight='regular'>
                    {t(props.titleKey)}
                </Heading>
                <Text size='5' weight='bold'>
                    {formatNumber(props.value, i18n.language, props.unit)}
                </Text>
                {props.previous && (
                    <>
                        <Separator orientation='horizontal' size='4' />
                        <Flex direction='row' gap='2' align='baseline'>
                            <Text
                                size='3'
                                color={props.value === props.previous.value ? undefined : props.value > props.previous.value ? 'green' : 'red'}
                                weight='bold'
                            >
                                {formatDifferencePercentage(props.value, props.previous.value, i18n.language)}
                            </Text>
                            <Text size='2'>
                                {t(`stats.thanPrevious.${props.previous.pointInTime}`, {
                                    value: formatDifferencePercentage(props.value, props.previous.value, i18n.language),
                                })}
                            </Text>
                        </Flex>
                    </>
                )}
            </Flex>
        </Card>
    );
}
