import type { Environment } from './type';

export const environment: Environment = {
    production: true,
    clientRoot: 'https://demo.engity.app/',
    variants: {
        default: {
            stsAuthority: 'https://id.demo.engity.app/v1/',
            clientId: '3LtsS8SrpAwkAEs5eBUVe2',
            afterLogoutUrl: 'https://engity.com',
        },
        passkey: {
            subPath: 'passkey',
            stsAuthority: 'https://id.demo.engity.app/passkey/v1/',
            clientId: 'BuEoWWcx2GPfAfgAp6FiJh',
        },
        password: {
            subPath: 'password',
            stsAuthority: 'https://id.demo.engity.app/password/v1/',
            clientId: 'Fu8SFo7hFt3sHWppGJiKfj',
        },
        socialLogins: {
            subPath: 'social-logins',
            stsAuthority: 'https://id.demo.engity.app/social-logins/v1/',
            clientId: '6kuddgmuyvfarBcCsZrPU9',
        },
        magicLink: {
            subPath: 'magic-link',
            stsAuthority: 'https://id.demo.engity.app/magic-link/v1/',
            clientId: '3LtsS8SrpAwkAEs5eBUVe3',
        },
        username: {
            subPath: 'username',
            stsAuthority: 'https://id.demo.engity.app/username/v1/',
            clientId: '3LtsS8SrpAwkAEs5eBUVe4',
        },
        tfaRequired: {
            subPath: 'tfa-required',
            stsAuthority: 'https://id.demo.engity.app/tfa-required/v1/',
            clientId: '9KjGEminbyhUB5sXAn3bBT',
        },
        tfaForbidden: {
            subPath: 'tfa-forbidden',
            stsAuthority: 'https://id.demo.engity.app/tfa-forbidden/v1/',
            clientId: '6Ud9hjFmUQfHQTQp1o4KQH',
        },
        exposeExistence: {
            subPath: 'existence-expose',
            stsAuthority: 'https://id.demo.engity.app/existence-expose/v1/',
            clientId: 'ExpsjPRjj6oVhaJTqvYvN9',
        },
    },
};
