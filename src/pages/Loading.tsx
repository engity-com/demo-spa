import { Spinner } from '@/components';
import { Container, Flex, Grid, Text } from '@radix-ui/themes';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface LoadingProps {
    titleKey?: string | undefined;
    title?: string | undefined;
    defaultTitle?: boolean | undefined;

    visibilityDelay?: number | boolean;
}

export function Loading(props: LoadingProps) {
    const [visible, setVisible] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    useEffect(() => {
        if (props.visibilityDelay) {
            timerRef.current = setTimeout(
                () => {
                    setVisible(true);
                },
                typeof props.visibilityDelay === 'number' ? props.visibilityDelay : 2000,
            );

            return () => {
                if (timerRef.current) {
                    clearTimeout(timerRef.current);
                    timerRef.current = null;
                }
            };
        }
    }, [props.visibilityDelay]);

    const { t } = useTranslation();
    const title = props.title || (props.titleKey && t(props.titleKey)) || (props.defaultTitle === true && t('loading.shortMessage')) || undefined;
    return (
        (visible || !props.visibilityDelay) && (
            <Grid className='navigator-height-100' align='center' columns='auto 1fr auto' rows='auto 1fr auto'>
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
