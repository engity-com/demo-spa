import type { HeadingKind } from '@/lib';
import { Card, Flex, Heading, Table } from '@radix-ui/themes';
import { useTranslation } from 'react-i18next';

interface NewCustomersProps {
    readonly titleAs?: HeadingKind | undefined;
}

export function NewCustomers(props: NewCustomersProps) {
    const { t, i18n } = useTranslation();
    const dateFormat = Intl.DateTimeFormat(i18n.language).format;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = (ref: number) => {
        const result = new Date(today);
        result.setDate(today.getDate() - ref);
        return result;
    };

    return (
        <Card>
            <Flex direction='column' gap='3'>
                <Heading as={props.titleAs || 'h2'} size='3'>
                    {t('customers.new')}
                </Heading>
                <Table.Root variant='surface'>
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeaderCell>{t('company')}</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>{t('contact')}</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>{t('email')}</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>{t('date')}</Table.ColumnHeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        <Table.Row>
                            <Table.RowHeaderCell>ACME Corp.</Table.RowHeaderCell>
                            <Table.Cell>Danilo Sousa</Table.Cell>
                            <Table.Cell>acme@example.com</Table.Cell>
                            <Table.Cell>{dateFormat(date(3))}</Table.Cell>
                        </Table.Row>

                        <Table.Row>
                            <Table.RowHeaderCell>Red Marple Carped Inc.</Table.RowHeaderCell>
                            <Table.Cell>Zahra Ambessa</Table.Cell>
                            <Table.Cell>rmc@example.com</Table.Cell>
                            <Table.Cell>{dateFormat(date(6))}</Table.Cell>
                        </Table.Row>

                        <Table.Row>
                            <Table.RowHeaderCell>Foobar GmbH</Table.RowHeaderCell>
                            <Table.Cell>Jasper Eriksson</Table.Cell>
                            <Table.Cell>foobar@example.com</Table.Cell>
                            <Table.Cell>{dateFormat(date(7))}</Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table.Root>
            </Flex>
        </Card>
    );
}
