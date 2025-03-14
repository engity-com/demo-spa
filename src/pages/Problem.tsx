// @ts-ignore
import Img from '@/assets/dead-computer.svg';
import { Flex, Separator, Text } from '@radix-ui/themes';
import i18next from 'i18next';
import { createContext, PureComponent, type ReactNode, useContext } from 'react';
import { useRouteError } from 'react-router';

type ProblemSink = (e: unknown, msg?: string) => void;
const Context = createContext<ProblemSink | undefined>(undefined);

interface ProblemProps {
    readonly children?: ReactNode | undefined;
    readonly problem?: unknown;
    readonly log?: boolean;
}

interface ProblemState {
    readonly problem?: unknown;
}

export interface WithProblemSink {
    readonly doOnProblem: (e: unknown, msg?: string) => void;
}

export function useProblemSink() {
    const ctx = useContext<ProblemSink | undefined>(Context);

    return ctx || (() => undefined);
}

export class Problem extends PureComponent<ProblemProps, ProblemState> implements WithProblemSink {
    constructor(props: ProblemProps) {
        super(props);
        this.state = {
            problem: this.props.problem,
        };
        this.doWithProblem(this.props.problem);
    }

    doOnProblem(e: unknown, msg?: string) {
        this.doWithProblem(e, msg);
        this.setState({
            ...this.state,
            problem: e,
        });
    }

    private doWithProblem(e: unknown, msg?: string) {
        if (!e) {
            return;
        }

        if (this.props.log === undefined || this.props.log) {
            console.error(msg || 'Unhandled problem occurred.', e);
        }
    }

    componentDidCatch(error: Error) {
        this.doOnProblem(error);
    }

    render() {
        if (!this.state.problem) {
            return <Context.Provider value={(e: unknown, msg?: string) => this.doOnProblem(e, msg)}>{this.props.children}</Context.Provider>;
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
    return <Problem problem={error} log={false} />;
}
