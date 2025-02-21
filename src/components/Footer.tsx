import './Footer.css';
import { Link } from '@radix-ui/themes';
import type React from 'react';

interface FooterProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> {}

export function Footer(props: FooterProps) {
    return (
        <footer className='Footer' {...props}>
            <Link href='https://engity.com/legal-notice/'>Legal Notice</Link>
            <Link href='https://engity.com/data-privacy/'>Privacy policy</Link>
            <Link href='https://engity.com/terms/'>Terms of Service</Link>
        </footer>
    );
}
