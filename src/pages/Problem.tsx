// @ts-ignore
import Img from '@/assets/dead-computer.svg';
import { Flex, Separator, Text } from '@radix-ui/themes';
import i18next from 'i18next';
import { PureComponent, type ReactNode } from 'react';
import { useRouteError } from 'react-router';

interface ProblemProps {
    readonly children?: ReactNode | undefined;
    readonly error?: unknown;
    readonly log?: boolean;
}

interface ProblemState {
    readonly error?: unknown;
}

export class Problem extends PureComponent<ProblemProps, ProblemState> {
    constructor(props: ProblemProps) {
        super(props);
        this.state = {
            error: this.props.error,
        };
        this.doWithError(this.props.error);
    }

    private doOnError(error: unknown) {
        this.doWithError(error);
        this.setState({
            ...this.state,
            error,
        });
    }

    private doWithError(error: unknown) {
        if (!error) {
            return;
        }

        if (this.props.log === undefined || this.props.log) {
            console.error('Unhandled problem occurred: ', error);
        }
    }

    componentDidCatch(error: Error) {
        this.doOnError(error);
    }

    render() {
        if (!this.state.error) {
            return this.props.children;
        }

        const t = i18next.t;
        return (
            <Flex className='navigator-height-75' direction='column' align='center' justify='center' gap='5' p='4'>
                <Img height='20%' />
                <Flex direction='row' align='center' gap='4' justify='center'>
                    <Text size='7'>500</Text>
                    <Separator orientation='vertical' />
                    <Text size='7'>{t('problem.unexpected')}</Text>
                </Flex>
                <Text size='3' style={{ maxWidth: '520px' }} align='center'>
                    {t('problem.unexpected.message')}
                </Text>
            </Flex>
        );
    }
}

export function ProblemInRouter() {
    const error = useRouteError() as Error;
    return <Problem error={error} log={false} />;
}
