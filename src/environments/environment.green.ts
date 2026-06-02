import type { Environment } from './type';

export const environment: Environment = {
    production: true,
    clientRoot: 'https://demo.engity.green/',
    variants: {
        default: {
            stsAuthority: 'https://id.demo.engity.green/v1/',
            clientId: '3LtsS8SrpAwkAEs5eBUVe2',
        },
        passkey: {
            subPath: 'passkey',
            stsAuthority: 'https://id.demo.engity.green/passkey/v1/',
            clientId: 'BuEoWWcx2GPfAfgAp6FiJh',
        },
        password: {
            subPath: 'password',
            stsAuthority: 'https://id.demo.engity.green/password/v1/',
            clientId: 'Fu8SFo7hFt3sHWppGJiKfj',
        },
        socialLogins: {
            subPath: 'social-logins',
            stsAuthority: 'https://id.demo.engity.green/social-logins/v1/',
            clientId: '6kuddgmuyvfarBcCsZrPU9',
        },
        magicLink: {
            subPath: 'magic-link',
            stsAuthority: 'https://id.demo.engity.green/magic-link/v1/',
            clientId: '3LtsS8SrpAwkAEs5eBUVe3',
        },
        username: {
            subPath: 'username',
            stsAuthority: 'https://id.demo.engity.green/username/v1/',
            clientId: '3LtsS8SrpAwkAEs5eBUVe4',
        },
        tfaRequired: {
            subPath: 'tfa-required',
            stsAuthority: 'https://id.demo.engity.green/tfa-required/v1/',
            clientId: '9KjGEminbyhUB5sXAn3bBT',
        },
        tfaForbidden: {
            subPath: 'tfa-forbidden',
            stsAuthority: 'https://id.demo.engity.green/tfa-forbidden/v1/',
            clientId: '6Ud9hjFmUQfHQTQp1o4KQH',
        },
        exposeExistence: {
            subPath: 'existence-expose',
            stsAuthority: 'https://id.demo.engity.green/existence-expose/v1/',
            clientId: 'ExpsjPRjj6oVhaJTqvYvN9',
        },
    },
};
