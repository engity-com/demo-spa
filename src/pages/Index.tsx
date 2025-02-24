import { Card, Flex, Box as RBox, Text } from '@radix-ui/themes';
import type React from 'react';

interface BoxProps {
    readonly children?: React.ReactNode;
}

function Box(props: BoxProps) {
    return (
        <RBox minWidth='300px' style={{ flex: '0 0 auto' }}>
            {props.children}
        </RBox>
    );
}

export function Index() {
    return (
        <>
            <Flex direction='row' gap='2' wrap='wrap'>
                <Box>
                    <Card>Foo</Card>
                </Box>
                <Box>
                    <Card>Foo2</Card>
                </Box>
                <Box>
                    <Card>Foo3</Card>
                </Box>
                <Box>
                    <Card>Foo4</Card>
                </Box>
            </Flex>
            <Flex direction='column' gap='2'>
                <Text size={'9'}>
                    Vero et accusam erat lorem justo elitr eos ut dolor rebum ipsum tempor tempor erat in tation. Vero magna ipsum diam veniam sit et.
                    Laoreet duo delenit ipsum aliquyam ea dolore kasd consequat takimata. Et dolor et ipsum eirmod eum ipsum ex laoreet imperdiet.
                    Euismod sea illum elitr takimata clita sit illum dolor. Ipsum accumsan delenit vero sadipscing amet clita lorem et doming. Ipsum
                    magna vel sadipscing. Sed autem diam dolore amet sea et magna at vulputate blandit accusam euismod assum gubergren zzril liber
                    invidunt diam. Est minim sit nulla et dolor commodo dolor sit eirmod kasd invidunt ipsum est duo invidunt. At delenit sed
                    vulputate elit ipsum amet option in hendrerit amet ut nonumy. Consetetur et duis lorem magna sit vel sit minim sed dolore sed
                    tempor iriure eu iriure est. At sea aliquyam vero volutpat et sanctus volutpat diam dolore lorem feugait dolores dolores commodo.
                    Vel et duis eos ipsum. At sea invidunt lorem sea ullamcorper clita takimata dolores dolor.
                </Text>
            </Flex>
        </>
    );
}
