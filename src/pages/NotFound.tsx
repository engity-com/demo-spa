import { Flex, Separator, Text } from '@radix-ui/themes';
import { useTranslation } from 'react-i18next';
import Img from '@/assets/dead-computer.svg';

export function NotFound() {
    const { t } = useTranslation();
    return (
        <Flex direction='column' className='navigator-height-75' align='center' justify='center' gap='5'>
            <Img height='20%' />
            <Flex direction='row' align='center' gap='4' justify='center'>
                <Text size='7'>404</Text>
                <Separator orientation='vertical' />
                <Text size='7'>{t('notFound')}</Text>
            </Flex>
        </Flex>
    );
}
