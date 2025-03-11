import { Link } from '@/components';
import { Badge, Button, Callout, Card, Code, DataList, Flex, Heading, Separator } from '@radix-ui/themes';
import { base58_to_binary } from 'base58-js';
import { Info } from 'lucide-react';
import type { User, UserProfile } from 'oidc-client-ts';
import { type ReactNode, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useAuth } from '@echocat/react-oidc-context';
import { stringify as stringifyUuid } from 'uuid';

interface ActionsProps {
    readonly triggerRenew: (() => Promise<boolean>) | undefined;
}

function Actions(props: ActionsProps) {
    if (!props.triggerRenew) {
        return [];
    }

    const { t } = useTranslation();
    const [renewResult, setRenewResult] = useState<boolean | 'active' | undefined>(undefined);

    return (
        <Card>
            <Flex direction='column' gap='2'>
                <Heading as='h2' size='3'>
                    {t('actions')}
                </Heading>
                <Separator orientation='horizontal' size='4' />
                <Flex direction='row' gap='2' wrap='wrap'>
                    {props.triggerRenew && (
                        <Button
                            disabled={renewResult === 'active'}
                            color={renewResult === true ? 'green' : renewResult === false ? 'red' : undefined}
                            onClick={() => {
                                setRenewResult('active');
                                props.triggerRenew?.().then((v) => setRenewResult(v));
                            }}
                        >
                            {t('token.renew')}
                        </Button>
                    )}
                </Flex>
            </Flex>
        </Card>
    );
}

interface ProfileProps {
    readonly profile: UserProfile | undefined;
}

function Profile(props: ProfileProps) {
    if (!props.profile) {
        return [];
    }

    const { t, i18n } = useTranslation();

    const dateFormat = Intl.DateTimeFormat(i18n.language, {
        dateStyle: 'medium',
        timeStyle: 'medium',
    }).format;

    function formatId(v: string, combined?: boolean): ReactNode {
        let result = v;
        const bin = base58_to_binary(v);
        if (bin) {
            try {
                result = stringifyUuid(bin);
                if (combined !== false) {
                    result = `${v} / ${result}`;
                }
            } catch (ignored) {}
        }
        return <Code variant='ghost'>{result}</Code>;
    }

    function formatValue(k: string, v: any): ReactNode {
        if ((k === 'exp' || k === 'iat') && typeof v === 'number') {
            return dateFormat(new Date(v * 1000));
        }
        if (k === 'aud' || k === 'sub') {
            if (typeof v === 'string') {
                return <Code variant='ghost'>{formatId(v)}</Code>;
            }
            if (Array.isArray(v)) {
                return (
                    <Flex direction='row' gap='2' wrap='wrap'>
                        {v.map((v) => (
                            <Code key={v} variant='ghost'>
                                {formatId(v)}
                            </Code>
                        ))}
                    </Flex>
                );
            }
        }
        if (typeof v === 'string' && v.startsWith('https://')) {
            if (k === 'iss') {
                return <Link to={`${v}/.well-known/openid-configuration`}>{v}</Link>;
            }
            return <Link to={v}>{v}</Link>;
        }
        if ((k === 'given_name' || k === 'family_name' || k === 'name') && typeof v === 'string') {
            return v;
        }
        if (k === 'email' && typeof v === 'string') {
            return <Link to={`mailto:${v}`}>{v}</Link>;
        }
        return (
            <Code variant='ghost'>
                <pre>{JSON.stringify(v, null, 2)}</pre>
            </Code>
        );
    }

    return (
        <Card>
            <Flex direction='column' gap='2'>
                <Heading as='h2' size='3'>
                    {t('profile')}
                </Heading>
                <Separator orientation='horizontal' size='4' />
                <DataList.Root>
                    {Object.entries(props.profile).map(([k, v]) => (
                        <DataList.Item key={k}>
                            <DataList.Label>
                                <Code variant='soft'>{k}</Code>
                            </DataList.Label>
                            <DataList.Value>{formatValue(k, v)}</DataList.Value>
                        </DataList.Item>
                    ))}
                </DataList.Root>
            </Flex>
        </Card>
    );
}

interface TokenProps {
    readonly user: User | null | undefined;
}

function Token({ user }: TokenProps) {
    const { t, i18n } = useTranslation();

    if (!user) {
        return [];
    }

    const dateFormat = Intl.DateTimeFormat(i18n.language, {
        dateStyle: 'medium',
        timeStyle: 'medium',
    }).format;

    return (
        <Card>
            <Flex direction='column' gap='2'>
                <Heading as='h2' size='3'>
                    {t('token')}
                </Heading>
                <Separator orientation='horizontal' size='4' />
                <DataList.Root>
                    <DataList.Item>
                        <DataList.Label>
                            <Code variant='soft'>token_type</Code>
                        </DataList.Label>
                        <DataList.Value>
                            <Code variant='ghost'>{user.token_type}</Code>
                        </DataList.Value>
                    </DataList.Item>
                    <DataList.Item>
                        <DataList.Label>
                            <Code variant='soft'>scopes</Code>
                        </DataList.Label>
                        <DataList.Value>
                            <Flex direction='row' gap='2' wrap='wrap'>
                                {user.scopes.map((v) => (
                                    <Badge key={v}>
                                        <Code variant='ghost'>{v}</Code>
                                    </Badge>
                                ))}
                            </Flex>
                        </DataList.Value>
                    </DataList.Item>
                    <DataList.Item>
                        <DataList.Label>
                            <Code variant='soft'>access_token</Code>
                        </DataList.Label>
                        <DataList.Value>
                            <Code variant='ghost'>{user.access_token}</Code>
                        </DataList.Value>
                    </DataList.Item>
                    {user.refresh_token && (
                        <DataList.Item>
                            <DataList.Label>
                                <Code variant='soft'>refresh_token</Code>
                            </DataList.Label>
                            <DataList.Value>
                                <Code variant='ghost'>{user.refresh_token}</Code>
                            </DataList.Value>
                        </DataList.Item>
                    )}
                    <DataList.Item>
                        <DataList.Label>
                            <Code variant='soft'>id_token</Code>
                        </DataList.Label>
                        <DataList.Value>
                            <Code variant='ghost'>{user.id_token}</Code>
                        </DataList.Value>
                    </DataList.Item>
                    <DataList.Item>
                        <DataList.Label>
                            <Code variant='soft'>expires_at</Code>
                        </DataList.Label>
                        <DataList.Value>{user.expires_at && dateFormat(new Date(user.expires_at * 1000))}</DataList.Value>
                    </DataList.Item>
                    {user.session_state && (
                        <DataList.Item>
                            <DataList.Label>
                                <Code variant='soft'>session_state</Code>
                            </DataList.Label>
                            <DataList.Value>
                                <Code variant='ghost'>{user.session_state}</Code>
                            </DataList.Value>
                        </DataList.Item>
                    )}
                </DataList.Root>
            </Flex>
        </Card>
    );
}

export function Developer() {
    const { t, i18n } = useTranslation();
    const auth = useAuth();

    return (
        <Flex gap='2' direction='column'>
            <Callout.Root color='gray' size='1'>
                <Callout.Icon>
                    <Info />
                </Callout.Icon>
                <Callout.Text size='2'>
                    {t('developer.introduction')}
                    <br />
                    <Trans i18nKey='demo.sourceHint' t={t} i18n={i18n} components={{ here: <Link to='https://github.com/engity-com/demo-spa' /> }} />
                </Callout.Text>
            </Callout.Root>

            <Actions triggerRenew={() => auth.signinSilent().then((u) => !!u)} />
            <Profile profile={auth.user?.profile} />
            <Token user={auth.user} />
        </Flex>
    );
}
