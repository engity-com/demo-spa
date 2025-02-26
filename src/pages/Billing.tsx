import { Flex, Text } from '@radix-ui/themes';
import { loremIpsum } from 'lorem-ipsum';

export function Billing() {
    return (
        <Flex gap='2' direction='column'>
            {loremIpsum({ count: 25, suffix: '\n', units: 'paragraphs' })
                .split('\n')
                .map((v, i) => (
                    <Text key={`c${i}` || ''}>{v}</Text>
                ))}
        </Flex>
    );
}
