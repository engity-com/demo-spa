import './Footer.css';
import { Link } from '@/components/Link';
import type React from 'react';

interface FooterProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> {}

export function Footer(props: FooterProps) {
    return (
        <footer className='Footer' {...props}>
            <Link toKey='legalNotice.url' titleKey='legalNotice' />
            <Link toKey='privacyPolicy.url' titleKey='privacyPolicy' />
            <Link toKey='termsOfService.url' titleKey='termsOfService' />
        </footer>
    );
}
