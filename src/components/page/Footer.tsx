import './Footer.css';
import { Link } from '@/components';
import { Flex, Text } from '@radix-ui/themes';
import type React from 'react';

interface FooterProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> {}

export function Footer(props: FooterProps) {
    return (
        <footer className='Footer' {...props}>
            <Flex direction='row' gapX='1.3em' gapY='0' wrap='wrap' justify='center'>
                <Link toKey='legalNotice.url' titleKey='legalNotice' />
                <Link toKey='privacyPolicy.url' titleKey='privacyPolicy' />
                <Link toKey='termsOfService.url' titleKey='termsOfService' />
            </Flex>
            <Text size='2'>
                © {new Date().getFullYear()} <Link toKey='app.company.url'>Engity GmbH</Link>
            </Text>
        </footer>
    );
}
