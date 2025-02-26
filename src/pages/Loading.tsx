import { Spinner } from '@/components';
import { Container, Flex, Grid, Text } from '@radix-ui/themes';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface LoadingProps {
    titleKey?: string | undefined;
    title?: string | undefined;
    defaultTitle?: boolean | undefined;

    visibilityDelay?: number;
}

export function Loading(props: LoadingProps) {
    const [visible, setVisible] = useState(false);

    if (props.visibilityDelay) {
        const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
        useEffect(() => {
            setTimer(
                setTimeout(() => {
                    setVisible(true);
                }, props.visibilityDelay),
            );

            return () => {
                if (timer) {
                    clearTimeout(timer);
                    setTimer(null);
                }
            };
        }, [props.visibilityDelay, timer]);
    }

    const { t } = useTranslation();
    const title = props.title || (props.titleKey && t(props.titleKey)) || (props.defaultTitle === true && t('loading.shortMessage')) || undefined;
    return (
        (visible || !props.visibilityDelay) && (
            <Grid align='center' columns='auto 1fr auto' rows='auto 1fr auto' style={{ height: '100dvh' }}>
                <Container size='1' style={{ gridRow: 2, gridColumn: 2 }}>
                    <Flex direction='column' align='center' justify='center' gap='6'>
                        <Spinner />
                        {title && <Text>{title}</Text>}
                    </Flex>
                </Container>
            </Grid>
        )
    );
}
