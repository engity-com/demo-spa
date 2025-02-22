import './Header.css';
// @ts-ignore
import Logo from '@/assets/logo-without-spacing.svg';
import { CurrentUserAvatar } from '@/components/Avatar';
import { Link } from '@/components/Link';
import { useSideBar } from '@/components/SideBar';
import { ThemeToggle } from '@/components/Theme';
import { DropdownMenu, Flex, Text } from '@radix-ui/themes';
import type React from 'react';
import { useEffect, useState } from 'react';
import { useAuth } from 'react-oidc-context';
import { Breadcrumb } from './Breadcrumb';

const scrollTopThreshold = 1;

interface HeaderProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> {}

export function Header(props: HeaderProps) {
    const [scrollOver, setScrollOver] = useState<boolean>(false);
    const sideBar = useSideBar();
    const auth = useAuth();

    useEffect(() => {
        const onScroll = () => setScrollOver(document.body.scrollTop > scrollTopThreshold || document.documentElement.scrollTop > scrollTopThreshold);

        window.addEventListener('scroll', onScroll);

        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const doLogout = () => auth.signoutRedirect();

    return (
        <header data-scroll-over={scrollOver} className='Header' {...props}>
            <Flex direction='row' align='center' gap='3' className='left'>
                <button type='button' onClick={() => sideBar.toggleState()}>
                    <svg className='hamburger' data-state={sideBar.stateResolved} viewBox='0 0 100 100'>
                        <path
                            className='line top'
                            d='m 30,33 h 40 c 0,0 8.5,-0.68551 8.5,10.375 0,8.292653 -6.122707,9.002293 -8.5,6.625 l -11.071429,-11.071429'
                        />
                        <path className='line middle' d='m 70,50 h -40' />
                        <path
                            className='line bottom'
                            d='m 30,67 h 40 c 0,0 8.5,0.68551 8.5,-10.375 0,-8.292653 -6.122707,-9.002293 -8.5,-6.625 l -11.071429,11.071429'
                        />
                    </svg>
                </button>
                <Link to='/' className='about'>
                    <Logo className='logo' />
                    <Text size='3' weight='medium' className='title'>
                        IdP Demo
                    </Text>
                </Link>
                <Breadcrumb />
            </Flex>
            <Flex direction='row' align='center' gap='3' className='right'>
                <ThemeToggle />

                <DropdownMenu.Root>
                    <DropdownMenu.Trigger>
                        <button>
                            <CurrentUserAvatar />
                        </button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content>
                        <DropdownMenu.Item onClick={doLogout}>Logout</DropdownMenu.Item>
                    </DropdownMenu.Content>
                </DropdownMenu.Root>
            </Flex>
        </header>
    );
}
